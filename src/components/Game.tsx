import { useMemo, useState } from "react";
import { useGame } from "../store";
import data from "../data/cards.json";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import CardFace from "./CardFace";
import Scoreboard from "./Scoreboard";
import Timer from "./Timer";
import History from "./History";

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
  } = useGame();
  const cards = data as any[];
  const currentCard = useMemo(
    () => cards.find((c) => c.id === turn.currentCardId),
    [cards, turn.currentCardId]
  );

  const [cardVisible, setCardVisible] = useState(settings.showCardByDefault);

  const start = () => {
    setCardVisible(settings.showCardByDefault);
    startTurn();
  };
  const pass = () => {
    endTurn(true);
    nextTeam();
  };
  const finish = () => {
    endTurn(false);
    // checa vitória
    const winner = teams.find((t) => t.points >= settings.targetPoints);
    if (!winner) nextTeam();
  };

  const score = () => addPoint(turn.currentTeamIndex, 1);

  return (
    <div className="grid gap-6">
      <Scoreboard />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Rodada — {teams[turn.currentTeamIndex]?.name ?? "—"}
                <div className="flex gap-2">
                  {!turn.isRunning ? (
                    <>
                      <Button
                        onClick={() => {
                          drawCard();
                          setCardVisible(true);
                        }}
                      >
                        Sortear carta
                      </Button>
                      <Button onClick={start} disabled={!teams.length}>
                        Iniciar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="secondary" onClick={score}>
                        + 1 ponto
                      </Button>
                      <Button variant="outline" onClick={finish}>
                        Encerrar
                      </Button>
                      <Button variant="ghost" onClick={pass}>
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
                    : "Sorteie uma carta e clique em Iniciar."}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCardVisible((v) => !v)}
                  >
                    {cardVisible ? "Esconder carta" : "Mostrar carta"}
                  </Button>
                </div>
              </div>

              {currentCard && cardVisible ? (
                <CardFace card={currentCard} />
              ) : (
                <div className="grid place-items-center border rounded-md p-10 text-muted-foreground">
                  {!currentCard
                    ? "Nenhuma carta sorteada ainda."
                    : "Carta escondida."}
                </div>
              )}

              <div className="grid gap-2">
                <Timer />
                {turn.isRunning && (
                  <div className="text-sm text-muted-foreground">
                    Acertos nesta rodada:{" "}
                    <span className="font-semibold">
                      {turn.correctThisTurn}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <History />
        </div>

        <div className="grid gap-4">
          <Card className="sticky top-4 h-fit">
            <CardHeader>
              <CardTitle>Painel Rápido</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="text-sm">
                Time atual:{" "}
                <span className="font-semibold">
                  {teams[turn.currentTeamIndex]?.name ?? "—"}
                </span>
              </div>
              <div className="flex gap-2">
                {teams.map((t, i) => (
                  <Button
                    key={t.id}
                    variant="outline"
                    onClick={() => addPoint(i, 1)}
                  >
                    +1 {t.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
