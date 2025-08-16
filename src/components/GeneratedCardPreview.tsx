import { useState } from "react";
import { useGame } from "../store";
import { Button } from "./ui/button";

import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Eye, Copy, CheckCircle, Sparkles, X, RefreshCw } from "lucide-react";
import CardFace from "./CardFace";

interface GeneratedCardPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GeneratedCardPreview({
  open,
  onOpenChange,
}: GeneratedCardPreviewProps) {
  const { lastGeneratedCard, clearLastGeneratedCard, generateAICard } =
    useGame();
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    clearLastGeneratedCard();
  };

  const handleCopy = async () => {
    if (!lastGeneratedCard) return;

    const cardText = `Categoria: ${lastGeneratedCard.category}\nPalavras: ${lastGeneratedCard.prompts.join(", ")}`;

    try {
      await navigator.clipboard.writeText(cardText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  const handleRegenerate = async () => {
    if (!lastGeneratedCard) return;

    setIsRegenerating(true);
    try {
      // Generate new card with same category
      await generateAICard(lastGeneratedCard.category);
    } catch (error) {
      console.error("Erro ao regenerar carta:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!lastGeneratedCard) return null;

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Pessoa/Personagem": "👤",
      Lugar: "🏠",
      Objeto: "📦",
      Ação: "🏃",
      Animal: "🐱",
      Coisa: "💭",
      Livre: "🎲",
    };
    return icons[category] || "📋";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Pessoa/Personagem": "bg-blue-100 text-blue-800 border-blue-200",
      Lugar: "bg-green-100 text-green-800 border-green-200",
      Objeto: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Ação: "bg-red-100 text-red-800 border-red-200",
      Animal: "bg-purple-100 text-purple-800 border-purple-200",
      Coisa: "bg-gray-100 text-gray-800 border-gray-200",
      Livre: "bg-pink-100 text-pink-800 border-pink-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Carta Gerada por IA
          </DialogTitle>
          <DialogDescription>
            Sua nova carta foi criada com sucesso! Você pode visualizá-la,
            copiá-la ou gerar uma nova.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Card Preview */}
          <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 bg-primary/5">
            <CardFace card={lastGeneratedCard} />
          </div>

          {/* Card Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Categoria:</span>
              <Badge className={getCategoryColor(lastGeneratedCard.category)}>
                <span className="mr-1">
                  {getCategoryIcon(lastGeneratedCard.category)}
                </span>
                {lastGeneratedCard.category}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total de prompts:</span>
              <Badge variant="outline">
                {lastGeneratedCard.prompts.length} palavra
                {lastGeneratedCard.prompts.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            <div>
              <span className="text-sm font-medium">Palavras/frases:</span>
              <div className="mt-2 space-y-1">
                {lastGeneratedCard.prompts.map((prompt, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="font-mono">{prompt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={copied}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Nova carta
                </>
              )}
            </Button>
          </div>

          {/* Tips */}
          <div className="p-3 rounded-md bg-blue-50 border border-blue-200">
            <div className="text-xs text-blue-800 space-y-1">
              <p>
                <strong>💡 Dica:</strong> Esta carta já foi adicionada ao seu
                baralho automaticamente.
              </p>
              <p>
                <strong>🎯 Sugestão:</strong> Use "Nova carta" se não gostar do
                resultado.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
          <Button onClick={handleClose}>
            <Eye className="h-4 w-4 mr-2" />
            Pronto!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
