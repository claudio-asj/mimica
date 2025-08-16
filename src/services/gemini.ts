import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Card, Category } from "../types";
import { env } from "../lib/env";

export interface GenerateCardsOptions {
  category: Category;
  difficulty: "easy" | "medium" | "hard";
  count: number;
  language?: "pt-BR" | "en";
}

export interface GenerateCardsResponse {
  cards: Card[];
  error?: string;
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null =
    null;

  constructor() {
    // API key will be set via environment variable or direct call
  }

  initialize(apiKey: string) {
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      return true;
    } catch (error) {
      env.error("Failed to initialize Gemini:", error);
      return false;
    }
  }

  isInitialized(): boolean {
    return this.genAI !== null && this.model !== null;
  }

  private getCategoryPrompt(
    category: Category,
    difficulty: string,
    language: string,
  ): string {
    const difficultyMap: Record<string, string> = {
      easy: language === "pt-BR" ? "fácil" : "easy",
      medium: language === "pt-BR" ? "médio" : "medium",
      hard: language === "pt-BR" ? "difícil" : "hard",
    };

    const categoryDescriptions: Record<Category, string> = {
      "Pessoa/Personagem":
        language === "pt-BR"
          ? "pessoas famosas, personagens de filmes, desenhos, livros, histórias"
          : "famous people, movie characters, cartoon characters, book characters",
      Lugar:
        language === "pt-BR"
          ? "lugares, cidades, países, pontos turísticos, ambientes"
          : "places, cities, countries, tourist attractions, environments",
      Objeto:
        language === "pt-BR"
          ? "objetos do dia a dia, utensílios, ferramentas, equipamentos"
          : "everyday objects, utensils, tools, equipment",
      Ação:
        language === "pt-BR"
          ? "ações, verbos, atividades que podem ser representadas por gestos"
          : "actions, verbs, activities that can be represented by gestures",
      Animal:
        language === "pt-BR"
          ? "animais domésticos, selvagens, marinhos, insetos"
          : "domestic animals, wild animals, marine animals, insects",
      Coisa:
        language === "pt-BR"
          ? "conceitos abstratos, sentimentos, situações, fenômenos"
          : "abstract concepts, feelings, situations, phenomena",
      Livre:
        language === "pt-BR"
          ? "qualquer categoria, mistura de pessoas, lugares, objetos, ações, animais"
          : "any category, mix of people, places, objects, actions, animals",
    };

    if (language === "pt-BR") {
      return `Você é um gerador de cartas para um jogo de mímica/charades em português brasileiro.

Categoria: ${category} (${categoryDescriptions[category]})
Dificuldade: ${difficultyMap[difficulty]}

Para dificuldade ${difficultyMap[difficulty]}:
- Fácil: palavras/conceitos muito conhecidos e simples de representar
- Médio: palavras/conceitos conhecidos mas com alguma complexidade
- Difícil: palavras/conceitos mais complexos, específicos ou abstratos

Gere exatamente 5 prompts para esta categoria e dificuldade.
Cada prompt deve ser uma palavra ou frase curta (máximo 3 palavras) que possa ser representada por mímica/gestos.

IMPORTANTE: Responda APENAS com um array JSON válido no formato:
["prompt1", "prompt2", "prompt3", "prompt4", "prompt5"]

Não inclua explicações, apenas o array JSON.`;
    } else {
      return `You are a card generator for a charades/mime game in English.

Category: ${category} (${categoryDescriptions[category]})
Difficulty: ${difficultyMap[difficulty]}

For ${difficultyMap[difficulty]} difficulty:
- Easy: very well-known words/concepts that are simple to represent
- Medium: known words/concepts but with some complexity
- Hard: more complex, specific or abstract words/concepts

Generate exactly 5 prompts for this category and difficulty.
Each prompt should be a word or short phrase (maximum 3 words) that can be represented by mime/gestures.

IMPORTANT: Respond ONLY with a valid JSON array in the format:
["prompt1", "prompt2", "prompt3", "prompt4", "prompt5"]

Do not include explanations, just the JSON array.`;
    }
  }

  async generateCards(
    options: GenerateCardsOptions,
  ): Promise<GenerateCardsResponse> {
    if (!this.isInitialized()) {
      return {
        cards: [],
        error: "Gemini service not initialized. Please provide an API key.",
      };
    }

    const {
      category,
      difficulty,
      count,
      language = env.defaultAiLanguage,
    } = options;
    const cards: Card[] = [];

    try {
      // Generate cards in batches to avoid token limits
      const batchSize = Math.min(count, 5);
      const batches = Math.ceil(count / batchSize);

      for (let i = 0; i < batches; i++) {
        const prompt = this.getCategoryPrompt(category, difficulty, language);

        if (!this.model) {
          throw new Error("Model not initialized");
        }

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the JSON response
        let prompts: string[];
        try {
          // Clean the response to extract JSON
          const jsonMatch = text.match(/\[.*?\]/s);
          if (!jsonMatch) {
            throw new Error("No JSON array found in response");
          }
          prompts = JSON.parse(jsonMatch[0]);

          if (!Array.isArray(prompts)) {
            throw new Error("Response is not an array");
          }
        } catch {
          env.error("Failed to parse Gemini response:", text);
          return {
            cards,
            error: "Failed to parse AI response. Please try again.",
          };
        }

        // Create cards from prompts
        const remainingCards = count - cards.length;
        const cardsToCreate = Math.min(prompts.length, remainingCards);

        for (let j = 0; j < cardsToCreate; j++) {
          if (prompts[j] && prompts[j].trim()) {
            cards.push({
              id: `gemini-${Date.now()}-${i}-${j}`,
              category,
              prompts: [prompts[j].trim()],
            });
          }
        }

        // Small delay between requests to avoid rate limiting
        if (i < batches - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      return { cards };
    } catch (error: unknown) {
      env.error("Error generating cards with Gemini:", error);
      return {
        cards,
        error:
          (error as Error).message ||
          "Failed to generate cards. Please check your API key and try again.",
      };
    }
  }

  async generateSingleCard(
    category: Category,
    difficulty: "easy" | "medium" | "hard",
  ): Promise<Card | null> {
    const result = await this.generateCards({
      category,
      difficulty,
      count: 1,
    });

    if (result.error || result.cards.length === 0) {
      return null;
    }

    return result.cards[0];
  }

  // Validate API key without making a full request
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const tempGenAI = new GoogleGenerativeAI(apiKey);
      const tempModel = tempGenAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      // Make a minimal test request
      const result = await tempModel.generateContent("Test");
      await result.response;

      return true;
    } catch (error) {
      env.error("API key validation failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

// Types are already exported at the top of the file
