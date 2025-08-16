import type { Difficulty, Theme } from "../types";

interface EnvironmentConfig {
  // Gemini API
  geminiApiKey: string;
  defaultAiDifficulty: Difficulty;
  defaultAiLanguage: "pt-BR" | "en";

  // Game settings
  defaultRoundSeconds: number;
  defaultTargetPoints: number;
  showCardByDefault: boolean;
  defaultMaxPointsPerCard: number;
  defaultAutoPassOnMaxPoints: boolean;
  defaultAiOnlyMode: boolean;
  defaultTheme: Theme;

  // Development
  enableDebugLogs: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
}

class EnvironmentService {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): EnvironmentConfig {
    return {
      // Gemini API
      geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
      defaultAiDifficulty: this.parseAiDifficulty(
        import.meta.env.VITE_DEFAULT_AI_DIFFICULTY,
      ),
      defaultAiLanguage: this.parseLanguage(
        import.meta.env.VITE_DEFAULT_AI_LANGUAGE,
      ),

      // Game settings
      defaultRoundSeconds: this.parseNumber(
        import.meta.env.VITE_DEFAULT_ROUND_SECONDS,
        60,
      ),
      defaultTargetPoints: this.parseNumber(
        import.meta.env.VITE_DEFAULT_TARGET_POINTS,
        10,
      ),
      showCardByDefault: this.parseBoolean(
        import.meta.env.VITE_SHOW_CARD_BY_DEFAULT,
        false,
      ),
      defaultMaxPointsPerCard: this.parseNumber(
        import.meta.env.VITE_DEFAULT_MAX_POINTS_PER_CARD,
        5,
      ),
      defaultAutoPassOnMaxPoints: this.parseBoolean(
        import.meta.env.VITE_DEFAULT_AUTO_PASS_ON_MAX_POINTS,
        true,
      ),
      defaultAiOnlyMode: this.parseBoolean(
        import.meta.env.VITE_DEFAULT_AI_ONLY_MODE,
        false,
      ),
      defaultTheme: this.parseTheme(import.meta.env.VITE_DEFAULT_THEME),

      // Development
      enableDebugLogs: this.parseBoolean(
        import.meta.env.VITE_ENABLE_DEBUG_LOGS,
        false,
      ),
      isDevelopment: import.meta.env.DEV || false,
      isProduction: import.meta.env.PROD || false,
    };
  }

  private parseNumber(value: string | undefined, defaultValue: number): number {
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  private parseBoolean(
    value: string | undefined,
    defaultValue: boolean,
  ): boolean {
    if (!value) return defaultValue;
    return value.toLowerCase() === "true";
  }

  private parseAiDifficulty(value: string | undefined): Difficulty {
    const validDifficulties: Difficulty[] = ["easy", "medium", "hard"];
    if (value && validDifficulties.includes(value as Difficulty)) {
      return value as Difficulty;
    }
    return "medium";
  }

  private parseLanguage(value: string | undefined): "pt-BR" | "en" {
    if (value === "en" || value === "pt-BR") {
      return value;
    }
    return "pt-BR";
  }

  private parseTheme(value: string | undefined): Theme {
    const validThemes: Theme[] = ["light", "dark", "system"];
    if (value && validThemes.includes(value as Theme)) {
      return value as Theme;
    }
    return "system";
  }

  private validateConfig(): void {
    if (
      this.config.defaultRoundSeconds < 10 ||
      this.config.defaultRoundSeconds > 300
    ) {
      console.warn(
        "Invalid VITE_DEFAULT_ROUND_SECONDS: must be between 10 and 300 seconds",
      );
    }

    if (
      this.config.defaultTargetPoints < 1 ||
      this.config.defaultTargetPoints > 50
    ) {
      console.warn(
        "Invalid VITE_DEFAULT_TARGET_POINTS: must be between 1 and 50 points",
      );
    }

    if (
      this.config.defaultMaxPointsPerCard < 1 ||
      this.config.defaultMaxPointsPerCard > 20
    ) {
      console.warn(
        "Invalid VITE_DEFAULT_MAX_POINTS_PER_CARD: must be between 1 and 20 points",
      );
    }

    if (this.config.enableDebugLogs) {
      console.log("Environment configuration loaded:", {
        hasGeminiKey: !!this.config.geminiApiKey,
        difficulty: this.config.defaultAiDifficulty,
        language: this.config.defaultAiLanguage,
        roundSeconds: this.config.defaultRoundSeconds,
        targetPoints: this.config.defaultTargetPoints,
        maxPointsPerCard: this.config.defaultMaxPointsPerCard,
        autoPassOnMaxPoints: this.config.defaultAutoPassOnMaxPoints,
        aiOnlyMode: this.config.defaultAiOnlyMode,
        theme: this.config.defaultTheme,
        isDev: this.config.isDevelopment,
      });
    }
  }

  // Getters for accessing configuration
  get geminiApiKey(): string {
    return this.config.geminiApiKey;
  }

  get hasGeminiApiKey(): boolean {
    return !!this.config.geminiApiKey;
  }

  get defaultAiDifficulty(): Difficulty {
    return this.config.defaultAiDifficulty;
  }

  get defaultAiLanguage(): "pt-BR" | "en" {
    return this.config.defaultAiLanguage;
  }

  get defaultRoundSeconds(): number {
    return this.config.defaultRoundSeconds;
  }

  get defaultTargetPoints(): number {
    return this.config.defaultTargetPoints;
  }

  get showCardByDefault(): boolean {
    return this.config.showCardByDefault;
  }

  get defaultMaxPointsPerCard(): number {
    return this.config.defaultMaxPointsPerCard;
  }

  get defaultAutoPassOnMaxPoints(): boolean {
    return this.config.defaultAutoPassOnMaxPoints;
  }

  get defaultAiOnlyMode(): boolean {
    return this.config.defaultAiOnlyMode;
  }

  get defaultTheme(): Theme {
    return this.config.defaultTheme;
  }

  get enableDebugLogs(): boolean {
    return this.config.enableDebugLogs;
  }

  get isDevelopment(): boolean {
    return this.config.isDevelopment;
  }

  get isProduction(): boolean {
    return this.config.isProduction;
  }

  // Utility methods
  log(message: string, ...args: unknown[]): void {
    if (this.config.enableDebugLogs) {
      console.log(`[Mimica Debug] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.config.enableDebugLogs || this.config.isDevelopment) {
      console.warn(`[Mimica Warning] ${message}`, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    console.error(`[Mimica Error] ${message}`, ...args);
  }

  // Get all config for debugging
  getConfig(): Readonly<EnvironmentConfig> {
    return { ...this.config };
  }

  // Check if environment variables are properly configured
  checkConfiguration(): {
    isValid: boolean;
    warnings: string[];
    suggestions: string[];
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (!this.hasGeminiApiKey) {
      warnings.push("Gemini API key not configured");
      suggestions.push("Set VITE_GEMINI_API_KEY to enable AI card generation");
    }

    if (this.defaultRoundSeconds < 30) {
      warnings.push("Round duration is quite short (< 30s)");
      suggestions.push(
        "Consider increasing VITE_DEFAULT_ROUND_SECONDS for better gameplay",
      );
    }

    if (this.defaultTargetPoints < 5) {
      warnings.push("Target points is quite low (< 5)");
      suggestions.push(
        "Consider increasing VITE_DEFAULT_TARGET_POINTS for longer games",
      );
    }

    return {
      isValid: warnings.length === 0,
      warnings,
      suggestions,
    };
  }
}

// Export singleton instance
export const env = new EnvironmentService();

// Export types for use in other files
export type { EnvironmentConfig };
