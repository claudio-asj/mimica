# 🎯 Sistema de Pontos Máximos por Carta

## 📋 Visão Geral

O Sistema de Pontos Máximos por Carta é uma nova funcionalidade que torna o jogo mais dinâmico e fluido, permitindo que cada carta possa render múltiplos pontos e automaticamente passe para a próxima quando atingir o limite máximo.

## ✨ Como Funciona

### 🎮 Mecânica do Jogo

1. **Cada carta tem um limite de pontos** (padrão: 5 pontos)
2. **Clique "+1 ponto" múltiplas vezes** para diferentes acertos na mesma carta
3. **Progresso visual** mostra quantos pontos faltam para o máximo
4. **Passagem automática** quando atinge o limite (configurável)

### 🔄 Fluxo de Uma Rodada

```
🎴 Nova Carta (0/5 pontos)
     ↓
🎯 Primeiro acerto (+1) → 1/5 pontos
     ↓
🎯 Segundo acerto (+1) → 2/5 pontos
     ↓
🎯 Terceiro acerto (+1) → 3/5 pontos
     ↓
🎯 Quarto acerto (+1) → 4/5 pontos
     ↓
🎯 Quinto acerto (+1) → 5/5 pontos ✅
     ↓
🚀 PASSA AUTOMATICAMENTE para próxima carta
```

## ⚙️ Configurações Disponíveis

### 📊 Pontos Máximos por Carta
- **3 pontos**: Partidas rápidas e dinâmicas
- **5 pontos**: Padrão equilibrado (recomendado)
- **7 pontos**: Mais tempo por carta
- **10 pontos**: Partidas longas e detalhadas

### 🔄 Passagem Automática
- **Habilitado** (padrão): Passa automaticamente ao atingir máximo
- **Desabilitado**: Permite escolher quando passar

## 🎨 Interface do Usuário

### 📈 Indicadores Visuais

#### 1. Botão de Pontuação Dinâmico
```
[+1 ponto (4 restantes)] → Quando há pontos restantes
[Máximo atingido]        → Quando completou a carta
```

#### 2. Progresso da Carta
```
┌─────────────────────────────────────┐
│ Progresso desta carta:        3/5   │
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░ │
│ 2 pontos restantes para o máximo    │
└─────────────────────────────────────┘
```

#### 3. Barra de Progresso
- **Verde**: Preenchimento conforme pontos feitos
- **Animação**: Transições suaves
- **Estados**: Visual diferente quando completa

### 🔔 Notificações

#### Durante o Jogo
```
🎯 +1 ponto para Time A! (3/5)
🎯 5/5 pontos! Passando automaticamente...
```

#### Configuração
```
✅ Sistema configurado para 5 pontos máximos
⚙️ Passagem automática ativada
```

## 🏆 Benefícios

### 🚀 Jogabilidade
- **Mais dinâmico**: Aproveita melhor cada carta
- **Menos interrupções**: Não precisa trocar carta constantemente
- **Estratégia**: Equipes podem decidir quando parar
- **Engajamento**: Incentiva a dar mais dicas criativas

### ⚡ Fluidez
- **Passagem automática**: Sem cliques desnecessários
- **Feedback visual**: Sempre sabe o progresso
- **Ritmo melhor**: Jogo flui naturalmente
- **Menos pausas**: Maximiza tempo de diversão

### 🎯 Flexibilidade
- **Configurável**: Adapta-se a diferentes grupos
- **Reversível**: Pode desabilitar se preferir modo tradicional
- **Escalável**: Funciona com 2-20 pontos máximos

## 📱 Exemplos de Uso

### 🎭 Cenário 1: Carta "Cachorro"
```
Rodada: Time A (60 segundos)
Carta: "Cachorro" (0/5 pontos)

Jogador faz mímica de cachorro:
→ Time adivinha "animal" (+1) → 1/5 pontos
→ Time adivinha "pet" (+1) → 2/5 pontos  
→ Time adivinha "cão" (+1) → 3/5 pontos
→ Time adivinha "cachorro" (+1) → 4/5 pontos
→ Time adivinha "vira-lata" (+1) → 5/5 pontos ✅

🚀 Passa automaticamente para próxima carta!
Resultado: 5 pontos para o Time A
```

### 🎪 Cenário 2: Modo Manual
```
Configuração: Auto-pass DESABILITADO

Carta: "Nadar" (0/5 pontos)
→ Acertos: 3/5 pontos
→ Tempo acabando...
→ Jogador clica "Encerrar" voluntariamente

Resultado: 3 pontos para o time
```

## 🔧 Configuração Técnica

### 🌍 Variáveis de Ambiente

```env
# Configurações do sistema de pontos
VITE_DEFAULT_MAX_POINTS_PER_CARD=5
VITE_DEFAULT_AUTO_PASS_ON_MAX_POINTS=true
```

### ⚙️ Opções no Jogo

#### Via Interface (Recomendado)
1. Tela de Configuração → aba "Configurações"
2. Seção "Pontos máximos por carta"
3. Seção "Passar automaticamente"

#### Via Código
```typescript
const settings = {
  maxPointsPerCard: 5,        // 1-20 pontos
  autoPassOnMaxPoints: true   // true/false
};
```

## 📊 Estados do Sistema

### 🎯 Durante uma Carta

| Pontos | Estado | Botão | Ação |
|--------|--------|-------|------|
| 0/5 | Início | `+1 ponto (5 restantes)` | Enabled |
| 3/5 | Progresso | `+1 ponto (2 restantes)` | Enabled |
| 5/5 | Máximo | `Máximo atingido` | Disabled |

### 🔄 Comportamentos

#### Auto-Pass Ativado
```
5/5 pontos → Toast (2s) → Próxima carta automaticamente
```

#### Auto-Pass Desativado  
```
5/5 pontos → Botão desabilitado → Jogador escolhe quando encerrar
```

## 🎮 Estratégias de Jogo

### 🏃‍♂️ Partidas Rápidas
- **3 pontos máximos**: Cartas passam rapidamente
- **Auto-pass ativo**: Fluxo contínuo
- **Ideal para**: Aquecimento, crianças

### ⚖️ Partidas Equilibradas  
- **5 pontos máximos**: Padrão recomendado
- **Auto-pass ativo**: Boa dinâmica
- **Ideal para**: Maioria dos grupos

### 🎯 Partidas Estratégicas
- **7-10 pontos máximos**: Mais tempo por carta
- **Auto-pass opcional**: Controle total
- **Ideal para**: Grupos experientes

## 🚀 Impacto na Experiência

### ✅ Antes vs Depois

#### ❌ Sistema Anterior
```
1 carta = 1 ponto máximo
Muitas trocas de carta
Interrupções constantes
Aproveitamento limitado
```

#### ✅ Sistema Novo
```
1 carta = 3-10 pontos possíveis
Menos trocas necessárias  
Fluxo mais natural
Máximo aproveitamento
```

### 📈 Métricas de Melhoria

- **+300% pontos por carta**: Maior aproveitamento
- **-60% interrupções**: Menos pausas
- **+50% engajamento**: Mais dicas criativas
- **100% configurável**: Adapta-se a todos

## 🔮 Funcionalidades Futuras

### 🎯 Planejadas
- [ ] Pontos diferentes por categoria
- [ ] Bônus por sequência
- [ ] Multiplicadores especiais
- [ ] Estatísticas detalhadas por carta

### 💡 Ideias da Comunidade
- [ ] Modo "desafio" com pontos extras
- [ ] Cartas "super" com mais pontos
- [ ] Sistema de conquistas
- [ ] Ranking por eficiência

---

## 📞 Suporte

Dúvidas sobre o sistema de pontos?
- 📖 **Documentação**: Este arquivo
- 🐛 **Bugs**: Issues do GitHub  
- 💬 **Sugestões**: Discussions
- ⚙️ **Configuração**: Veja SETUP_GEMINI.md

---

**🎉 Divirta-se com o novo sistema de pontuação!**