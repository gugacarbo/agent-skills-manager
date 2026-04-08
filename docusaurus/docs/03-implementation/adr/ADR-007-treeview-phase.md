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
