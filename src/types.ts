export type Category =
  | "Pessoa/Personagem"
  | "Lugar"
  | "Objeto"
  | "Ação"
  | "Animal"
  | "Coisa"
  | "Livre";

export interface Card {
  id: string;
  category: Category;
  prompts: string[]; // 4-6 palavras por carta
}

export interface Team {
  id: string;
  name: string;
  points: number;
}

export interface Settings {
  roundSeconds: number; // duração de cada rodada
  targetPoints: number; // pontos para vencer
  showCardByDefault: boolean; // mostrar carta já aberta
}

export interface TurnState {
  currentTeamIndex: number;
  isRunning: boolean;
  startedAt?: number;
  remaining?: number;
  currentCardId?: string;
  correctThisTurn: number;
}

export interface HistoryItem {
  teamId: string;
  cardId: string;
  correct: number;
  passed: boolean;
  timestamp: number;
}
