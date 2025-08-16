import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Card,
  Team,
  Settings,
  TurnState,
  HistoryItem,
  AIGenerationStatus,
  Category,
  Difficulty,
  Theme,
} from "./types";
import cardsData from "./data/cards.json";
import { geminiService } from "./services/gemini";
import { env } from "./lib/env";
import toast from "react-hot-toast";

const shuffle = <T>(arr: T[]) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

interface GameState {
  settings: Settings;
  teams: Team[];
  deck: Card[];
  discard: string[]; // card ids
  turn: TurnState;
  history: HistoryItem[];
  aiGeneration: AIGenerationStatus;
  lastGeneratedCard: Card | null;

  // actions
  setSettings: (s: Partial<Settings>) => void;
  addTeam: (name: string) => void;
  removeTeam: (id: string) => void;
  resetMatch: () => void;
  startGame: () => void;
  drawCard: () => void;
  startTurn: () => void;
  tick: () => void;
  endTurn: (passed?: boolean) => void;
  addPoint: (teamIndex: number, amount?: number) => void;
  nextTeam: () => void;

  // AI actions
  initializeGeminiFromEnv: () => void;
  setGeminiApiKey: (key: string) => void;
  generateAICard: (
    category?: Category,
    difficulty?: Difficulty,
  ) => Promise<boolean>;
  addAICardsToDeck: (cards: Card[]) => void;
  clearAIError: () => void;
  clearLastGeneratedCard: () => void;
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      settings: {
        roundSeconds: env.defaultRoundSeconds,
        targetPoints: env.defaultTargetPoints,
        showCardByDefault: env.showCardByDefault,
        useAI: env.hasGeminiApiKey,
        aiDifficulty: env.defaultAiDifficulty,
        geminiApiKey: env.geminiApiKey,
        maxPointsPerCard: env.defaultMaxPointsPerCard,
        autoPassOnMaxPoints: env.defaultAutoPassOnMaxPoints,
        aiOnlyMode: false,
        theme: "system" as Theme,
      },
      teams: [],
      deck: shuffle(cardsData as Card[]),
      discard: [],
      history: [],
      turn: {
        currentTeamIndex: 0,
        isRunning: false,
        correctThisTurn: 0,
        currentCardPoints: 0,
      },
      aiGeneration: {
        isGenerating: false,
      },
      lastGeneratedCard: null,

      setSettings: (s) => set((st) => ({ settings: { ...st.settings, ...s } })),

      // Initialize Gemini service if API key is available from environment
      initializeGeminiFromEnv: () => {
        if (env.hasGeminiApiKey) {
          const initialized = geminiService.initialize(env.geminiApiKey);
          if (initialized) {
            env.log("Gemini API initialized from environment variable");
            toast.success("IA configurada automaticamente!");
          } else {
            env.error("Failed to initialize Gemini API from environment");
          }
        } else {
          env.log("No Gemini API key found in environment variables");
        }
      },

      addTeam: (name) =>
        set((st) => ({
          teams: [
            ...st.teams,
            { id: crypto.randomUUID(), name: name.trim(), points: 0 },
          ],
        })),

      removeTeam: (id) =>
        set((st) => ({
          teams: st.teams.filter((t) => t.id !== id),
          // ajusta índice do time atual se necessário
          turn: {
            ...st.turn,
            currentTeamIndex:
              Math.min(st.turn.currentTeamIndex, st.teams.length - 2) || 0,
          },
        })),

      resetMatch: () =>
        set(() => ({
          deck: shuffle(cardsData as Card[]),
          discard: [],
          history: [],
          teams: [],
          turn: {
            currentTeamIndex: 0,
            isRunning: false,
            correctThisTurn: 0,
            currentCardPoints: 0,
          },
        })),

      startGame: () =>
        set((st) => ({
          deck: st.settings.aiOnlyMode
            ? [] // Start with empty deck in AI-only mode
            : st.deck.length
              ? st.deck
              : shuffle(cardsData as Card[]),
          discard: [],
          history: [],
          teams: st.teams.map((t) => ({ ...t, points: 0 })),
          turn: {
            currentTeamIndex: 0,
            isRunning: false,
            correctThisTurn: 0,
            currentCardPoints: 0,
          },
        })),

      drawCard: () => {
        const st = get();
        if (!st.deck.length) {
          if (st.settings.aiOnlyMode && st.settings.geminiApiKey) {
            // In AI-only mode, generate a new card instead of reshuffling
            get().generateAICard();
            return;
          } else {
            // reshuffle discard
            const back = shuffle(
              (cardsData as Card[]).filter((c) => st.discard.includes(c.id)),
            );
            set({ deck: back, discard: [] });
          }
        }
        const next = get().deck[0];
        set((prev) => ({
          deck: prev.deck.slice(1),
          turn: { ...prev.turn, currentCardId: next?.id, currentCardPoints: 0 },
        }));
      },

      startTurn: () => {
        const st = get();
        if (!st.teams.length) return;
        if (!st.turn.currentCardId) get().drawCard();
        set((prev) => ({
          turn: {
            ...prev.turn,
            isRunning: true,
            startedAt: Date.now(),
            remaining: prev.settings.roundSeconds,
            correctThisTurn: 0,
            currentCardPoints: 0,
          },
        }));
      },

      tick: () => {
        const st = get();
        if (!st.turn.isRunning) return;
        const remain = (st.turn.remaining ?? st.settings.roundSeconds) - 1;
        if (remain <= 0) {
          get().endTurn(false);
        } else {
          set({ turn: { ...st.turn, remaining: remain } });
        }
      },

      endTurn: (passed = false) => {
        const st = get();
        const cardId = st.turn.currentCardId;
        if (cardId) {
          set((prev) => ({
            discard: [...prev.discard, cardId],
            history: [
              ...prev.history,
              {
                teamId: prev.teams[prev.turn.currentTeamIndex].id,
                cardId,
                correct: prev.turn.correctThisTurn,
                passed,
                timestamp: Date.now(),
              },
            ],
          }));
        }
        set((prev) => ({
          turn: {
            currentTeamIndex: prev.turn.currentTeamIndex,
            isRunning: false,
            correctThisTurn: 0,
            currentCardId: undefined,
            startedAt: undefined,
            remaining: prev.settings.roundSeconds,
            currentCardPoints: 0,
          },
        }));
      },

      addPoint: (teamIndex, amount = 1) =>
        set((st) => {
          const teams = st.teams.slice();
          teams[teamIndex] = {
            ...teams[teamIndex],
            points: teams[teamIndex].points + amount,
          };

          // também conta acertos da rodada
          const selfTurn =
            teamIndex === st.turn.currentTeamIndex && st.turn.isRunning;

          const newCurrentCardPoints = selfTurn
            ? st.turn.currentCardPoints + amount
            : st.turn.currentCardPoints;

          const newCorrectThisTurn = selfTurn
            ? st.turn.correctThisTurn + amount
            : st.turn.correctThisTurn;

          // Verifica se atingiu o máximo de pontos por carta
          const maxReached =
            newCurrentCardPoints >= st.settings.maxPointsPerCard;

          // Se atingiu o máximo e auto-pass está ativo, passa automaticamente
          if (maxReached && st.settings.autoPassOnMaxPoints && selfTurn) {
            // Toast notification
            toast.success(
              `🎯 ${st.settings.maxPointsPerCard} pontos! Passando para próxima carta...`,
            );

            // Delay pequeno para mostrar o feedback antes de passar
            setTimeout(() => {
              get().endTurn(false);
              get().nextTeam();
            }, 1000);
          }

          return {
            teams,
            turn: {
              ...st.turn,
              correctThisTurn: newCorrectThisTurn,
              currentCardPoints: newCurrentCardPoints,
            },
          };
        }),

      nextTeam: () =>
        set((st) => ({
          turn: {
            ...st.turn,
            currentTeamIndex:
              (st.turn.currentTeamIndex + 1) % Math.max(st.teams.length, 1),
          },
        })),

      // AI actions
      setGeminiApiKey: (key) => {
        set((st) => ({
          settings: { ...st.settings, geminiApiKey: key },
        }));
        if (key) {
          const initialized = geminiService.initialize(key);
          if (initialized) {
            toast.success("Gemini API conectada com sucesso!");
          } else {
            toast.error("Erro ao conectar com a API do Gemini");
          }
        }
      },

      generateAICard: async (category?, difficulty?) => {
        const st = get();
        if (!st.settings.geminiApiKey) {
          set((prev) => ({
            aiGeneration: {
              ...prev.aiGeneration,
              error: "API key do Gemini não configurada",
            },
          }));
          return false;
        }

        set((prev) => ({
          aiGeneration: {
            ...prev.aiGeneration,
            isGenerating: true,
            error: undefined,
          },
        }));

        try {
          const categories: Category[] = [
            "Pessoa/Personagem",
            "Lugar",
            "Objeto",
            "Ação",
            "Animal",
            "Coisa",
          ];
          const randomCategory =
            category ||
            categories[Math.floor(Math.random() * categories.length)];
          const cardDifficulty = difficulty || st.settings.aiDifficulty;

          const card = await geminiService.generateSingleCard(
            randomCategory,
            cardDifficulty,
          );

          if (card) {
            set((prev) => ({
              deck: [card, ...prev.deck],
              lastGeneratedCard: card,
              aiGeneration: {
                isGenerating: false,
                lastGenerated: Date.now(),
              },
            }));
            toast.success(`Nova carta gerada: ${card.prompts[0]}`);
            return true;
          } else {
            throw new Error("Falha ao gerar carta");
          }
        } catch (error: unknown) {
          set(() => ({
            aiGeneration: {
              isGenerating: false,
              error: (error as Error).message || "Erro ao gerar carta",
            },
          }));
          toast.error("Erro ao gerar carta com IA");
          return false;
        }
      },

      addAICardsToDeck: (cards) => {
        set((st) => ({
          deck: [...cards, ...st.deck],
        }));
        toast.success(`${cards.length} cartas adicionadas ao baralho!`);
      },

      clearAIError: () => {
        set((prev) => ({
          aiGeneration: { ...prev.aiGeneration, error: undefined },
        }));
      },

      clearLastGeneratedCard: () => {
        set({ lastGeneratedCard: null });
      },
    }),
    { name: "imagem-acao-store" },
  ),
);
