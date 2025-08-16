import { useState, useEffect } from "react";
import Setup from "./components/Setup";
import Game from "./components/Game";
import { useGame } from "./store";
import { Button } from "./components/ui/button";
import { ThemeProvider } from "./components/theme-provider";
import { ShareDialog } from "./components/ShareDialog";

export default function App() {
  const [started, setStarted] = useState(false);
  const { teams, settings } = useGame();

  useEffect(() => {
    document.title = "Mimica";
    console.log(teams.length);
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen p-4 md:p-6 max-w-6xl mx-auto grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <img src="/logo.png" alt="Mímica Logo" className="mr-2 w-8" />{" "}
            Mímica
          </h1>
          <div className="text-sm text-muted-foreground">
            Rodada: {settings.roundSeconds}s • Meta: {settings.targetPoints} pts
          </div>
        </header>
        <div className="max-w-sm mx-auto">
          <ShareDialog />
        </div>
        {!started ? (
          <Setup onStart={() => setStarted(true)} />
        ) : (
          <>
            <Game />
            <footer className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Dica: mostre a carta só para quem vai desenhar/mimar.</span>
              <Button variant="ghost" onClick={() => setStarted(false)}>
                Reconfigurar
              </Button>
            </footer>
          </>
        )}
      </div>
    </ThemeProvider>
  );
}
