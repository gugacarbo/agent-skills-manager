---
title: Commands
description: Comandos registrados na extensão VS Code
---

## Comandos Registrados

Esta seção documenta todos os comandos que devem ser implementados e registrados na extensão. Todos os comandos estarão disponíveis no Command Palette do VS Code.

### skills.sync

**ID**: `agent-skills.sync`  
**Título**: "Agent Skills: Sync"  
**Keyboard Shortcut**: Nenhum padrão (usuário pode configurar)

**Descrição**: Executa sincronização manual de skills entre Git e destinos.

**Uso**: Command Palette → "Agent Skills: Sync"

**Comportamento**:
- Dispara sincronização manual forçada
- Mostra progresso da operação
- Exibe notificação com resultado (sucesso/falha)
- Ver [Sync Engine](./04-sync-engine.md) para detalhes

---

### skills.openConfig

**ID**: `agent-skills.openConfig`  
**Título**: "Agent Skills: Open Configuration"  
**Keyboard Shortcut**: Nenhum padrão

**Descrição**: Abre o painel de configuração de skills na webview.

**Uso**: Command Palette → "Agent Skills: Open Configuration"

**Comportamento**:
- Abre webview com Config Panel
- Permite editar `.vscode/agent-skills.json`
- Ver [Config Panel](../webview/03-config-panel.md)

---

### skills.resolveConflicts

**ID**: `agent-skills.resolveConflicts`  
**Título**: "Agent Skills: Resolve Conflicts"  
**Keyboard Shortcut**: Nenhum padrão

**Descrição**: Abre interface para resolver conflitos de merge pendentes.

**Uso**: Command Palette → "Agent Skills: Resolve Conflicts"

**Comportamento**:
- Abre webview com lista de conflitos pendentes
- Permite escolher resolução (keep local, keep remote, merge manual)
- Ver [ADR-003: Sync Strategy](../adr/ADR-003-sync-strategy.md)

---

### skills.gitPull

**ID**: `agent-skills.gitPull`  
**Título**: "Agent Skills: Git Pull"  
**Keyboard Shortcut**: Nenhum padrão

**Descrição**: Executa git pull manual no repositório de skills.

**Uso**: Command Palette → "Agent Skills: Git Pull"

**Comportamento**:
- Faz pull do repositório remoto de skills
- Sincroniza branch atual com origin
- Mostra progresso e resultado da operação
- **Nota**: Git pull é **sempre manual** conforme [ADR-009: Git Pull Policy](../adr/ADR-009-git-pull-policy.md)

---

### skills.clearCache

**ID**: `agent-skills.clearCache`  
**Título**: "Agent Skills: Clear Hash Cache"  
**Keyboard Shortcut**: Nenhum padrão

**Descrição**: Limpa o cache de hashes de arquivos, forçando recálculo completo.

**Uso**: Command Palette → "Agent Skills: Clear Hash Cache"

**Comportamento**:
- Remove cache armazenado em `ExtensionContext.globalStorageUri`
- Força recálculo de todos os hashes no próximo sync
- Útil para troubleshooting e após corrupção de cache
- Ver [ADR-008: Hash Strategy](../adr/ADR-008-hash-strategy.md)

## Visibilidade no Command Palette

**Todos os comandos** listados acima estarão visíveis no Command Palette do VS Code quando a extensão estiver ativa. Usuários podem:
- Executar via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Atribuir keyboard shortcuts customizados via Keyboard Shortcuts editor
- Executar via menus contextuais (se implementados)

## Keyboard Shortcuts

**Nenhum comando possui keyboard shortcut padrão.** Isso permite que usuários definam seus próprios atalhos sem conflitos. Usuários podem configurar atalhos via:

1. Command Palette → "Preferences: Open Keyboard Shortcuts"
2. Buscar pelo comando (ex: "Agent Skills: Sync")
3. Atribuir atalho desejado

## Estado Atual

⚠️ **PLANEJADO** - Nenhum comando está implementado ainda.

Atualmente, a função `activate()` não contém registros de comandos via `vscode.commands.registerCommand()`. Implementação prevista para Fase 2.

## Referências

- Arquivos: `extension/src/extension.ts`
- Links: [VS Code API - Commands](https://code.visualstudio.com/api/references/vscode-api#commands)
