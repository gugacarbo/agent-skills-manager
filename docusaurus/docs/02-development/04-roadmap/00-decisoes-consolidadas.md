---
title: Decisoes Consolidadas
sidebar_label: Decisoes Consolidadas
description: Fonte unica de verdade para decisoes de roadmap, escopo e contratos tecnicos
---

## Fonte de Verdade

Este documento consolida as decisoes validadas no questionario de alinhamento.

## Decisoes Aprovadas - Revisão 2026-Q2

| ID  | Decisao                                                                  | Data Aprovação | ADR     |
| --- | ------------------------------------------------------------------------ | -------------- | ------- |
| Q1  | Workspace file sempre sobrescreve VS Code Settings                       | 2026-04-08     | ADR-001 |
| Q2  | PathResolver implementado na Fase 1 (pré-requisito para Fase 2)         | 2026-04-08     | ADR-005 |
| Q3  | AutoSync habilitado por padrão (autoSync: true)                          | 2026-04-08     | ADR-006 |
| Q4  | TreeView implementado na Fase 1                                          | 2026-04-08     | ADR-007 |
| Q5  | Estratégia híbrida de hash (timestamp + SHA-256)                         | 2026-04-08     | ADR-008 |
| Q6  | Git pull manual (nunca auto-pull)                                        | 2026-04-08     | ADR-009 |
| Q7  | Retry 3x com backoff exponencial (2s, 4s, 8s)                            | 2026-04-08     | ADR-010 |
| Q8  | Delete/rename sempre perguntar (sem auto-aprovação)                      | 2026-04-08     | ADR-011 |
| Q9  | Rollback removido da Fase 2 (usar Git history)                           | 2026-04-08     | ADR-012 |
| Q10 | Message passing via união discriminada em shared/types.ts                | 2026-04-08     | ADR-002 |
| Q11 | Auto-merge conservador com fallback manual                               | 2026-04-08     | ADR-003 |
| Q12 | Editor Assistido: split (formulário + preview)                           | 2026-04-08     | ADR-013 |
| Q13 | Multi-agent config via .vscode/agents.json                               | 2026-04-08     | ADR-014 |
| Q14 | Skill testing: Schema + Linting customizável                             | 2026-04-08     | ADR-015 |
| Q15 | Template Library removida do roadmap                                     | 2026-04-08     | ADR-004 |

## Implicacoes Imediatas

- Roadmap e criterios de aceite devem permanecer consistentes com este documento.
- Novas decisoes arquiteturais devem gerar ADRs rastreaveis.
- Contratos de configuracao e message passing devem ser versionados via tipos compartilhados.

## Proximos Passos de Governanca

1. ✅ Criar pasta de ADRs em `docs/03-implementation/adr/`
2. ✅ Registrar ADR-001: Precedência de configuração e storage global
3. ✅ Registrar ADR-002: Protocolo de mensagens por capability
4. ✅ Registrar ADR-003: Estratégia de sincronização e resolução de conflitos
5. ✅ Registrar ADR-004: Exclusão de Template Library do escopo inicial
6. ✅ Registrar ADR-005: Timing de implementação do PathResolver
7. ✅ Registrar ADR-006: AutoSync habilitado por padrão
8. ✅ Registrar ADR-007: TreeView na Fase 1
9. ✅ Registrar ADR-008: Estratégia híbrida de hash
10. ✅ Registrar ADR-009: Política de Git Pull manual
11. ✅ Registrar ADR-010: Política de Retry com backoff
12. ✅ Registrar ADR-011: Política de Delete/Rename
13. ✅ Registrar ADR-012: Remoção de Rollback
14. ✅ Registrar ADR-013: Interface do Editor Assistido
15. ✅ Registrar ADR-014: Configuração Multi-Agent
16. ✅ Registrar ADR-015: Framework de Testing de Skills
