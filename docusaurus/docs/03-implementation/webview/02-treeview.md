---
title: TreeView Component
description: Navegação hierárquica de skills e agents (planejado)
---

## Status: 🔜 Não Implementado

Este componente está **planejado para a Fase 1** conforme [ADR-007](../../adr/ADR-007-treeview-phase.md), mas ainda não foi implementado.

## Objetivo

Fornecer navegação hierárquica por skills e agents com virtualização para performance em listas grandes.

## Especificação Planejada

### Props (Proposta)

```typescript
interface TreeViewProps {
  // Dados da árvore vindos da extension
  items: TreeItem[];
  
  // Callback quando item é selecionado
  onSelect?: (item: TreeItem) => void;
  
  // Callback quando item é expandido/colapsado
  onToggle?: (itemId: string, expanded: boolean) => void;
  
  // Item atualmente selecionado
  selectedId?: string;
  
  // Modo de virtualização para listas grandes
  virtualized?: boolean;
}

interface TreeItem {
  id: string;
  label: string;
  type: 'agent' | 'skill' | 'folder';
  children?: TreeItem[];
  collapsed?: boolean;
  icon?: string;
  // Slots para status indicators (Fase 2)
  syncStatus?: 'synced' | 'pending' | 'conflict';
}
```

### Comportamento Planejado

#### Navegação
- Click em item → seleciona e notifica extension via message protocol
- Click em chevron → expande/colapsa nó
- Keyboard navigation: ↑↓ para navegar, →← para expandir/colapsar
- Scroll virtualizado para centenas de items

#### Estados Visuais
- Hover: destaque sutil
- Selected: background accent, borda left accent
- Disabled: opacity reduzida
- Loading: skeleton loader enquanto carrega dados

#### Ícones (Lucide React)
- Agent: `Users` ou `Bot`
- Skill: `Puzzle` ou `Package`
- Folder: `Folder` / `FolderOpen`
- Chevron: `ChevronRight` / `ChevronDown`

### Integração com Extension

O TreeView deve se comunicar com a extension via **message protocol**:

```typescript
// Mensagem: webview → extension
{
  type: 'treeview.select',
  payload: {
    itemId: 'skill-markdown',
    itemType: 'skill'
  }
}

// Mensagem: extension → webview
{
  type: 'treeview.update',
  payload: {
    items: [...] // Árvore atualizada
  }
}
```

### Virtualização

Para listas com 100+ items, usar virtualização:
- Biblioteca sugerida: `@tanstack/react-virtual` ou `react-window`
- Render apenas items visíveis no viewport
- Buffer de ~5 items acima/abaixo do viewport

## Requisitos Técnicos

### Dependências Necessárias
```json
{
  "@tanstack/react-virtual": "^3.0.0", // ou alternativa
  "lucide-react": "^1.7.0" // já instalado
}
```

### Acessibilidade
- `role="tree"` no container
- `role="treeitem"` nos items
- `aria-expanded` em nós com children
- `aria-selected` no item selecionado
- `aria-level` para indicar nível de hierarquia
- Suporte completo a keyboard navigation

### Performance
- Memoização com `React.memo()` para tree items
- `useMemo()` para computação de árvore flat (virtualização)
- `useCallback()` para event handlers
- Debounce em operações de search/filter

## Preparação para Fase 2

O TreeView deve incluir **slots para status indicators** que serão populados na Fase 2:

```typescript
interface TreeItemWithSync extends TreeItem {
  syncStatus?: {
    state: 'synced' | 'pending' | 'conflict' | 'error';
    lastSync?: Date;
    hasLocalChanges?: boolean;
    hasRemoteChanges?: boolean;
  };
}
```

## Critérios de Aceite (ADR-007)

- [ ] Renderiza árvore hierárquica de skills/agents
- [ ] Permite expandir/colapsar nós
- [ ] Seleciona item e notifica extension
- [ ] Virtualização funciona com 500+ items sem lag
- [ ] Keyboard navigation completa
- [ ] Ícones apropriados por tipo de item
- [ ] Acessibilidade (ARIA, tab navigation)
- [ ] Slots preparados para sync status indicators

## Implementação

### Tarefas Pendentes
1. Instalar dependências de virtualização
2. Criar `TreeView.tsx` component
3. Implementar lógica de expand/collapse
4. Adicionar keyboard navigation
5. Integrar virtualização
6. Criar hooks: `useTreeData()`, `useTreeSelection()`
7. Implementar message protocol handlers
8. Adicionar testes de integração
9. Documentar API pública

## Referências

- [ADR-007: TreeView na Fase 1](../../adr/ADR-007-treeview-phase.md)
- [Message Protocol](../protocols/) (quando implementado)
- VS Code Tree View API: [docs.microsoft.com](https://code.visualstudio.com/api/extension-guides/tree-view)
