---
title: Custom Hooks
description: Hooks reutilizáveis para gerenciamento de estado e comunicação
---

## Status: 🔜 Não Implementados

Custom hooks para abstrair lógica de comunicação com a extension e gerenciamento de estado da webview.

## Hooks de Comunicação

### useExtensionMessage

Hook para comunicação bidirecional com a extension via message protocol.

```typescript
interface UseExtensionMessageOptions {
  // Handler para mensagens recebidas
  onMessage?: (message: ExtensionMessage) => void;
  
  // Filtro de tipos de mensagens
  messageTypes?: string[];
}

interface UseExtensionMessageReturn {
  // Enviar mensagem para extension
  sendMessage: (type: string, payload?: unknown) => void;
  
  // Estado de conexão
  connected: boolean;
}

function useExtensionMessage(
  options?: UseExtensionMessageOptions
): UseExtensionMessageReturn;
```

**Exemplo de uso**:
```tsx
function TreeView() {
  const { sendMessage } = useExtensionMessage({
    onMessage: (msg) => {
      if (msg.type === 'treeview.update') {
        setTreeData(msg.payload.items);
      }
    },
    messageTypes: ['treeview.update']
  });
  
  const handleSelect = (itemId: string) => {
    sendMessage('treeview.select', { itemId });
  };
  
  return <Tree onSelect={handleSelect} />;
}
```

### useRequest

Hook para requisições request/response com timeout e retry.

```typescript
interface UseRequestOptions<T> {
  // Timeout em ms (default: 5000)
  timeout?: number;
  
  // Número de retries (default: 0)
  retries?: number;
  
  // Callback de sucesso
  onSuccess?: (data: T) => void;
  
  // Callback de erro
  onError?: (error: Error) => void;
}

interface UseRequestReturn<T> {
  // Executar request
  execute: (type: string, payload?: unknown) => Promise<T>;
  
  // Estado do request
  loading: boolean;
  error: Error | null;
  data: T | null;
}

function useRequest<T>(
  options?: UseRequestOptions<T>
): UseRequestReturn<T>;
```

**Exemplo de uso**:
```tsx
function ConfigPanel({ skillId }: Props) {
  const { execute, loading, error, data } = useRequest<SkillConfig>({
    timeout: 3000,
    onError: (err) => toast.error(err.message)
  });
  
  useEffect(() => {
    execute('config.load', { skillId });
  }, [skillId]);
  
  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return <ConfigForm config={data} />;
}
```

## Hooks de Estado

### useTreeData

Hook para gerenciar estado do TreeView com expand/collapse e seleção.

```typescript
interface UseTreeDataOptions {
  // Dados iniciais da árvore
  initialData?: TreeItem[];
  
  // Item inicialmente selecionado
  initialSelected?: string;
  
  // Callback quando seleção muda
  onSelect?: (item: TreeItem) => void;
}

interface UseTreeDataReturn {
  // Dados da árvore
  items: TreeItem[];
  
  // Item selecionado
  selectedId: string | null;
  
  // Expandir/colapsar nó
  toggleNode: (nodeId: string) => void;
  
  // Selecionar item
  selectItem: (itemId: string) => void;
  
  // Expandir todos os nós
  expandAll: () => void;
  
  // Colapsar todos os nós
  collapseAll: () => void;
  
  // Atualizar dados
  setItems: (items: TreeItem[]) => void;
}

function useTreeData(
  options?: UseTreeDataOptions
): UseTreeDataReturn;
```

**Exemplo de uso**:
```tsx
function TreeView() {
  const { items, selectedId, toggleNode, selectItem } = useTreeData({
    onSelect: (item) => console.log('Selected:', item)
  });
  
  const { sendMessage } = useExtensionMessage({
    onMessage: (msg) => {
      if (msg.type === 'treeview.update') {
        setItems(msg.payload.items);
      }
    }
  });
  
  return (
    <Tree
      items={items}
      selectedId={selectedId}
      onToggle={toggleNode}
      onSelect={(id) => {
        selectItem(id);
        sendMessage('treeview.select', { itemId: id });
      }}
    />
  );
}
```

### useSkillConfig

Hook para gerenciar configuração de skill com validação e save.

```typescript
interface UseSkillConfigOptions {
  // ID da skill
  skillId: string;
  
  // Validação customizada
  validate?: (config: SkillConfig) => ValidationResult;
  
  // Callback após salvar
  onSave?: (config: SkillConfig) => void;
}

interface UseSkillConfigReturn {
  // Configuração atual
  config: SkillConfig | null;
  
  // Estado de loading
  loading: boolean;
  
  // Erros de validação
  errors: Record<string, string>;
  
  // Configuração foi modificada
  isDirty: boolean;
  
  // Atualizar campo
  updateField: <K extends keyof SkillConfig>(
    field: K,
    value: SkillConfig[K]
  ) => void;
  
  // Salvar mudanças
  save: () => Promise<void>;
  
  // Resetar para última versão salva
  reset: () => void;
}

function useSkillConfig(
  options: UseSkillConfigOptions
): UseSkillConfigReturn;
```

**Exemplo de uso**:
```tsx
function ConfigPanel({ skillId }: Props) {
  const {
    config,
    loading,
    errors,
    isDirty,
    updateField,
    save,
    reset
  } = useSkillConfig({
    skillId,
    validate: validateSkillConfig,
    onSave: () => toast.success('Saved!')
  });
  
  if (!config) return <EmptyState />;
  
  return (
    <Form>
      <Input
        value={config.name}
        onChange={(e) => updateField('name', e.target.value)}
        error={errors.name}
      />
      
      <ButtonGroup>
        <Button onClick={save} disabled={!isDirty || loading}>
          Save
        </Button>
        <Button onClick={reset} variant="outline" disabled={!isDirty}>
          Reset
        </Button>
      </ButtonGroup>
    </Form>
  );
}
```

### useSyncStatus

Hook para monitorar status de sincronização em tempo real (Fase 2).

```typescript
interface UseSyncStatusReturn {
  // Status atual
  status: SyncStatus;
  
  // Conflitos pendentes
  conflicts: Conflict[];
  
  // Histórico de mudanças
  changeHistory: ChangeLog[];
  
  // Iniciar sync manual
  sync: () => Promise<void>;
  
  // Resolver conflito
  resolveConflict: (
    conflictId: string,
    resolution: Resolution
  ) => Promise<void>;
  
  // Toggle auto-sync
  setAutoSync: (enabled: boolean) => void;
}

function useSyncStatus(): UseSyncStatusReturn;
```

**Exemplo de uso**:
```tsx
function SyncPanel() {
  const {
    status,
    conflicts,
    sync,
    resolveConflict
  } = useSyncStatus();
  
  return (
    <Panel>
      <SyncStatusBadge status={status} />
      <Button onClick={sync} disabled={status.state === 'syncing'}>
        Sync Now
      </Button>
      
      <ConflictList
        conflicts={conflicts}
        onResolve={resolveConflict}
      />
    </Panel>
  );
}
```

## Hooks Utilitários

### useDebounce

Hook para debounce de valores (útil em inputs de busca/validação).

```typescript
function useDebounce<T>(value: T, delay: number): T;
```

**Exemplo de uso**:
```tsx
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  useEffect(() => {
    if (debouncedQuery) {
      searchSkills(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  return <Input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### useLocalStorage

Hook para persistir estado em localStorage com sync entre tabs.

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void];
```

**Exemplo de uso**:
```tsx
function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  
  return (
    <ThemeProvider theme={theme}>
      <ThemeToggle onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
    </ThemeProvider>
  );
}
```

### usePrevious

Hook para acessar valor anterior de uma prop/state.

```typescript
function usePrevious<T>(value: T): T | undefined;
```

**Exemplo de uso**:
```tsx
function TreeView({ items }: Props) {
  const prevItems = usePrevious(items);
  
  useEffect(() => {
    if (prevItems && items.length > prevItems.length) {
      toast.info('New item added!');
    }
  }, [items, prevItems]);
  
  return <Tree items={items} />;
}
```

## Implementação

### Estrutura de Arquivos Sugerida

```
webview/src/
└── hooks/
    ├── communication/
    │   ├── useExtensionMessage.ts
    │   └── useRequest.ts
    ├── state/
    │   ├── useTreeData.ts
    │   ├── useSkillConfig.ts
    │   └── useSyncStatus.ts
    └── utils/
        ├── useDebounce.ts
        ├── useLocalStorage.ts
        └── usePrevious.ts
```

### Ordem de Implementação

1. **Fase 1 - Básico**:
   - `useExtensionMessage` (comunicação fundamental)
   - `useRequest` (requisições)
   - `useTreeData` (para TreeView)
   - `useSkillConfig` (para ConfigPanel)

2. **Fase 1 - Utilitários**:
   - `useDebounce`
   - `useLocalStorage`
   - `usePrevious`

3. **Fase 2 - Sync**:
   - `useSyncStatus`
   - Hooks adicionais conforme necessário

## Testing

Cada hook deve ter testes unitários com `@testing-library/react-hooks`:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('should debounce value changes', async () => {
    jest.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );
    
    expect(result.current).toBe('initial');
    
    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // ainda não debounced
    
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    expect(result.current).toBe('updated'); // agora atualizado
  });
});
```

## Referências

- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [@testing-library/react-hooks](https://github.com/testing-library/react-hooks-testing-library)
- Message Protocol: `docs/03-implementation/protocols/`
- Extension API: `docs/03-implementation/extension/`
