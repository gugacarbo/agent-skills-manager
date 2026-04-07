---
title: Arquitetura do Sistema
---

## Visão geral

A extensão é composta por camadas de configuração, indexação, validação, sincronização e UI.

## Estado atual

O projeto está em **fase de scaffold**: o monorepo e os 4 workspaces estão configurados, mas os componentes internos ainda não foram implementados. O que existe hoje:

| Workspace    | Estado                                                                         |
| ------------ | ------------------------------------------------------------------------------ |
| `docusaurus` | Documentação completa e funcional (Docusaurus 3.9)                             |
| `extension`  | Scaffold com entry point `extension.ts` e comando hello world (esbuild)        |
| `webview`    | App React 19 + Vite 8 + Tailwind 4 + shadcn/ui (componente `button` instalado) |
| `shared`     | Tipos placeholder (pronto para expansão)                                       |

## Fluxo de execução (planejado)

1. Ativação da extensão → carga de configuração (`agentSkillsManager.*`).
2. Indexação da origem (`skills/` e `rules/`).
3. Validação do conteúdo indexado.
4. Render do TreeView e habilitação dos comandos.
5. Sync manual ou automática conforme configuração.
6. Watch de mudanças (quando `watchSourceChanges` está habilitado).
7. Persistência de estado no local storage da extensão (`globalState`).

## Decisões de projeto

- Separar registry, validação e sync evita acoplamento alto.
- Sincronização usa metadados de arquivo gerenciado para segurança.
- Destinos são extensíveis via tipo `custom` e templates de path.
- `SkillWatcher` opera de forma independente para não bloquear a thread principal.
- Webview usa React 19 + shadcn/ui para UI moderna e consistente.
- Shared workspace garante contratos tipados entre extensão e webview.

## Comunicação extensão ↔ webview

A extensão se comunica com a webview via `vscode.postMessage` / `window.addEventListener('message')`. Os tipos das mensagens devem ser definidos em `shared/src/index.ts`.

## Persistência

- **Configuração VS Code**: namespace `agentSkillsManager.*` — veja [Configuration Reference](../api/configuration).
- **Estado da extensão**: `globalState` (local storage do VS Code) — armazena skills e rules ativos.

Veja também:

- [Sync Destinations](../api/sync-destinations) para os tipos de destino disponíveis.
- [Development Roadmap](../implementation/development-phases) para o plano de implementação.
