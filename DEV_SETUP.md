# Guia de Desenvolvimento - Mímica

Este guia contém todas as informações necessárias para configurar e desenvolver o projeto Mímica localmente.

## 🚀 Configuração Inicial

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Google (para API do Gemini)

### 1. Clone e Instalação
```bash
git clone <repository-url>
cd mimica
npm install
```

### 2. Configuração de Variáveis de Ambiente

Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

Configure suas variáveis no arquivo `.env`:

```env
# OBRIGATÓRIO para IA
VITE_GEMINI_API_KEY=sua_chave_aqui

# OPCIONAIS - Configurações da IA
VITE_DEFAULT_AI_DIFFICULTY=medium
VITE_DEFAULT_AI_LANGUAGE=pt-BR

# OPCIONAIS - Configurações do Jogo
VITE_DEFAULT_ROUND_SECONDS=60
VITE_DEFAULT_TARGET_POINTS=10
VITE_SHOW_CARD_BY_DEFAULT=false

# DESENVOLVIMENTO
VITE_ENABLE_DEBUG_LOGS=true
```

### 3. Obter Chave da API Gemini

1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Crie um projeto ou use existente
4. Gere uma nova API key
5. Cole a chave no arquivo `.env`

## 🛠️ Comandos de Desenvolvimento

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── Game.tsx        # Tela principal do jogo
│   ├── Setup.tsx       # Configuração inicial
│   ├── AICardGenerator.tsx  # Gerador de cartas IA
│   └── ApiKeyModal.tsx # Modal para configurar API
├── services/           # Serviços externos
│   └── gemini.ts      # Integração com Google Gemini
├── lib/               # Utilitários
│   ├── utils.ts       # Helpers gerais
│   └── env.ts         # Configuração de ambiente
├── data/              # Dados estáticos
│   └── cards.json     # Cartas pré-definidas
├── store.ts           # Estado global (Zustand)
└── types.ts           # Tipos TypeScript
```

## 🧪 Recursos de Desenvolvimento

### Debug Logs
Ative logs detalhados:
```env
VITE_ENABLE_DEBUG_LOGS=true
```

### Modo de Desenvolvimento
```bash
npm run dev
```
- Hot reload automático
- Source maps habilitados
- Informações de ambiente no console

### Configurações Flexíveis
Todas as configurações podem ser sobrescritas via:
1. Variáveis de ambiente (`.env`)
2. Interface do usuário
3. LocalStorage (persistido)

## 🤖 Integração com IA

### Como funciona
1. **Gemini API**: Gera cartas dinamicamente
2. **Categorias**: Suporte a todas as categorias do jogo
3. **Dificuldades**: Easy, Medium, Hard
4. **Idiomas**: Português (pt-BR) e Inglês (en)

### Testando a IA
```javascript
// No console do navegador
import { geminiService } from './src/services/gemini.ts';

// Teste de conexão
await geminiService.validateApiKey('sua_chave');

// Gerar carta
await geminiService.generateSingleCard('Ação', 'medium');
```

### Limitações
- Rate limiting da API
- Requer conexão com internet
- Dependente da qualidade da resposta da IA

## 🎨 Estilização

### Tecnologias
- **Tailwind CSS**: Framework CSS
- **Radix UI**: Componentes acessíveis
- **Lucide React**: Ícones

### Tema
- Design system consistente
- Modo escuro/claro automático
- Responsivo (mobile-first)

### Customização
Edite `src/index.css` para temas globais ou use classes Tailwind nos componentes.

## 📱 Responsividade

### Breakpoints
- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+

### Testes
Teste em diferentes dispositivos:
```bash
# Abra o dev server
npm run dev

# Acesse via rede local
# http://192.168.x.x:5173
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. API Key não funciona
```bash
# Verificar configuração
console.log(import.meta.env.VITE_GEMINI_API_KEY)

# Verificar conexão
npm run dev
# Abrir console do navegador
```

#### 2. Build falha
```bash
# Limpar cache
rm -rf node_modules dist
npm install
npm run build
```

#### 3. TypeScript errors
```bash
# Verificar tipos
npx tsc --noEmit

# Regenerar tipos se necessário
npm run build
```

#### 4. Cartas não geram
- Verificar se API key está válida
- Verificar quota da API Gemini
- Verificar conexão com internet
- Verificar logs no console

### Debug Avançado

#### Logs da IA
```typescript
// Ativar logs detalhados
localStorage.setItem('debug-ai', 'true');

// Ver configuração atual
import { env } from './src/lib/env';
console.log(env.getConfig());
```

#### State do Jogo
```typescript
// Verificar estado global
import { useGame } from './src/store';
console.log(useGame.getState());
```

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Variáveis de Ambiente
Para produção, configure:
```env
VITE_GEMINI_API_KEY=chave_producao
VITE_DEFAULT_AI_DIFFICULTY=medium
VITE_ENABLE_DEBUG_LOGS=false
```

### Plataformas Suportadas
- Vercel
- Netlify
- GitHub Pages
- Qualquer host de arquivos estáticos

## 🔧 Extensibilidade

### Adicionar Nova Categoria
1. Editar `src/types.ts`:
```typescript
export type Category = "..." | "NovaCategoria";
```

2. Atualizar `src/services/gemini.ts`:
```typescript
const categoryDescriptions = {
  // ...
  "NovaCategoria": "descrição..."
};
```

### Adicionar Novo Idioma
1. Editar `src/lib/env.ts`
2. Atualizar prompts no `gemini.ts`
3. Adicionar traduções necessárias

### Personalizar UI
- Componentes em `src/components/ui/`
- Usando Radix UI como base
- Totalmente customizável via Tailwind

## 📚 Recursos Úteis

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Google AI Studio](https://makersuite.google.com/)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Add nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Padrões de Código
- TypeScript strict mode
- ESLint + Prettier
- Componentes funcionais
- Hooks personalizados quando necessário
- Comentários em português nos components de UI