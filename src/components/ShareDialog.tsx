import { useState } from "react";
import { Copy, Check, Share2, Github, Linkedin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Ícone simples para WhatsApp, já que Lucide não tem um oficial
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

export function ShareDialog() {
  const [isCopied, setIsCopied] = useState(false);
  const projectUrl = "https://mimica-cld.vercel.app";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          <span>Compartilhar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Compartilhe o Mímica!</DialogTitle>
          <DialogDescription>
            Gostou do jogo? Envie para seus amigos e familiares.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue={projectUrl} readOnly />
            </div>
            <Button
              type="button"
              size="sm"
              className="px-3"
              onClick={handleCopy}
            >
              <span className="sr-only">Copiar</span>
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="space-y-2 rounded-lg border bg-slate-50/50 p-4 dark:bg-slate-800/20">
            <p className="text-sm text-muted-foreground">
              Este é um projeto pessoal de código aberto. Se você tiver
              sugestões de melhoria, encontrou um bug ou quer colaborar, entre
              em contato!
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href="https://wa.me/5521979317341"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <WhatsAppIcon />
                  <span className="ml-2">WhatsApp</span>
                </Button>
              </a>
              <a
                href="https://www.linkedin.com/in/claudioasjr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <Linkedin className="h-4 w-4" />
                  <span className="ml-2">LinkedIn</span>
                </Button>
              </a>
              <a
                href="https://github.com/claudio-asj/mimica"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <Github className="h-4 w-4" />
                  <span className="ml-2">GitHub</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
