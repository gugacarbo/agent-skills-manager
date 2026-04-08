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
- Skill composer visual
- Portable packages

## Features Priorizadas

### Fase 3 - UI/UX Avançada

#### Template Library (Embutida)

- Templates pré-construídos para agents comuns
- Categorias: Copilot, Claude, genéricos
- Onboarding rápido para novos usuários
- Biblioteca oficial da extensão

#### Skill Composer (Adiado)

- **Decisão**: Não implementar inicialmente
- Foco em editor de texto simples
- Composer pode vir em fase futura

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

#### Template Library

- Biblioteca embutida de templates
- Atualizável via updates da extensão
- Templates para casos de uso comuns
- Exemplos de boas práticas

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

## Próximos Passos

1. **Implementar Fase 2** (Sincronização e Git)
2. **Definir schemas Zod** para validação
3. **Criar testes unitários** base
4. **Implementar logging estruturado**
5. **Desenvolver Templates** (Fase 3)
6. **Multi-agent support** (Fase 4)
7. **Testing framework** (Fase 4)

## Notas

- Decisões podem ser revisitadas conforme feedback
- Foco em entregar valor rápido
- Iteração > perfeição inicial
- Usuário no controle sempre

## Referências

- [Fases da Implementação](../roadmap/01-fases-implementacao.md) - Roadmap detalhado
- [Criterios de Aceite](../roadmap/02-criterios-aceite.md) - Métricas de sucesso
