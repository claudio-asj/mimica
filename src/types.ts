export type Category =
  | "Pessoa/Personagem"
  | "Lugar"
  | "Objeto"
  | "Ação"
  | "Animal"
  | "Coisa"
  | "Livre";

export type Difficulty = "easy" | "medium" | "hard";

export type Theme = "light" | "dark" | "system";

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
  useAI: boolean; // usar IA para gerar cartas
  aiDifficulty: Difficulty; // dificuldade das cartas geradas pela IA
  geminiApiKey?: string; // chave da API do Gemini
  maxPointsPerCard: number; // pontos máximos por carta (padrão: 5)
  autoPassOnMaxPoints: boolean; // passar automaticamente ao atingir pontos máximos
  aiOnlyMode: boolean; // usar apenas cartas geradas por IA (sem cartas tradicionais)
  theme: Theme; // tema da interface (light, dark, system)
}

export interface TurnState {
  currentTeamIndex: number;
  isRunning: boolean;
  startedAt?: number;
  remaining?: number;
  currentCardId?: string;
  correctThisTurn: number;
  currentCardPoints: number; // pontos feitos na carta atual
}

export interface HistoryItem {
  teamId: string;
  cardId: string;
  correct: number;
  passed: boolean;
  timestamp: number;
}

export interface AIGenerationStatus {
  isGenerating: boolean;
  error?: string;
  lastGenerated?: number;
}
