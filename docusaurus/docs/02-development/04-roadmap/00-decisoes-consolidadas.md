---
title: Decisoes Consolidadas
sidebar_label: Decisoes Consolidadas
description: Fonte unica de verdade para decisoes de roadmap, escopo e contratos tecnicos
---

## Fonte de Verdade

Este documento consolida as decisoes validadas no questionario de alinhamento.

## Decisoes Aprovadas - Revisão 2026-Q2

| ID  | Decisao                                                                 | Data Aprovação |
| --- | ----------------------------------------------------------------------- | -------------- |
| Q1  | Status de implementação rastreado em docs/03-implementation            | 2026-04-08     |
| Q2  | PathResolver documentado mas implementação diferida                     | 2026-04-08     |
| Q3  | Zod instalado no shared package ✅                                       | 2026-04-08     |
| Q4  | TreeView não implementado (documentação reflete status real)            | 2026-04-08     |
| Q5  | Config workspace criado automaticamente com ação do usuário             | 2026-04-08     |
| Q6  | Benchmark de performance definido posteriormente                        | 2026-04-08     |
| Q7  | globalState usa JSON serializado                                        | 2026-04-08     |
| Q8  | Git auto-pull padrão no primeiro sync (configurável)                    | 2026-04-08     |
| Q9  | Documentação de conflitos melhorada com cenários claros                 | 2026-04-08     |
| Q10 | Delete/rename com preview configurável                                  | 2026-04-08     |
| Q11 | Rollback de operações removido da Fase 2                                | 2026-04-08     |
| Q12 | Capabilities compartilhadas em /shared/types.ts                         | 2026-04-08     |
| Q13 | "Editor Assistido" é nomenclatura consolidada (= Skill Composer)        | 2026-04-08     |
| Q14 | Template Library removida do roadmap temporariamente                    | 2026-04-08     |
| Q15 | ADRs em docs/03-implementation/adr/ ✅                                   | 2026-04-08     |

## Implicacoes Imediatas

- Roadmap e criterios de aceite devem permanecer consistentes com este documento.
- Novas decisoes arquiteturais devem gerar ADRs rastreaveis.
- Contratos de configuracao e message passing devem ser versionados via tipos compartilhados.

## Proximos Passos de Governanca

1. ✅ Criar pasta de ADRs em `docs/03-implementation/adr/`
2. Registrar ADR-001: Precedência de configuração e storage global
3. Registrar ADR-002: Protocolo de mensagens por capability
4. Registrar ADR-003: Estratégia de sincronização e resolução de conflitos
5. Registrar ADR-004: Exclusão de Template Library do escopo inicial
