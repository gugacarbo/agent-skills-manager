---
title: SyncPanel Component
description: Status de sincronização e resolução de conflitos (Fase 2)
---

## Status: 🔮 Planejado para Fase 2

Este componente está planejado para **Fase 2** e depende da implementação do Sync Engine.

## Contexto

Conforme [ADR-007](../../adr/ADR-007-treeview-phase.md), o SyncPanel será implementado **após** o TreeView na Fase 1. Ele fornecerá visualização e controle sobre operações de sincronização entre workspaces local e remoto.

## Objetivo

Fornecer interface para:
- Visualizar status de sincronização de skills
- Resolver conflitos de merge
- Monitorar operações de sync em andamento
- Exibir histórico de mudanças

## Especificação Planejada

### Props (Proposta)

```typescript
interface SyncPanelProps {
  // Status geral de sincronização
  syncStatus: SyncStatus;
  
  // Conflitos pendentes de resolução
  conflicts: Conflict[];
  
  // Callback para resolver conflito
  onResolveConflict?: (conflictId: string, resolution: Resolution) => void;
  
  // Callback para iniciar sync manual
  onSync?: () => Promise<void>;
  
  // Histórico de mudanças
  changeHistory?: ChangeLog[];
  
  // Estado de loading
  syncing?: boolean;
}

interface SyncStatus {
  state: 'idle' | 'syncing' | 'error' | 'conflict';
  lastSync?: Date;
  pendingChanges: {
    local: number;
    remote: number;
  };
  autoSyncEnabled: boolean;
}

interface Conflict {
  id: string;
  skillId: string;
  type: 'modify/modify' | 'delete/modify' | 'add/add';
  localVersion: SkillConfig;
  remoteVersion: SkillConfig;
  timestamp: Date;
}

interface Resolution {
  strategy: 'use-local' | 'use-remote' | 'merge-manual';
  mergedConfig?: SkillConfig;
}

interface ChangeLog {
  id: string;
  skillId: string;
  action: 'added' | 'modified' | 'deleted';
  source: 'local' | 'remote';
  timestamp: Date;
  author?: string;
}
```

### Layout Planejado

```
┌─────────────────────────────────────┐
│ Sync Status              [Sync Now] │
├─────────────────────────────────────┤
│ ✓ Synced | Last: 2 minutes ago      │
│ ⚠ 2 conflicts pending               │
│ 📊 3 local changes, 1 remote        │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Auto-sync: [✓] Enabled          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Conflicts                           │
│ ┌─────────────────────────────────┐ │
│ │ ⚠ ralph-prd                     │ │
│ │ Modified locally and remotely   │ │
│ │ [Use Local] [Use Remote] [Merge]│ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ⚠ ui-dev                        │ │
│ │ Deleted remotely, modified here │ │
│ │ [Keep Local] [Accept Deletion]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Recent Changes                      │
│ ├─ ralph-prd (modified) - 5m ago   │
│ ├─ ui-dev (added) - 1h ago         │
│ └─ shadcn (deleted) - 2h ago       │
└─────────────────────────────────────┘
```

## Comportamento Planejado

### Indicadores de Status

#### Visual States
- **Synced** (✓): Verde, "All changes synced"
- **Syncing** (⟳): Azul, spinner animado, "Syncing changes..."
- **Conflict** (⚠): Amarelo, "X conflicts pending"
- **Error** (✗): Vermelho, mensagem de erro específica

#### Badge Colors (Lucide Icons)
- Synced: `Check` (green)
- Pending: `Clock` (blue)
- Conflict: `AlertTriangle` (yellow)
- Error: `XCircle` (red)

### Resolução de Conflitos

#### Estratégias Automáticas
1. **Use Local**: Sobrescreve versão remota com local
2. **Use Remote**: Descarta mudanças locais, aceita remote
3. **Merge Manual**: Abre diff viewer para merge manual

#### Merge Manual UI
```typescript
<DiffViewer
  left={{ label: 'Local', content: localVersion }}
  right={{ label: 'Remote', content: remoteVersion }}
  onMerge={(merged) => resolveConflict(conflictId, merged)}
/>
```

Biblioteca sugerida: `react-diff-viewer` ou implementação custom

### Auto-sync

- Toggle para habilitar/desabilitar auto-sync
- Quando habilitado: sync automático a cada X minutos
- Notificações de sync em background
- Opção de pausar auto-sync temporariamente

### Histórico de Mudanças

- Lista cronológica reversa (mais recentes primeiro)
- Filtros: local/remote, tipo de mudança
- Click em item → expande detalhes do diff
- Limite de 50 itens, pagination ou infinite scroll

## Integração com Extension

### Message Protocol

```typescript
// webview → extension: iniciar sync
{
  type: 'sync.start',
  payload: {}
}

// extension → webview: status update
{
  type: 'sync.status',
  payload: {
    state: 'syncing',
    progress: { current: 2, total: 5 }
  }
}

// extension → webview: conflito detectado
{
  type: 'sync.conflict',
  payload: {
    conflict: { /* Conflict */ }
  }
}

// webview → extension: resolver conflito
{
  type: 'sync.resolve',
  payload: {
    conflictId: 'conflict-123',
    resolution: { strategy: 'use-local' }
  }
}

// extension → webview: sync concluído
{
  type: 'sync.complete',
  payload: {
    success: true,
    changes: { local: 3, remote: 1 }
  }
}
```

### Real-time Updates

- Extension envia updates via message protocol
- Webview reage a mudanças sem polling
- Event stream para notificações de sync

## Componentes Internos Planejados

### ConflictCard
```typescript
<ConflictCard
  conflict={conflict}
  onResolve={handleResolve}
/>
```

### DiffViewer
```typescript
<DiffViewer
  left={localVersion}
  right={remoteVersion}
  language="json"
  showLineNumbers
/>
```

### ChangeLogItem
```typescript
<ChangeLogItem
  change={change}
  onExpand={handleExpand}
  expanded={expandedId === change.id}
/>
```

## Requisitos Técnicos

### Dependências Necessárias
```json
{
  "react-diff-viewer": "^3.1.1", // ou alternativa
  "date-fns": "^3.0.0", // formatação de datas
  "lucide-react": "^1.7.0" // já instalado
}
```

### State Management
- Context API para sync state global
- `useSyncStatus()` hook para consumir status
- `useSyncActions()` hook para actions (start, resolve)

### Real-time Updates
- Event listeners para mensagens da extension
- Optimistic updates com rollback em erro
- Toast notifications para eventos importantes

## Acessibilidade

- `role="status"` em status indicators
- `aria-live="polite"` em updates de sync
- `role="alert"` em conflitos
- Keyboard navigation em lista de conflitos
- Focus management em dialogs de merge

## Critérios de Aceite (Fase 2)

- [ ] Exibe status de sincronização em tempo real
- [ ] Lista conflitos pendentes com detalhes
- [ ] Permite resolução de conflitos com 3 estratégias
- [ ] Histórico de mudanças navegável
- [ ] Toggle de auto-sync funcional
- [ ] Botão "Sync Now" para sync manual
- [ ] Notificações de sync events
- [ ] Error handling com mensagens descritivas
- [ ] Performance adequada com 100+ change logs
- [ ] Acessibilidade completa

## Dependências

Antes de implementar SyncPanel:
1. ✅ TreeView (Fase 1) - para mostrar status por skill
2. ⏳ Sync Engine (Fase 2) - backend de sincronização
3. ⏳ Message Protocol - comunicação webview ↔ extension
4. ⏳ Conflict Detection - lógica de detecção de conflitos

## Referências

- [ADR-007: TreeView na Fase 1](../../adr/ADR-007-treeview-phase.md)
- Sync Engine: `docs/03-implementation/extension/sync-engine/`
- Conflict Resolution Strategies: Git merge strategies
- [react-diff-viewer](https://github.com/praneshr/react-diff-viewer)
