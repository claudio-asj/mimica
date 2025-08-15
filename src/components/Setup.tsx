import { useState } from "react";
import { useGame } from "../store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Select } from "./ui/select";

export default function Setup({ onStart }: { onStart: () => void }) {
  const { teams, addTeam, removeTeam, setSettings, settings, startGame } =
    useGame();
  const [teamName, setTeamName] = useState("");

  const add = () => {
    if (teamName.trim()) {
      addTeam(teamName);
      setTeamName("");
    }
  };

  const canStart = teams.length >= 2;

  return (
    <div className="grid gap-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Times</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Nome do time"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
            <Button onClick={add}>Adicionar</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {teams.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2 rounded-md border px-3 py-2"
              >
                <span>{t.name}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeTeam(t.id)}
                >
                  remover
                </Button>
              </div>
            ))}
            {!teams.length && (
              <div className="text-sm text-muted-foreground">
                Adicione pelo menos 2 times.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regras</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-3">
            <span className="w-40 text-sm text-muted-foreground">
              Tempo por rodada
            </span>
            <Select
              value={String(settings.roundSeconds)}
              onValueChange={(v) => setSettings({ roundSeconds: Number(v) })}
            >
              <option value="30">30s</option>
              <option value="45">45s</option>
              <option value="60">60s</option>
              <option value="90">90s</option>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-40 text-sm text-muted-foreground">
              Pontos para vencer
            </span>
            <Select
              value={String(settings.targetPoints)}
              onValueChange={(v) => setSettings({ targetPoints: Number(v) })}
            >
              <option value="7">7</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-40 text-sm text-muted-foreground">
              Mostrar carta ao iniciar
            </span>
            <Select
              value={settings.showCardByDefault ? "1" : "0"}
              onValueChange={(v) =>
                setSettings({ showCardByDefault: v === "1" })
              }
            >
              <option value="0">Não</option>
              <option value="1">Sim</option>
            </Select>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-end">
          <Button
            disabled={!canStart}
            onClick={() => {
              startGame();
              onStart();
            }}
          >
            Iniciar partida
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
