import { useState } from "react";
import { useGame } from "../store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import AICardGenerator from "./AICardGenerator";
import ApiKeyModal from "./ApiKeyModal";
import { Users, Settings, Brain, Play, BarChart3, Palette } from "lucide-react";
import type { Difficulty } from "../types";
import CardStatistics from "./CardStatistics";
import { ModeToggle } from "./mode-toggle";

export default function Setup({ onStart }: { onStart: () => void }) {
  const { teams, addTeam, removeTeam, setSettings, settings, startGame } =
    useGame();
  const [teamName, setTeamName] = useState("");
  const [showApiModal, setShowApiModal] = useState(false);

  const add = () => {
    if (teamName.trim()) {
      addTeam(teamName);
      setTeamName("");
    }
  };

  const canStart = teams.length >= 2;

  return (
    <div className="grid gap-6 max-w-4xl mx-auto">
      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="flex justify-between w-full">
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="sr-only">Times</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Configurações</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="sr-only">IA</span>
            {settings.useAI && (
              <Badge variant="secondary" className="text-xs ml-1">
                Ativa
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="sr-only">Estatística</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gerenciar Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do time"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && add()}
                  className="flex-1"
                />
                <Button onClick={add} disabled={!teamName.trim()}>
                  Adicionar
                </Button>
              </div>

              <div className="space-y-2">
                {teams.length > 0 ? (
                  <div className="grid gap-2">
                    {teams.map((t, index) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-3 rounded-md border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="font-medium">{t.name}</span>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTeam(t.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum time adicionado ainda</p>
                    <p className="text-sm">
                      Adicione pelo menos 2 times para começar
                    </p>
                  </div>
                )}
              </div>

              {teams.length > 0 && (
                <div className="p-3 rounded-md bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    <strong>Times cadastrados:</strong> {teams.length}
                    {teams.length >= 2 ? " ✅" : " (mínimo: 2)"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do Jogo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Tempo por rodada
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Duração de cada turno em segundos
                    </p>
                  </div>
                  <Select
                    value={String(settings.roundSeconds)}
                    onValueChange={(v) =>
                      setSettings({ roundSeconds: Number(v) })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione o tempo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 segundos</SelectItem>
                      <SelectItem value="45">45 segundos</SelectItem>
                      <SelectItem value="60">1 minuto</SelectItem>
                      <SelectItem value="90">1 minuto e 30s</SelectItem>
                      <SelectItem value="120">2 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Pontos para vencer
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Meta de pontos para ganhar a partida
                    </p>
                  </div>
                  <Select
                    value={String(settings.targetPoints)}
                    onValueChange={(v) =>
                      setSettings({ targetPoints: Number(v) })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione os pontos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 pontos</SelectItem>
                      <SelectItem value="7">7 pontos</SelectItem>
                      <SelectItem value="10">10 pontos</SelectItem>
                      <SelectItem value="15">15 pontos</SelectItem>
                      <SelectItem value="20">20 pontos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Mostrar carta automaticamente
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Exibir a carta assim que o turno começar
                    </p>
                  </div>
                  <Select
                    value={settings.showCardByDefault ? "1" : "0"}
                    onValueChange={(v) =>
                      setSettings({ showCardByDefault: v === "1" })
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Não</SelectItem>
                      <SelectItem value="1">Sim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Usar IA para gerar cartas
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Habilitar geração automática de cartas com Gemini
                    </p>
                  </div>
                  <Select
                    value={settings.useAI ? "1" : "0"}
                    onValueChange={(v) => setSettings({ useAI: v === "1" })}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Desabilitado</SelectItem>
                      <SelectItem value="1">Habilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings.useAI && (
                  <>
                    <div className="flex items-center justify-between pl-4 border-l-2 border-primary/20">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">
                          Dificuldade da IA
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Nível de complexidade das cartas geradas
                        </p>
                      </div>
                      <Select
                        value={settings.aiDifficulty}
                        onValueChange={(v) =>
                          setSettings({ aiDifficulty: v as Difficulty })
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Dificuldade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Fácil</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="hard">Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {!settings.geminiApiKey && (
                      <div className="pl-4 border-l-2 border-primary/20">
                        <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200">
                          <p className="text-sm text-yellow-800">
                            <strong>Atenção:</strong> Para usar a IA, você
                            precisa configurar sua chave de API do Gemini.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setShowApiModal(true)}
                          >
                            Configurar API
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Pontos máximos por carta
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Quantos pontos um time pode fazer em uma única carta
                    </p>
                  </div>
                  <Select
                    value={String(settings.maxPointsPerCard)}
                    onValueChange={(v) =>
                      setSettings({ maxPointsPerCard: Number(v) })
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Pontos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 pontos</SelectItem>
                      <SelectItem value="5">5 pontos</SelectItem>
                      <SelectItem value="7">7 pontos</SelectItem>
                      <SelectItem value="10">10 pontos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      Passar automaticamente
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Passar para próxima carta ao atingir pontos máximos
                    </p>
                  </div>
                  <Select
                    value={settings.autoPassOnMaxPoints ? "1" : "0"}
                    onValueChange={(v) =>
                      setSettings({ autoPassOnMaxPoints: v === "1" })
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Não</SelectItem>
                      <SelectItem value="1">Sim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      <Palette className="inline h-4 w-4 mr-1" />
                      Tema da interface
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Escolha entre claro, escuro ou seguir sistema
                    </p>
                  </div>
                  <ModeToggle />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <AICardGenerator />
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <CardStatistics />
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Pronto para começar?</p>
              <p className="text-sm text-muted-foreground">
                {canStart
                  ? `${teams.length} times configurados. Boa diversão!`
                  : "Configure pelo menos 2 times para iniciar."}
              </p>
            </div>
            <Button
              disabled={!canStart}
              onClick={() => {
                startGame();
                onStart();
              }}
              size="lg"
              className="px-8"
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar Partida
            </Button>
          </div>
        </CardContent>
      </Card>

      <ApiKeyModal open={showApiModal} onOpenChange={setShowApiModal} />
    </div>
  );
}
