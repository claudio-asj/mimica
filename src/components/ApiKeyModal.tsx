import { useState } from "react";
import { useGame } from "../store";
import { geminiService } from "../services/gemini";
import { env } from "../lib/env";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  AlertCircle,
  ExternalLink,
  Key,
  Loader2,
  CheckCircle,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ApiKeyModal({ open, onOpenChange }: ApiKeyModalProps) {
  const { settings, setGeminiApiKey } = useGame();
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || "");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError("Por favor, insira uma chave de API válida");
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      const isValid = await geminiService.validateApiKey(apiKey.trim());

      if (isValid) {
        setGeminiApiKey(apiKey.trim());
        toast.success("Chave de API configurada com sucesso!");
        onOpenChange(false);
        setApiKey("");
      } else {
        setError("Chave de API inválida. Verifique e tente novamente.");
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Erro ao validar a chave de API");
    } finally {
      setIsValidating(false);
    }
  };

  const handleCancel = () => {
    setApiKey(settings.geminiApiKey || "");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configurar API do Gemini
          </DialogTitle>
          <DialogDescription>
            Configure sua chave de API do Google Gemini para gerar cartas
            automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {env.hasGeminiApiKey && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">
                    API configurada via variável de ambiente
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    VITE_GEMINI_API_KEY
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Sua chave de API já está configurada através de variáveis de
                  ambiente. Você pode sobrescrever essa configuração inserindo
                  uma nova chave abaixo.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              Chave de API do Gemini
            </label>
            <Input
              id="api-key"
              type="password"
              placeholder={
                env.hasGeminiApiKey
                  ? "Sobrescrever chave de ambiente..."
                  : "Cole sua chave de API aqui..."
              }
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError("");
              }}
              disabled={isValidating}
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3 text-sm">
                <div className="font-medium">Como obter sua chave de API:</div>
                <ol className="space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>Acesse o Google AI Studio</li>
                  <li>Faça login com sua conta Google</li>
                  <li>Clique em "Get API Key"</li>
                  <li>Crie um novo projeto ou use um existente</li>
                  <li>Copie a chave gerada</li>
                </ol>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    window.open(
                      "https://makersuite.google.com/app/apikey",
                      "_blank",
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir Google AI Studio
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              <strong>Nota:</strong> Sua chave de API é armazenada localmente no
              seu navegador e nunca é enviada para nossos servidores.
            </div>

            {env.isDevelopment && (
              <Card>
                <CardContent className="pt-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Settings className="h-3 w-3" />
                    <span className="font-medium">
                      Configuração de Desenvolvimento
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <p>
                      • Dificuldade padrão:{" "}
                      <Badge variant="outline" className="text-xs">
                        {env.defaultAiDifficulty}
                      </Badge>
                    </p>
                    <p>
                      • Idioma:{" "}
                      <Badge variant="outline" className="text-xs">
                        {env.defaultAiLanguage}
                      </Badge>
                    </p>
                    <p>
                      • Debug logs:{" "}
                      <Badge variant="outline" className="text-xs">
                        {env.enableDebugLogs ? "Ativo" : "Inativo"}
                      </Badge>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isValidating}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isValidating || !apiKey.trim()}
          >
            {isValidating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Validando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
