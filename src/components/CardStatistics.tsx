import { useState, useEffect, useMemo } from "react";
import { useGame } from "../store";
import { cardAnalyticsService } from "../services/cardAnalytics";
import type { CardAnalytics } from "../services/cardAnalytics";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  BarChart3,
  PieChart,
  Zap,
  Brain,
  Shuffle,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import type { Category, Difficulty } from "../types";

export default function CardStatistics() {
  const { settings, setSettings, deck, generateAICard } = useGame();
  const [analytics, setAnalytics] = useState<CardAnalytics | null>(null);
  const [isGeneratingBalance, setIsGeneratingBalance] = useState(false);

  // Calculate analytics
  useEffect(() => {
    const combinedAnalytics = cardAnalyticsService.analyzeCombinedDeck(deck);
    console.log(combinedAnalytics);
    setAnalytics(combinedAnalytics);
  }, [deck]);

  const recommendations = useMemo(() => {
    if (!analytics) return [];
    return cardAnalyticsService.getBalanceRecommendations(analytics);
  }, [analytics]);

  const categoryChartData = useMemo(() => {
    if (!analytics) return [];
    return cardAnalyticsService.getCategoryChartData(analytics);
  }, [analytics]);

  const difficultyChartData = useMemo(() => {
    if (!analytics) return [];
    return cardAnalyticsService.getDifficultyChartData(analytics);
  }, [analytics]);

  const handleAIOnlyModeToggle = (enabled: boolean) => {
    setSettings({ aiOnlyMode: enabled });
    if (enabled && !settings.geminiApiKey) {
      // Show warning that API key is needed
    }
  };

  const generateBalancedCards = async () => {
    if (!analytics || !settings.geminiApiKey) return;

    setIsGeneratingBalance(true);
    const suggestions = cardAnalyticsService.getSuggestedAICategories(
      analytics,
      5,
    );

    try {
      for (const suggestion of suggestions) {
        await generateAICard(suggestion.category, settings.aiDifficulty);
        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Error generating balanced cards:", error);
    } finally {
      setIsGeneratingBalance(false);
    }
  };

  if (!analytics) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Analisando cartas...</span>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: Category) => {
    const icons = {
      "Pessoa/Personagem": "👤",
      Lugar: "🏠",
      Objeto: "📦",
      Ação: "🏃",
      Animal: "🐱",
      Coisa: "💭",
      Livre: "🎲",
    };
    return icons[category] || "📋";
  };

  return (
    <div className="space-y-6">
      {/* Header with AI Mode Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Estatísticas das Cartas</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Modo Apenas IA:</label>
                <Select
                  value={settings.aiOnlyMode ? "1" : "0"}
                  onValueChange={(v) => handleAIOnlyModeToggle(v === "1")}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Misto</SelectItem>
                    <SelectItem value="1">Apenas IA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {settings.aiOnlyMode && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  IA Ativa
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-primary/5">
              <div className="text-2xl font-bold text-primary">
                {analytics.totalCards}
              </div>
              <div className="text-sm text-muted-foreground">
                Total de Cartas
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-600">
                {analytics.deckComposition.traditional}
              </div>
              <div className="text-sm text-muted-foreground">Tradicionais</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.deckComposition.aiGenerated}
              </div>
              <div className="text-sm text-muted-foreground">
                Geradas por IA
              </div>
            </div>
          </div>

          {settings.aiOnlyMode && !settings.geminiApiKey && (
            <div className="mt-4 p-3 rounded-md bg-yellow-50 border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Configure sua chave da API Gemini para usar o modo "Apenas IA"
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Distribuição por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryChartData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getCategoryIcon(item.name)}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <Badge variant="outline">
                    {item.value} cartas ({item.percentage.toFixed(1)}%)
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  <strong>Exemplos:</strong>{" "}
                  {analytics.byCategory
                    .find((cat) => cat.category === item.name)
                    ?.examples.slice(0, 3)
                    .join(", ") || "Nenhum exemplo"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Análise de Dificuldade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficultyChartData.map((item) => (
              <div key={item.name} className="space-y-3">
                <div className="text-center">
                  <Badge
                    className={getDifficultyColor(
                      item.name.toLowerCase() as Difficulty,
                    )}
                  >
                    {item.name}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.percentage.toFixed(1)}% das cartas
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="text-sm text-muted-foreground">
            <strong>Média de prompts por carta:</strong>{" "}
            {analytics.averagePromptsPerCard} palavras/frases
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 rounded-md bg-muted/50"
              >
                {rec.includes("bem balanceado") ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                )}
                <span className="text-sm">{rec}</span>
              </div>
            ))}
          </div>

          {settings.geminiApiKey &&
            recommendations.some((rec) => rec.includes("Considere gerar")) && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  onClick={generateBalancedCards}
                  disabled={isGeneratingBalance}
                  className="w-full"
                >
                  {isGeneratingBalance ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Gerando cartas para equilibrar...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Gerar Cartas para Equilibrar Baralho
                    </>
                  )}
                </Button>
              </div>
            )}
        </CardContent>
      </Card>

      {/* AI Mode Information */}
      {settings.aiOnlyMode && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Brain className="h-5 w-5" />
              Modo Apenas IA Ativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-700">
              <p>
                ✨ <strong>Cartas infinitas:</strong> Nunca mais fique sem
                cartas novas
              </p>
              <p>
                🎯 <strong>Personalização total:</strong> Cartas adaptadas à
                dificuldade escolhida
              </p>
              <p>
                🌟 <strong>Sempre úniche:</strong> Cada carta é única e criativa
              </p>
              <p>
                🚀 <strong>Geração automática:</strong> Novas cartas criadas
                conforme necessário
              </p>
            </div>
            {!settings.geminiApiKey && (
              <div className="mt-3 p-2 rounded bg-yellow-100 border border-yellow-300">
                <p className="text-xs text-yellow-800">
                  <strong>Atenção:</strong> Configure sua chave da API Gemini
                  nas configurações para ativar este modo.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5" />
            Estatísticas Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">
                {analytics.mostCommonCategory}
              </div>
              <div className="text-xs text-muted-foreground">
                Categoria + Comum
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">
                {analytics.leastCommonCategory}
              </div>
              <div className="text-xs text-muted-foreground">
                Categoria - Comum
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {analytics.byCategory.length}
              </div>
              <div className="text-xs text-muted-foreground">
                Categorias Ativas
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {Math.round(analytics.averagePromptsPerCard)}
              </div>
              <div className="text-xs text-muted-foreground">Prompts/Carta</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
