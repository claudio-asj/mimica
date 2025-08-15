import { useEffect } from "react";
import { useGame } from "../store";
import { Progress } from "./ui/progress";

export default function Timer() {
  const { settings, turn, tick } = useGame();
  useEffect(() => {
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [tick]);

  const total = settings.roundSeconds;
  const remaining = turn.remaining ?? total;
  const pct = (remaining / total) * 100;

  return (
    <div className="w-full space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Tempo</span>
        <span className="font-mono text-lg">{remaining}s</span>
      </div>
      <Progress value={pct} />
    </div>
  );
}
