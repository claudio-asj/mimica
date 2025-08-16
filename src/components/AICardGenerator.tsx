import { useState } from "react";
import { useGame } from "../store";
import { geminiService } from "../services/gemini";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Brain,
  Loader2,
  Sparkles,
  AlertCircle,
  Settings,
  Eye,
} from "lucide-react";
import type { Category, Difficulty } from "../types";
import ApiKeyModal from "./ApiKeyModal";
import GeneratedCardPreview from "./GeneratedCardPreview";

export default function AICardGenerator() {
  const {
    settings,
    aiGeneration,
    generateAICard,
    clearAIError,
    lastGeneratedCard,
  } = useGame();

  const [selectedCategory, setSelectedCategory] = useState<Category>("Livre");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    settings.aiDifficulty,
  );
  const [showApiModal, setShowApiModal] = useState(false);
  const [showGeneratedCardPreview, setShowGeneratedCardPreview] =
    useState(false);
  const [generatedCards, setGeneratedCards] = useState<
    {
      id: number;
      category: Category;
      difficulty: Difficulty;
      timestamp: number;
    }[]
  >([]);

  const categories: Category[] = [
    "Livre",
    "Pessoa/Personagem",
    "Lugar",
    "Objeto",
    "Ação",
    "Animal",
    "Coisa",
  ];

  const difficulties: {
    value: Difficulty;
    label: string;
    description: string;
  }[] = [
    {
      value: "easy",
      label: "Fácil",
      description: "Palavras simples e conhecidas",
    },
    {
      value: "medium",
      label: "Médio",
      description: "Palavras moderadamente complexas",
    },
    {
      value: "hard",
      label: "Difícil",
      description: "Palavras complexas e abstratas",
    },
  ];

  const isConfigured = settings.geminiApiKey && geminiService.isInitialized();

  const handleGenerate = async () => {
    if (!isConfigured) {
      setShowApiModal(true);
      return;
    }

    clearAIError();
    const success = await generateAICard(
      selectedCategory === "Livre" ? undefined : selectedCategory,
      selectedDifficulty,
    );

    if (success) {
      // Track generated cards for display
      setGeneratedCards((prev) => [
        {
          id: Date.now(),
          category: selectedCategory,
          difficulty: selectedDifficulty,
          timestamp: Date.now(),
        },
        ...prev.slice(0, 4), // Keep last 5 generations
      ]);
      // Auto-show the generated card preview
      setShowGeneratedCardPreview(true);
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Gerador de Cartas IA
            {!isConfigured && (
              <Badge variant="outline" className="text-xs">
                Não configurado
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConfigured ? (
            <div className="text-center space-y-3 py-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">
                  Configure sua chave de API do Gemini para gerar cartas
                </span>
              </div>
              <Button onClick={() => setShowApiModal(true)} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configurar API
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) =>
                      setSelectedCategory(value as Category)
                    }
                    disabled={aiGeneration.isGenerating}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Dificuldade</label>
                  <Select
                    value={selectedDifficulty}
                    onValueChange={(value) =>
                      setSelectedDifficulty(value as Difficulty)
                    }
                    disabled={aiGeneration.isGenerating}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Selecione a dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff.value} value={diff.value}>
                          {diff.label} - {diff.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={handleGenerate}
                  disabled={aiGeneration.isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {aiGeneration.isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Gerando carta...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Gerar Nova Carta
                    </>
                  )}
                </Button>

                {lastGeneratedCard && (
                  <Button
                    onClick={() => setShowGeneratedCardPreview(true)}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Última Carta Gerada
                  </Button>
                )}
              </div>

              {aiGeneration.error && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{aiGeneration.error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAIError}
                    className="ml-auto h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              )}

              {generatedCards.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Últimas cartas geradas:
                  </div>
                  <div className="space-y-1">
                    {generatedCards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getDifficultyColor(card.difficulty)}
                          >
                            {
                              difficulties.find(
                                (d) => d.value === card.difficulty,
                              )?.label
                            }
                          </Badge>
                          <span className="text-sm">{card.category}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(card.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t text-xs text-muted-foreground">
                💡 <strong>Dica:</strong> As cartas geradas são automaticamente
                adicionadas ao baralho. Use "Livre" para categorias aleatórias.
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ApiKeyModal open={showApiModal} onOpenChange={setShowApiModal} />
      <GeneratedCardPreview
        open={showGeneratedCardPreview}
        onOpenChange={setShowGeneratedCardPreview}
      />
    </>
  );
}
