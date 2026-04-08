---
title: Decisões de Features
sidebar_label: Decisões de Features
description: Features priorizadas, critérios de sucesso e roadmap de funcionalidades
---

# Decisões de Features

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
- Drag-and-drop visual composer
- Portable packages
- Template Library (removida temporariamente)

## Features por Fase

| Feature          | Fase | Prioridade | Status Implementação        |
| ---------------- | ---- | ---------- | --------------------------- |
| Core Extension   | 1    | Alta       | 📋 Estrutura criada         |
| Core Webview     | 1    | Alta       | 📋 Estrutura criada         |
| Path Resolver    | 1    | Alta       | 📝 Documentado              |
| Config System    | 1    | Alta       | 📝 Schema definido          |
| Sync Engine      | 2    | Média      | 📋 Planejado                |
| Git Integration  | 2    | Média      | 📋 Planejado                |
| Editor Assistido | 3    | Baixa      | 📋 Planejado (MVP simples)  |
| Multi-Agent      | 4    | Baixa      | 📋 Planejado                |

> 📝 **Nota**: Status detalhado de implementação rastreado em `docs/03-implementation/`
> 🚫 **Template Library** foi removida do roadmap temporariamente


## Features Priorizadas

### Fase 3 - UI/UX Avançada

#### Editor Assistido de Skills

- Editor assistido baseado em formulário e texto
- Sem drag-and-drop nesta fase
- Validação de estrutura em tempo real
- Foco em clareza e velocidade de edição

> 📝 **Nomenclatura Consolidada**: "Editor Assistido" é o termo oficial (anteriormente chamado de "Skill Composer MVP")

### Fase 4 - Recursos Avançados

#### Multi-Agent Orchestration (Manual)

- Usuário seleciona agent por skill/workspace
- Suporte nativo a Copilot, Claude, outros
- Configuração flexível de agents
- Roteamento manual (não automático)

#### Skill Testing Framework (Sintaxe)

- Validação de formato e estrutura
- Verificação de schema (Zod)
- Erros claros antes de aplicar skill
- Sandbox mínimo (sem execução)

~~#### Template Library~~ (Removida temporariamente)

> 🚫 **Feature removida do roadmap atual**. Pode ser reconsiderada em iterações futuras.

## Critérios de Sucesso

### Fase 2 (Sincronização)

- [ ] Sync entre 2+ workspaces funcionando
- [ ] Detecção correta de conflitos
- [ ] Resolução automática de conflitos simples
- [ ] Git commits automáticos
- [ ] Auto-sync configurável

### Fase 3 (Templates)

- [ ] Editor assistido funcional
- [ ] Validação inline de estrutura
- [ ] Fluxo de criação em poucos passos
- [ ] Sem regressão no fluxo atual de edição

> 📝 **Atualização**: Template Library removida desta fase

### Fase 4 (Multi-Agent + Testing)

- [ ] Suporte a 2+ agents simultâneos
- [ ] Seleção manual de agent
- [ ] Validação de sintaxe de skills
- [ ] Erros claros antes de aplicar
- [ ] Testes unitários (80%+ cobertura)

## Próximos Passos

1. **Implementar Fase 2** (Sincronização e Git)
2. **Definir schemas Zod** para validação em `shared/src/types.ts`
3. **Criar testes unitários** base (cobertura 80%+)
4. **Implementar logging estruturado**
5. **Desenvolver Editor Assistido** (Fase 3)
6. **Multi-agent support** (Fase 4)
7. **Testing framework** (Fase 4)

## Notas

- Decisões podem ser revisitadas conforme feedback
- Foco em entregar valor rápido
- Iteração > perfeição inicial
- Usuário no controle sempre
- Governança de decisão via ADRs formais em `docs/03-implementation/adr/`
