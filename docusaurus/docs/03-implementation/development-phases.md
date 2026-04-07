---
title: Development Roadmap
---

## Estado atual

- Monorepo configurado com 4 workspaces (docs, extension, webview, shared).
- Infraestrutura de build funcional (Turborepo + esbuild + Vite).
- Documentação técnica completa (Docusaurus).
- Extension scaffold com comando hello world.
- Webview scaffold com React 19, Tailwind 4 e shadcn/ui.
- Shared workspace com tipos placeholder.

## Plano de implementação mínimo

## Fase 0 — Fundação ✅

- [x] Monorepo com Turborepo + pnpm workspaces
- [x] Biome para lint/format
- [x] Site de documentação (Docusaurus 3.9)
- [x] Extension scaffold (esbuild, VS Code ≥1.84)
- [x] Webview scaffold (React 19, Vite 8, Tailwind 4, shadcn/ui)
- [x] Shared workspace para tipos compartilhados

## Fase 1 — Core

- [ ] Tipos compartilhados em `shared/src/index.ts` (SkillDescriptor, RuleDescriptor, etc.)
- [ ] ConfigService — leitura de `agentSkillsManager.*`
- [ ] SkillRegistry — descoberta de skills e rules
- [ ] Modelos de dados básicos

## Fase 2 — Validação e Sync

- [ ] ValidationEngine — validação de frontmatter e estrutura
- [ ] DestinationManager — resolução de destinos e paths
- [ ] SyncEngine — sync manual e dry-run

## Fase 3 — UI e Comandos

- [ ] SkillTreeDataProvider — TreeView com estado de ativo/inativo
- [ ] Comandos para refresh, validate e sync
- [ ] Webview com painel de gerenciamento
- [ ] Mensagens de erro e status

## Fase 4 — Automação

- [ ] Sync on save
- [ ] SkillWatcher — watch de mudanças na origem
- [ ] Tratamento de conflito (`ask`, `overwrite`, `skip`)
- [ ] Auto-sync ao ativar/desativar

## Definição de pronto

- Build da extensão sem erros (`pnpm build`)
- Testes unitários da camada core/sync
- Testes manuais de comando e TreeView
- Documentação de configuração atualizada
- Typecheck passando em todos os workspaces (`pnpm typecheck`)
