import { useGame } from "../store";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default function Scoreboard() {
  const { teams, settings } = useGame();
  const leader = teams.reduce((max, t) => (t.points > max ? t.points : max), 0);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {teams.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 rounded-md border px-3 py-2"
        >
          <span className="font-semibold">{t.name}</span>
          <Badge
            className={
              t.points === leader && leader > 0
                ? "bg-yellow-500 text-amber-700"
                : ""
            }
          >
            {t.points} / {settings.targetPoints}
          </Badge>
        </div>
      ))}
      {!teams.length && <Button disabled>Nenhum time ainda</Button>}
    </div>
  );
}
