import { useGame } from "../store";
import cards from "../data/cards.json";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import type { Card } from "../types";

export default function History() {
  const { history, teams } = useGame();
  const idxById = Object.fromEntries(teams.map((t, i) => [t.id, i]));
  const cardById = Object.fromEntries((cards as Card[]).map((c) => [c.id, c]));

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-2">Quando</TableHead>
            <TableHead className="px-2">Time</TableHead>
            <TableHead className="px-2">Carta</TableHead>
            <TableHead className="px-2 text-center">Acertos</TableHead>
            <TableHead className="px-2 text-center">Passou?</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {history.length > 0 ? (
            history
              .slice()
              .reverse()
              .map((h, i) => {
                const team = teams[idxById[h.teamId]];
                const card = cardById[h.cardId];
                return (
                  <TableRow key={i}>
                    <TableCell className="px-2">
                      {new Date(h.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="px-2">{team?.name ?? "?"}</TableCell>
                    <TableCell className="px-2">
                      {card
                        ? `${card.category ?? ""} — ${card.prompts?.[0] ?? ""}`
                        : "?"}
                    </TableCell>
                    <TableCell className="text-center">{h.correct}</TableCell>
                    <TableCell className="text-center">
                      {h.passed ? "Sim" : "Não"}
                    </TableCell>
                  </TableRow>
                );
              })
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-muted-foreground p-4 text-center"
              >
                Sem histórico por enquanto.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
