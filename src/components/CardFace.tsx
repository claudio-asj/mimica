import { type Card as CardType } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export default function CardFace({ card }: { card: CardType }) {
  return (
    <Card className="w-full md:w-[520px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Carta
          <Badge>{card.category}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-2 pl-5 list-decimal">
          {card.prompts.map((p, i) => (
            <li key={i} className="text-lg">
              {p}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
