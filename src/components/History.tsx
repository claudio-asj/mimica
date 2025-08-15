import { useGame } from "../store";
import cards from "../data/cards.json";
import { Table, TableBody, TableCell, TableHead, TableRow } from "./ui/table";

export default function History() {
  const { history, teams } = useGame();
  const idxById = Object.fromEntries(teams.map((t, i) => [t.id, i]));
  const cardById = Object.fromEntries((cards as any[]).map((c) => [c.id, c]));

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Quando</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Carta</TableCell>
            <TableCell>Acertos</TableCell>
            <TableCell>Passou?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history
            .slice()
            .reverse()
            .map((h, i) => (
              <TableRow key={i}>
                <TableCell>
                  {new Date(h.timestamp).toLocaleTimeString()}
                </TableCell>
                <TableCell>{teams[idxById[h.teamId]]?.name ?? "?"}</TableCell>
                <TableCell>
                  {cardById[h.cardId]?.category ?? ""} —{" "}
                  {cardById[h.cardId]?.prompts?.[0]}
                </TableCell>
                <TableCell>{h.correct}</TableCell>
                <TableCell>{h.passed ? "Sim" : "Não"}</TableCell>
              </TableRow>
            ))}
          {!history.length && (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground p-4">
                Sem histórico por enquanto.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
