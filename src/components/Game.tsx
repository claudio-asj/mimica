import { useMemo, useState, useEffect } from "react";
import { useGame } from "../store";
import data from "../data/cards.json";
import type { Card as CardType } from "../types";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import CardFace from "./CardFace";
import Scoreboard from "./Scoreboard";
import Timer from "./Timer";
import History from "./History";
import GeneratedCardPreview from "./GeneratedCardPreview";
import {
  RefreshCw,
  Play,
  Pause,
  SkipForward,
  Trophy,
  Brain,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Game() {
  const {
    teams,
    settings,
    turn,
    startTurn,
    endTurn,
    nextTeam,
    addPoint,
    drawCard,
    generateAICard,
    aiGeneration,
    deck,
    lastGeneratedCard,
  } = useGame();
  const cards = data as CardType[];
  const currentCard = useMemo(
    () =>
      cards.find((c) => c.id === turn.currentCardId) ||
      deck.find((c) => c.id === turn.currentCardId),
    [cards, turn.currentCardId, deck],
  );

  const [cardVisible, setCardVisible] = useState(settings.showCardByDefault);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showGeneratedCardPreview, setShowGeneratedCardPreview] =
    useState(false);

  // Check if current team is winning
  const currentTeam = teams[turn.currentTeamIndex];
  const isWinning = currentTeam && currentTeam.points >= settings.targetPoints;

  useEffect(() => {
    setCardVisible(settings.showCardByDefault);
  }, [settings.showCardByDefault]);

  const start = () => {
    setCardVisible(settings.showCardByDefault);
    startTurn();
  };

  const pass = () => {
    endTurn(true);
    nextTeam();
    toast("Carta passada!", { icon: "⏭️" });
  };

  const finish = () => {
    endTurn(false);
    const winner = teams.find((t) => t.points >= settings.targetPoints);
    if (winner) {
      toast.success(`🎉 ${winner.name} venceu a partida!`);
    } else {
      nextTeam();
    }
  };

  const score = () => {
    const newPoints = turn.currentCardPoints + 1;
    const maxPoints = settings.maxPointsPerCard;

    addPoint(turn.currentTeamIndex, 1);

    if (newPoints >= maxPoints && settings.autoPassOnMaxPoints) {
      toast.success(
        `🎯 ${maxPoints}/${maxPoints} pontos! Passando automaticamente...`,
        {
          duration: 2000,
        },
      );
    } else {
      toast.success(
        `+1 ponto para ${currentTeam?.name}! (${newPoints}/${maxPoints})`,
        {
          icon: "🎯",
        },
      );
    }
  };

  const handleDrawCard = () => {
    drawCard();
    setCardVisible(true);
    toast.success("Nova carta sorteada!", { icon: "🎴" });
  };

  const handleGenerateAICard = async () => {
    if (!settings.useAI || !settings.geminiApiKey || isGeneratingAI) return;

    setIsGeneratingAI(true);
    const success = await generateAICard();
    setIsGeneratingAI(false);

    if (success) {
      drawCard(); // Draw the newly generated card
      setCardVisible(true);
      // Auto-show the generated card preview
      setShowGeneratedCardPreview(true);
    }
  };

  const getDeckStatus = () => {
    const totalCards = cards.length + deck.length;
    const remainingCards = deck.length;
    return `${remainingCards}/${totalCards} cartas restantes`;
  };

  const getCardProgress = () => {
    const current = turn.currentCardPoints;
    const max = settings.maxPointsPerCard;
    return { current, max, remaining: max - current };
  };

  return (
    <div className="grid gap-6">
      <Scoreboard />

      {isWinning && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <Trophy className="h-5 w-5" />
              <span className="font-semibold">
                🎉 {currentTeam.name} está próximo da vitória! (
                {currentTeam.points}/{settings.targetPoints} pontos)
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span>
                    Rodada — {teams[turn.currentTeamIndex]?.name ?? "—"}
                  </span>
                  {turn.isRunning && (
                    <Badge variant="secondary" className="animate-pulse">
                      Em andamento
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  {!turn.isRunning ? (
                    <>
                      <Button
                        onClick={handleDrawCard}
                        variant="outline"
                        size="sm"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sortear carta
                      </Button>
                      {settings.useAI && settings.geminiApiKey && (
                        <>
                          <Button
                            onClick={handleGenerateAICard}
                            variant="outline"
                            size="sm"
                            disabled={
                              isGeneratingAI || aiGeneration.isGenerating
                            }
                          >
                            <Brain className="h-4 w-4 mr-2" />
                            {isGeneratingAI || aiGeneration.isGenerating
                              ? "Gerando..."
                              : "IA"}
                          </Button>
                          {lastGeneratedCard && (
                            <Button
                              onClick={() => setShowGeneratedCardPreview(true)}
                              variant="secondary"
                              size="sm"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver carta
                            </Button>
                          )}
                        </>
                      )}
                      <Button
                        onClick={start}
                        disabled={!teams.length || !currentCard}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Iniciar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="default"
                        onClick={score}
                        disabled={
                          turn.currentCardPoints >= settings.maxPointsPerCard
                        }
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        {turn.currentCardPoints >= settings.maxPointsPerCard
                          ? "Máximo atingido"
                          : `+1 ponto (${getCardProgress().remaining} restantes)`}
                      </Button>
                      <Button variant="outline" onClick={finish}>
                        <Pause className="h-4 w-4 mr-2" />
                        Encerrar
                      </Button>
                      <Button variant="ghost" onClick={pass}>
                        <SkipForward className="h-4 w-4 mr-2" />
                        Passar
                      </Button>
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {turn.isRunning
                    ? "Dê dicas, marque acertos, e corra contra o tempo!"
                    : currentCard
                      ? "Carta pronta! Clique em Iniciar quando estiver pronto."
                      : "Sorteie uma carta para começar."}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {getDeckStatus()}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCardVisible((v) => !v)}
                    disabled={!currentCard}
                  >
                    {cardVisible ? "Esconder" : "Mostrar"}
                  </Button>
                </div>
              </div>

              {currentCard && cardVisible ? (
                <CardFace card={currentCard} />
              ) : (
                <div className="grid place-items-center border-2 border-dashed rounded-lg p-12 text-muted-foreground">
                  {!currentCard ? (
                    <div className="text-center">
                      <RefreshCw className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">Nenhuma carta sorteada</p>
                      <p className="text-sm">
                        Clique em "Sortear carta" para começar
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="h-12 w-12 mx-auto mb-3 bg-muted rounded-lg flex items-center justify-center">
                        👁️
                      </div>
                      <p className="font-medium">Carta escondida</p>
                      <p className="text-sm">
                        Clique em "Mostrar" para revelar
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid gap-3">
                <Timer />
                {turn.isRunning && (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-md bg-primary/5">
                      <span className="text-sm text-muted-foreground">
                        Acertos nesta rodada:
                      </span>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {turn.correctThisTurn}
                      </Badge>
                    </div>

                    {/* Progress da carta atual */}
                    <div className="p-3 rounded-md border-2 border-dashed border-primary/20 bg-primary/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Progresso desta carta:
                        </span>
                        <Badge
                          variant={
                            getCardProgress().current >=
                            settings.maxPointsPerCard
                              ? "default"
                              : "outline"
                          }
                          className="text-sm"
                        >
                          {getCardProgress().current}/
                          {settings.maxPointsPerCard}
                        </Badge>
                      </div>

                      {/* Barra de progresso */}
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(getCardProgress().current / settings.maxPointsPerCard) * 100}%`,
                          }}
                        />
                      </div>

                      <div className="text-xs text-muted-foreground text-center">
                        {getCardProgress().current >=
                        settings.maxPointsPerCard ? (
                          <span className="text-primary font-medium">
                            ✅ Pontuação máxima atingida!
                            {settings.autoPassOnMaxPoints &&
                              " Passará automaticamente."}
                          </span>
                        ) : (
                          `${getCardProgress().remaining} ponto${getCardProgress().remaining !== 1 ? "s" : ""} restante${getCardProgress().remaining !== 1 ? "s" : ""} para o máximo`
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <History />
        </div>

        <div className="grid gap-4">
          <Card className="sticky top-4 h-fit">
            <CardHeader>
              <CardTitle>Controles Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="text-muted-foreground">Time atual:</span>
                <div className="font-semibold text-lg mt-1">
                  {teams[turn.currentTeamIndex]?.name ?? "—"}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Adicionar pontos:
                </div>
                <div className="grid gap-2">
                  {teams.map((t, i) => (
                    <Button
                      key={t.id}
                      variant={
                        i === turn.currentTeamIndex ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => addPoint(i, 1)}
                      className="justify-start"
                    >
                      <span className="mr-2">+1</span>
                      <span className="truncate">{t.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {t.points}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {currentCard && (
                <div className="pt-3 border-t">
                  <div className="text-sm text-muted-foreground mb-2">
                    Carta atual:
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {currentCard.category}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <GeneratedCardPreview
        open={showGeneratedCardPreview}
        onOpenChange={setShowGeneratedCardPreview}
      />
    </div>
  );
}
