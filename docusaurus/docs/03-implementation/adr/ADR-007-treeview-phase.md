# ADR-007: TreeView na Fase 1

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

TreeView para navegação hierárquica estava documentado como parte da Fase 1, mas houve confusão sobre quando implementá-lo. Fase 2 também dependeria do TreeView para mostrar status de sync.

## Alternativas Consideradas

### Opção 1: TreeView é Fase 1 (implementar agora antes do Sync)
- Prós: UI completa antes do Sync, testável isoladamente
- Contras: Mais trabalho na Fase 1

### Opção 2: TreeView é Fase 2 (implementar junto com Sync Engine)
- Prós: Just-in-time com features de sync
- Contras: Atrasa UI básica, usuário sem navegação

## Decisão

**TreeView é Fase 1 (implementar agora antes do Sync).**

TreeView fornece:
- Navegação hierárquica por skills e agents
- Virtualização para listas grandes
- Base para indicadores de status (sync, conflicts) na Fase 2

## Consequências

### Positivas
- UI navegável disponível desde o início
- Base sólida para adicionar status de sync depois
- Permite testar interação usuário cedo

### Negativas
- Mais trabalho upfront na Fase 1
- TreeView sem funcionalidades de sync inicialmente

## Implementação

- [ ] Implementar TreeView component em webview
- [ ] Integrar com VS Code Tree Data Provider
- [ ] Adicionar virtualização para performance
- [ ] Implementar navegação hierárquica
- [ ] Atualizar critérios de aceite da Fase 1
- [ ] Preparar slots para status indicators (Fase 2)

## Status Indicators (Fase 2+)

Embora implementado na Fase 1, o TreeView deve incluir slots para status indicators que serão populados nas fases futuras:

### Custom Badges e Categorias

**Visualização**: Ícones ao lado do nome do arquivo
**Tipos de badges suportados**:
- Categoria/Tag do skill (ex: "ai", "web", "database")
- Status de sincronização (Fase 2)
- Conflitos pendentes (Fase 2)
- Validação/Linting (Fase 4)

**Implementação**:
```typescript
interface TreeItemBadge {
  type: 'category' | 'sync' | 'conflict' | 'validation';
  icon: string;  // VS Code icon name ou emoji
  tooltip: string;
  color?: string;
}

interface SkillTreeItem extends vscode.TreeItem {
  badges: TreeItemBadge[];
}
```

### Atualização Automática

**TREE_REFRESH** é enviado automaticamente:
- Via file watcher quando qualquer arquivo muda
- Com debounce de 500ms (configurável)
- Para toda mudança, não apenas `.agents/`

**Mensagem de protocolo**: Usar `TREE_REFRESH` existente (não requer novo tipo)
