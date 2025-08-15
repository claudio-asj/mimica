import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Card, Team, Settings, TurnState, HistoryItem } from "./types";
import cardsData from "./data/cards.json";

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
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      settings: {
        roundSeconds: 60,
        targetPoints: 10,
        showCardByDefault: false,
      },
      teams: [],
      deck: shuffle(cardsData as Card[]),
      discard: [],
      history: [],
      turn: {
        currentTeamIndex: 0,
        isRunning: false,
        correctThisTurn: 0,
      },

      setSettings: (s) => set((st) => ({ settings: { ...st.settings, ...s } })),

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
          turn: { currentTeamIndex: 0, isRunning: false, correctThisTurn: 0 },
        })),

      startGame: () =>
        set((st) => ({
          deck: st.deck.length ? st.deck : shuffle(cardsData as Card[]),
          discard: [],
          history: [],
          teams: st.teams.map((t) => ({ ...t, points: 0 })),
          turn: {
            currentTeamIndex: 0,
            isRunning: false,
            correctThisTurn: 0,
          },
        })),

      drawCard: () => {
        const st = get();
        if (!st.deck.length) {
          // reshuffle discard
          const back = shuffle(
            (cardsData as Card[]).filter((c) => st.discard.includes(c.id))
          );
          set({ deck: back, discard: [] });
        }
        const next = get().deck[0];
        set((prev) => ({
          deck: prev.deck.slice(1),
          turn: { ...prev.turn, currentCardId: next?.id },
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
          return {
            teams,
            turn: {
              ...st.turn,
              correctThisTurn: selfTurn
                ? st.turn.correctThisTurn + amount
                : st.turn.correctThisTurn,
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
    }),
    { name: "imagem-acao-store" }
  )
);
