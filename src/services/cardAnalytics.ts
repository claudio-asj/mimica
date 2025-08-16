import type { Card, Category, Difficulty } from "../types";
import cardsData from "../data/cards.json";

export interface CategoryStats {
  category: Category;
  count: number;
  percentage: number;
  examples: string[];
}

export interface DifficultyStats {
  difficulty: Difficulty;
  count: number;
  percentage: number;
  categories: { [key in Category]?: number };
}

export interface CardAnalytics {
  totalCards: number;
  byCategory: CategoryStats[];
  byDifficulty: DifficultyStats[];
  averagePromptsPerCard: number;
  mostCommonCategory: Category;
  leastCommonCategory: Category;
  deckComposition: {
    traditional: number;
    aiGenerated: number;
  };
}

export interface AICardStats {
  totalGenerated: number;
  byCategory: { [key in Category]?: number };
  byDifficulty: { [key in Difficulty]?: number };
  generationHistory: Array<{
    timestamp: number;
    category: Category;
    difficulty: Difficulty;
    prompt: string;
  }>;
}

class CardAnalyticsService {
  private traditionalCards: Card[] = cardsData as Card[];
  private aiGenerationHistory: AICardStats["generationHistory"] = [];

  // Analyze traditional cards from JSON
  analyzeTraditionalCards(): CardAnalytics {
    const cards = this.traditionalCards;
    const totalCards = cards.length;

    // Count by category
    const categoryCount: { [key in Category]?: number } = {};
    const categoryExamples: { [key in Category]?: string[] } = {};

    cards.forEach((card) => {
      const category = card.category;
      categoryCount[category] = (categoryCount[category] || 0) + 1;

      if (!categoryExamples[category]) {
        categoryExamples[category] = [];
      }

      // Add first prompt as example
      if (card.prompts.length > 0 && categoryExamples[category]!.length < 3) {
        categoryExamples[category]!.push(card.prompts[0]);
      }
    });

    // Convert to CategoryStats array
    const byCategory: CategoryStats[] = Object.entries(categoryCount).map(
      ([category, count]) => ({
        category: category as Category,
        count,
        percentage: (count / totalCards) * 100,
        examples: categoryExamples[category as Category] || [],
      }),
    );

    // Estimate difficulty based on prompt characteristics
    const difficultyCount: { [key in Difficulty]?: number } = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    const difficultyByCategory: {
      [key in Difficulty]: { [key in Category]?: number };
    } = {
      easy: {},
      medium: {},
      hard: {},
    };

    cards.forEach((card) => {
      const difficulty = this.estimateDifficulty(card);
      difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1;

      const category = card.category;
      if (!difficultyByCategory[difficulty][category]) {
        difficultyByCategory[difficulty][category] = 0;
      }
      difficultyByCategory[difficulty][category]!++;
    });

    const byDifficulty: DifficultyStats[] = Object.entries(difficultyCount).map(
      ([difficulty, count]) => ({
        difficulty: difficulty as Difficulty,
        count,
        percentage: (count / totalCards) * 100,
        categories: difficultyByCategory[difficulty as Difficulty],
      }),
    );

    // Calculate averages and extremes
    const averagePromptsPerCard =
      cards.reduce((sum, card) => sum + card.prompts.length, 0) / totalCards;

    const sortedCategories = byCategory.sort((a, b) => b.count - a.count);
    const mostCommonCategory = sortedCategories[0]?.category || "Livre";
    const leastCommonCategory =
      sortedCategories[sortedCategories.length - 1]?.category || "Livre";

    return {
      totalCards,
      byCategory: byCategory.sort((a, b) => b.count - a.count),
      byDifficulty: byDifficulty.sort((a, b) => b.count - a.count),
      averagePromptsPerCard: Math.round(averagePromptsPerCard * 10) / 10,
      mostCommonCategory,
      leastCommonCategory,
      deckComposition: {
        traditional: totalCards,
        aiGenerated: 0,
      },
    };
  }

  // Estimate difficulty based on word characteristics
  private estimateDifficulty(card: Card): Difficulty {
    const prompts = card.prompts;
    let complexityScore = 0;

    prompts.forEach((prompt) => {
      const words = prompt.split(/\s+/);
      const avgWordLength =
        words.reduce((sum, word) => sum + word.length, 0) / words.length;

      // Longer words = more complex
      if (avgWordLength > 8) complexityScore += 2;
      else if (avgWordLength > 6) complexityScore += 1;

      // Multiple words = more complex
      if (words.length > 2) complexityScore += 1;
      else if (words.length > 1) complexityScore += 0.5;

      // Abstract concepts
      const abstractWords = [
        "conceito",
        "sentimento",
        "emoção",
        "ideia",
        "filosofia",
      ];
      if (abstractWords.some((word) => prompt.toLowerCase().includes(word))) {
        complexityScore += 2;
      }

      // Technical terms
      if (prompt.includes("-") || /[A-Z]{2,}/.test(prompt)) {
        complexityScore += 1;
      }
    });

    const avgComplexity = complexityScore / prompts.length;

    if (avgComplexity <= 1) return "easy";
    if (avgComplexity <= 2.5) return "medium";
    return "hard";
  }

  // Track AI card generation
  trackAIGeneration(
    category: Category,
    difficulty: Difficulty,
    prompt: string,
  ) {
    this.aiGenerationHistory.push({
      timestamp: Date.now(),
      category,
      difficulty,
      prompt,
    });

    // Keep only last 100 generations
    if (this.aiGenerationHistory.length > 100) {
      this.aiGenerationHistory = this.aiGenerationHistory.slice(-100);
    }
  }

  // Analyze AI generated cards
  analyzeAICards(): AICardStats {
    const history = this.aiGenerationHistory;

    const byCategory: { [key in Category]?: number } = {};
    const byDifficulty: { [key in Difficulty]?: number } = {};

    history.forEach((entry) => {
      byCategory[entry.category] = (byCategory[entry.category] || 0) + 1;
      byDifficulty[entry.difficulty] =
        (byDifficulty[entry.difficulty] || 0) + 1;
    });

    return {
      totalGenerated: history.length,
      byCategory,
      byDifficulty,
      generationHistory: history,
    };
  }

  // Combined analytics for current deck
  analyzeCombinedDeck(aiCards: Card[]): CardAnalytics {
    const traditionalAnalytics = this.analyzeTraditionalCards();
    const allCards = [...this.traditionalCards, ...aiCards];
    const totalCards = allCards.length;

    // Recalculate with AI cards included
    const categoryCount: { [key in Category]?: number } = {};
    const categoryExamples: { [key in Category]?: string[] } = {};

    allCards.forEach((card) => {
      const category = card.category;
      categoryCount[category] = (categoryCount[category] || 0) + 1;

      if (!categoryExamples[category]) {
        categoryExamples[category] = [];
      }

      if (card.prompts.length > 0 && categoryExamples[category]!.length < 5) {
        categoryExamples[category]!.push(card.prompts[0]);
      }
    });

    const byCategory: CategoryStats[] = Object.entries(categoryCount).map(
      ([category, count]) => ({
        category: category as Category,
        count,
        percentage: (count / totalCards) * 100,
        examples: categoryExamples[category as Category] || [],
      }),
    );

    // Update deck composition
    const deckComposition = {
      traditional: this.traditionalCards.length,
      aiGenerated: aiCards.length,
    };

    return {
      ...traditionalAnalytics,
      totalCards,
      byCategory: byCategory.sort((a, b) => b.count - a.count),
      deckComposition,
    };
  }

  // Get recommendations for balanced deck
  getBalanceRecommendations(analytics: CardAnalytics): string[] {
    const recommendations: string[] = [];
    const { byCategory } = analytics;

    const avgPercentage = 100 / byCategory.length;
    const threshold = avgPercentage * 0.5; // 50% below average

    byCategory.forEach((stat) => {
      if (stat.percentage < threshold) {
        recommendations.push(
          `Considere gerar mais cartas de "${stat.category}" (apenas ${stat.count} cartas, ${stat.percentage.toFixed(1)}%)`,
        );
      }
    });

    if (analytics.deckComposition.aiGenerated === 0) {
      recommendations.push(
        "Configure a IA para ter cartas infinitas e sempre variadas!",
      );
    }

    if (recommendations.length === 0) {
      recommendations.push("Seu baralho está bem balanceado! 🎉");
    }

    return recommendations;
  }

  // Generate categories for AI to balance deck
  getSuggestedAICategories(
    analytics: CardAnalytics,
    count: number = 5,
  ): Array<{ category: Category; priority: number }> {
    const suggestions: Array<{ category: Category; priority: number }> = [];
    const { byCategory } = analytics;

    const avgCount = analytics.totalCards / byCategory.length;

    byCategory.forEach((stat) => {
      const deficit = avgCount - stat.count;
      if (deficit > 0) {
        suggestions.push({
          category: stat.category,
          priority: deficit,
        });
      }
    });

    return suggestions.sort((a, b) => b.priority - a.priority).slice(0, count);
  }

  // Clear AI generation history
  clearAIHistory() {
    this.aiGenerationHistory = [];
  }

  // Export analytics data
  exportAnalytics() {
    return {
      traditional: this.analyzeTraditionalCards(),
      ai: this.analyzeAICards(),
      timestamp: Date.now(),
    };
  }

  // Get category distribution as chart data
  getCategoryChartData(analytics: CardAnalytics) {
    return analytics.byCategory.map((stat) => ({
      name: stat.category,
      value: stat.count,
      percentage: stat.percentage,
      color: this.getCategoryColor(stat.category),
    }));
  }

  // Get difficulty distribution as chart data
  getDifficultyChartData(analytics: CardAnalytics) {
    return analytics.byDifficulty.map((stat) => ({
      name: this.getDifficultyLabel(stat.difficulty),
      value: stat.count,
      percentage: stat.percentage,
      color: this.getDifficultyColor(stat.difficulty),
    }));
  }

  private getCategoryColor(category: Category): string {
    const colors = {
      "Pessoa/Personagem": "#3B82F6", // blue
      Lugar: "#10B981", // green
      Objeto: "#F59E0B", // yellow
      Ação: "#EF4444", // red
      Animal: "#8B5CF6", // purple
      Coisa: "#6B7280", // gray
      Livre: "#EC4899", // pink
    };
    return colors[category] || "#6B7280";
  }

  private getDifficultyColor(difficulty: Difficulty): string {
    const colors = {
      easy: "#10B981", // green
      medium: "#F59E0B", // yellow
      hard: "#EF4444", // red
    };
    return colors[difficulty];
  }

  private getDifficultyLabel(difficulty: Difficulty): string {
    const labels = {
      easy: "Fácil",
      medium: "Médio",
      hard: "Difícil",
    };
    return labels[difficulty];
  }
}

// Export singleton instance
export const cardAnalyticsService = new CardAnalyticsService();

// Types are already exported as interfaces above
