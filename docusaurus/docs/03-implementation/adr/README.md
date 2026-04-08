---
title: Architecture Decision Records
sidebar_label: ADRs
description: Registro de decisões arquiteturais importantes do projeto
---

# Architecture Decision Records (ADRs)

Este diretório contém os registros de decisões arquiteturais (ADRs) do Agent Skills Manager.

## O que é um ADR?

Um ADR documenta uma decisão arquitetural importante, incluindo:
- Contexto da decisão
- Alternativas consideradas
- Decisão tomada
- Consequências (positivas e negativas)

## Lista de ADRs

| ID | Título | Status | Data |
|----|--------|--------|------|
| [ADR-001](./ADR-001-precedencia-configuracao.md) | Precedência de Configuração | Aprovado | 2026-04-08 |
| [ADR-002](./ADR-002-message-passing-protocol.md) | Protocolo de Message Passing | Aprovado | 2026-04-08 |
| [ADR-003](./ADR-003-sync-strategy.md) | Estratégia de Sincronização | Aprovado | 2026-04-08 |
| [ADR-004](./ADR-004-template-library-removal.md) | Remoção de Template Library | Aprovado | 2026-04-08 |
| [ADR-005](./ADR-005-path-resolver-timing.md) | Timing de Implementação do PathResolver | Aprovado | 2026-04-08 |
| [ADR-006](./ADR-006-auto-sync-default.md) | AutoSync Habilitado por Padrão | Aprovado | 2026-04-08 |
| [ADR-007](./ADR-007-treeview-phase.md) | TreeView na Fase 1 | Aprovado | 2026-04-08 |
| [ADR-008](./ADR-008-hash-strategy.md) | Estratégia Híbrida de Hash | Aprovado | 2026-04-08 |
| [ADR-009](./ADR-009-git-pull-policy.md) | Política de Git Pull Manual | Aprovado | 2026-04-08 |
| [ADR-010](./ADR-010-retry-policy.md) | Política de Retry com Backoff | Aprovado | 2026-04-08 |
| [ADR-011](./ADR-011-delete-rename-policy.md) | Política de Delete/Rename | Aprovado | 2026-04-08 |
| [ADR-012](./ADR-012-rollback-removal.md) | Remoção de Rollback da Fase 2 | Aprovado | 2026-04-08 |
| [ADR-013](./ADR-013-editor-assistido-ui.md) | Interface do Editor Assistido | Aprovado | 2026-04-08 |
| [ADR-014](./ADR-014-multi-agent-config.md) | Configuração Multi-Agent | Aprovado | 2026-04-08 |
| [ADR-015](./ADR-015-skill-testing-framework.md) | Framework de Testing de Skills | Aprovado | 2026-04-08 |

## Template ADR

```markdown
# ADR-XXX: [Título]

**Status**: [Proposto | Aprovado | Rejeitado | Obsoleto]  
**Data**: YYYY-MM-DD  
**Decisor(es)**: [Nome/Time]

## Contexto

[Descreva o contexto e o problema que levou a esta decisão]

## Alternativas Consideradas

### Opção 1: [Nome]
- Prós: ...
- Contras: ...

### Opção 2: [Nome]
- Prós: ...
- Contras: ...

## Decisão

[A decisão tomada e justificativa]

## Consequências

### Positivas
- ...

### Negativas
- ...

## Implementação

- [ ] Tarefa 1
- [ ] Tarefa 2
```
