# 🎭 Mímica - Jogo de Charadas Inteligente

Um jogo de mímica/charadas moderno e interativo com geração de cartas por inteligência artificial, construído com React, TypeScript e integração com Google Gemini.

![React](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF.svg)

## ✨ Características

### 🎯 Funcionalidades Principais
- **Interface Moderna**: Design responsivo e intuitivo
- **Sistema de Times**: Suporte para múltiplos times com pontuação
- **Timer Customizável**: Configure duração das rodadas (30s - 2min)
- **Controle de Pontuação**: Sistema flexível de pontos e metas
- **Histórico de Partidas**: Acompanhe o progresso do jogo

### 🤖 Inteligência Artificial
- **Geração Automática**: Cartas criadas dinamicamente pelo Google Gemini
- **Múltiplas Categorias**: Pessoa, Lugar, Objeto, Ação, Animal, Conceitos
- **Níveis de Dificuldade**: Fácil, Médio, Difícil
- **Idiomas Suportados**: Português (pt-BR) e Inglês (en)
- **Cartas Infinitas**: Nunca fique sem conteúdo novo

### 🎮 Experiência de Jogo
- **Cartas Pré-definidas**: +200 cartas prontas para jogar
- **Modo Híbrido**: Combine cartas tradicionais com IA
- **Configuração Flexível**: Adapte as regras ao seu grupo
- **Progressive Web App**: Funciona offline e pode ser instalado

## 🚀 Instalação Rápida

### Pré-requisitos
- Node.js 18 ou superior
- Conta Google (opcional, para IA)

### 1. Clone e Execute
```bash
git clone https://github.com/your-username/mimica.git
cd mimica
npm install
npm run dev
```

### 2. Configure a IA (Opcional)
```bash
cp .env.example .env
# Edite o arquivo .env com sua chave do Gemini
```

Acesse: http://localhost:5173

## 🔧 Configuração da IA

### Obter Chave da API
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Crie um projeto e gere uma API key
4. Configure no arquivo `.env` ou na interface do jogo

### Variáveis de Ambiente
```env
# API do Google Gemini
VITE_GEMINI_API_KEY=sua_chave_aqui

# Configurações padrão (opcionais)
VITE_DEFAULT_AI_DIFFICULTY=medium
VITE_DEFAULT_ROUND_SECONDS=60
VITE_DEFAULT_TARGET_POINTS=10
VITE_SHOW_CARD_BY_DEFAULT=false

# Desenvolvimento
VITE_ENABLE_DEBUG_LOGS=false
```

## 🎮 Como Jogar

### Configuração Inicial
1. **Adicione Times**: Mínimo 2 times para começar
2. **Configure Regras**: Tempo por rodada e pontos para vencer
3. **Ative a IA**: (Opcional) Para cartas infinitas e variadas

### Durante o Jogo
1. **Sorteie uma Carta**: Use cartas tradicionais ou gere com IA
2. **Inicie o Timer**: Um jogador representa, o time adivinha
3. **Marque Pontos**: Para cada acerto durante a rodada
4. **Passe ou Encerre**: Continue até o tempo acabar

### Categorias Disponíveis
- 🧑 **Pessoa/Personagem**: Famosos, personagens ficcionais
- 🏠 **Lugar**: Cidades, países, ambientes
- 📦 **Objeto**: Utensílios, ferramentas, equipamentos
- 🏃 **Ação**: Verbos, atividades, movimentos
- 🐱 **Animal**: Domésticos, selvagens, marinhos
- 💭 **Coisa**: Conceitos abstratos, sentimentos
- 🎲 **Livre**: Mistura aleatória de todas as categorias

## 🛠️ Tecnologias

### Frontend
- **React**: Interface de usuário
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização utilitária
- **Radix UI**: Componentes acessíveis
- **Zustand**: Gerenciamento de estado

### IA e APIs
- **Google Gemini**: Geração de conteúdo
- **Vite**: Build tool e desenvolvimento

### Ferramentas
- **ESLint**: Linting de código
- **React Hot Toast**: Notificações
- **Lucide React**: Ícones

## 📱 Responsividade

- ✅ **Mobile First**: Otimizado para celulares
- ✅ **Tablet**: Layout adaptado para tablets
- ✅ **Desktop**: Interface completa para computadores
- ✅ **PWA Ready**: Pode ser instalado como app

## 🔒 Privacidade e Segurança

- 🔐 **API Keys Locais**: Chaves armazenadas apenas no navegador
- 🚫 **Sem Coleta de Dados**: Nenhuma informação enviada para nossos servidores
- 🔒 **Conexão Segura**: Comunicação direta com APIs do Google
- 💾 **Storage Local**: Configurações salvas no dispositivo

## 📈 Performance

- ⚡ **Carregamento Rápido**: < 2s para inicialização
- 🎯 **Bundle Otimizado**: < 400KB de JavaScript
- 🔄 **Lazy Loading**: Componentes carregados sob demanda
- 📱 **Offline First**: Funciona sem conexão (cartas tradicionais)

## 🚀 Deploy

### Build de Produção
```bash
npm run build
npm run preview
```

### Plataformas Suportadas
- Vercel (recomendado)
- Netlify
- GitHub Pages
- Qualquer host de arquivos estáticos

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Add nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Desenvolvimento
```bash
# Clone e configure
git clone https://github.com/claudio-asj/mimica.git
cd mimica
npm install

# Configure ambiente
cp .env.example .env
# Adicione sua chave do Gemini

# Execute em desenvolvimento
npm run dev
```

Para mais detalhes, consulte [DEV_SETUP.md](./DEV_SETUP.md)

## 📝 Roadmap

### Próximas Funcionalidades
- [ ] Modo torneio com eliminatórias
- [ ] Integração com outras IAs (OpenAI, Claude)
- [ ] Cartas com imagens geradas por IA
- [ ] Modo cooperativo
- [ ] Estatísticas avançadas
- [ ] Cartas personalizadas por usuário
- [ ] Modo online multiplayer

### Melhorias Planejadas
- [ ] Modo offline completo
- [ ] Exportar/importar configurações
- [ ] Temas personalizáveis
- [ ] Suporte a mais idiomas
- [ ] Accessibility melhorada

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [Radix UI](https://www.radix-ui.com/) pelos componentes acessíveis
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS
- [Google](https://ai.google.dev/) pela API Gemini
- [Lucide](https://lucide.dev/) pelos ícones
- Comunidade open source pelos feedbacks e contribuições

## 📞 Suporte

- 📖 **Documentação**: [Wiki do projeto](https://github.com/your-username/mimica/wiki)
- 🐛 **Bugs**: [Issues do GitHub](https://github.com/your-username/mimica/issues)
- 💬 **Discussões**: [GitHub Discussions](https://github.com/your-username/mimica/discussions)
- ✉️ **Contato**: [seu-email@example.com](mailto:seu-email@example.com)

---

<div align="center">

**Desenvolvido com ❤️ para diversão em família e amigos**

[Demo](https://mimica-demo.vercel.app) • [Documentação](./DEV_SETUP.md) • [Configuração IA](./SETUP_GEMINI.md)

</div>
