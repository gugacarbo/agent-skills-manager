---
title: Decisões de Planejamento
sidebar_label: Decisões
---

# Decisões de Planejamento

Este documento consolida as decisões de arquitetura e features tomadas durante o planejamento do Agent Skills Manager.

## Resumo Executivo

**Foco Principal**: Ferramenta individual para gerenciar e sincronizar skills de agentes de IA entre workspaces.

**Diferenciais**:
- Multi-agent nativo (Copilot, Claude, etc.)
- Templates embutidos para onboarding rápido
- Validação de sintaxe de skills
- Sincronização Git inteligente

**Fora do Escopo (por enquanto)**:
- Skill marketplace
- Analytics de uso
- Skill composer visual
- Portable packages

---

## Decisões de Arquitetura

### 1. Validação de Schema

**Decisão**: Usar **Zod** para validação runtime

**Alternativas Consideradas**:
- JSON Schema (mais leve, menos type-safe)
- Validação manual (mais frágil)

**Racional**:
- Type safety end-to-end com TypeScript
- Validação em runtime de arquivos carregados
- Mensagens de erro claras e úteis
- Schema como fonte de verdade única

**Impacto**:
- Dependência: `zod`
- Schema definitions em `shared/types.ts`
- Validação em todos os pontos de entrada

---

### 2. Modelo de Segurança

**Decisão**: **Permissivo com avisos**

**Alternativas Consideradas**:
- Restritivo (bloquear paths fora do workspace)
- Configurável por policy

**Racional**:
- Flexibilidade para usuários avançados
- Avisos claros sobre riscos
- Usuário mantém controle final
- Balanceia segurança e usabilidade

**Implementação**:
- Warn em operações potencialmente perigosas
- Validação de paths (sanitize)
- Confirmação em operações destrutivas

---

### 3. Estratégia de Testes

**Decisão**: **Testes unitários para funções críticas**

**Escopo Incluído**:
- Path resolver
- Sync engine
- Validação de schema (Zod)
- Git operations (com mocks)

**Escopo Excluído**:
- Testes E2E (por enquanto)
- Testes de integração complexos

**Racional**:
- Custo-benefício inicial
- Cobertura de funções críticas
- Rápida execução no CI

**Stack**:
- Vitest (runner)
- Testing Library (se necessário)

---

### 4. Observabilidade

**Decisão**: **Logging estruturado sem telemetria**

**Alternativas Consideradas**:
- Completo (logs + telemetria anonymized)
- Debug mode simples
- Mínimo (apenas erros)

**Implementação**:
- Output channel no VS Code
- Log levels: `info`, `warn`, `error`, `debug`
- Debug mode ativável via setting
- Zero telemetria/analytics

**Racional**:
- Privacidade do usuário
- Suficiente para debugging
- Menor complexidade

---

### 5. Performance

**Decisão**: **Otimizar sem limites fixos**

**Alternativas Consideradas**:
- Limites rígidos (ex: máx 100 skills)
- Limites configuráveis
- Resolver quando surgir problema

**Abordagem**:
- Foco em performance desde o início
- Sem hard limits artificiais
- Monitorar e otimizar conforme necessidade
- Lazy loading e cache estratégico

**Otimizações Planejadas**:
- Cache de paths resolvidos
- Virtualização de listas grandes
- Debounce em operações de sync
- Git operations em batch

---

### 6. Compatibilidade

**Decisão**: **Sem preocupação com compatibilidade** (projeto novo)

**Alternativas Consideradas**:
- SemVer estrito + migração automática
- Backward compat total
- Feature flags

**Racional**:
- Nada desenvolvido ainda
- Liberdade para iterar rápido
- Breaking changes aceitáveis na fase inicial
- Foco em entregar valor rápido

**Futuro**:
- Adotar SemVer após Fase 2
- Migration scripts se necessário

---

### 7. API Pública

**Decisão**: **Não expor API pública**

**Alternativas Consideradas**:
- API completa (commands, events, hooks)
- Parcial (apenas commands)

**Racional**:
- Foco em uso direto
- Menor superfície de manutenção
- Extensão para consumo próprio
- Evitar complexidade desnecessária

**Exceção**:
- Commands da Command Palette (públicos por natureza)

---

### 8. Distribuição

**Decisão**: **VS Code Marketplace**

**Alternativas Consideradas**:
- Marketplace + canal beta
- GitHub releases apenas
- Instalação manual (.vsix)

**Racional**:
- Melhor UX para usuários
- Instalação com 1 clique
- Atualizações automáticas
- Visibilidade no marketplace

**Processo**:
- Versões estáveis diretamente
- Changelog no GitHub
- README com instruções

---

## Features Priorizadas

### Fase 3 - UI/UX Avançada 📋

**Template Library (Embutida)**
- Templates pré-construídos para agents comuns
- Categorias: Copilot, Claude, genéricos
- Onboarding rápido para novos usuários
- Biblioteca oficial da extensão

**Skill Composer (Adiado)**
- *Decisão posterior*: Não implementar inicialmente
- Foco em editor de texto simples
- Composer pode vir em fase futura

### Fase 4 - Recursos Avançados 🚀

**Multi-Agent Orchestration (Manual)**
- Usuário seleciona agent por skill/workspace
- Suporte nativo a Copilot, Claude, outros
- Configuração flexível de agents
- Roteamento manual (não automático)

**Skill Testing Framework (Sintaxe)**
- Validação de formato e estrutura
- Verificação de schema (Zod)
- Erros claros antes de aplicar skill
- Sandbox mínimo (sem execução)

**Template Library**
- Biblioteca embutida de templates
- Atualizável via updates da extensão
- Templates para casos de uso comuns
- Exemplos de boas práticas

### Fase 5 - Inteligência e Automação 🧠

**AI-Powered Conflict Resolution**
- Merge suggestions baseadas em IA
- Detecção semântica de conflitos
- Auto-resolve para conflitos simples
- Intervenção humana para complexos

**Skill Composition**
- Composição avançada de skills
- Blocos modulares
- Reuso de padrões
- *Detalhes a definir*

---

## Features Excluídas (Por Enquanto)

### Skill Marketplace
- **Motivo**: Complexidade alta, foco em uso individual
- **Pode voltar**: Se houver demanda por compartilhamento

### Analytics Dashboard
- **Motivo**: Privacidade, complexidade, baixo valor inicial
- **Pode voltar**: Se usuários pedirem insights de uso

### Portable Skill Packages
- **Motivo**: Git sync já resolve compartilhamento
- **Pode voltar**: Se houver demanda por offline/backup

### Skill Composer Visual
- **Motivo**: Complexidade de UI, editor de texto é suficiente
- **Pode voltar**: Como feature premium/futura

---

## Critérios de Sucesso

### Fase 2 (Sincronização)
- [ ] Sync entre 2+ workspaces funcionando
- [ ] Detecção correta de conflitos
- [ ] Resolução automática de conflitos simples
- [ ] Git commits automáticos
- [ ] Auto-sync configurável

### Fase 3 (Templates)
- [ ] 10+ templates embutidos
- [ ] Picker de templates na UI
- [ ] Aplicação de templates em 1 clique
- [ ] Templates atualizáveis

### Fase 4 (Multi-Agent + Testing)
- [ ] Suporte a 2+ agents simultâneos
- [ ] Seleção manual de agent
- [ ] Validação de sintaxe de skills
- [ ] Erros claros antes de aplicar
- [ ] Testes unitários (80%+ cobertura)

---

## Próximos Passos

1. **Implementar Fase 2** (Sincronização e Git)
2. **Definir schemas Zod** para validação
3. **Criar testes unitários** base
4. **Implementar logging estruturado**
5. **Desenvolver Templates** (Fase 3)
6. **Multi-agent support** (Fase 4)
7. **Testing framework** (Fase 4)

---

## Notas

- Decisões podem ser revisitadas conforme feedback
- Foco em entregar valor rápido
- Iteração > perfeição inicial
- Usuário no controle sempre
