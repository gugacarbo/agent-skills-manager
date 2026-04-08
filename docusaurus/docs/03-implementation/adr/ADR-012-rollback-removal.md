# ADR-012: Remoção de Rollback da Fase 2

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

Roadmap original incluía "Rollback de operações" no histórico de operações da Fase 2. Feature complexa sem validação de necessidade.

## Alternativas Consideradas

### Opção 1: Implementar apenas log/audit trail
- Prós: Rastreabilidade sem complexidade
- Contras: Sem undo

### Opção 2: Implementar rollback manual (última operação)
- Prós: Algum undo, escopo limitado
- Contras: Complexidade, edge cases difíceis

### Opção 3: Implementar rollback completo com histórico
- Prós: Undo completo de N operações
- Contras: Muito complexo, difícil garantir consistência

### Opção 4: Depender de Git history
- Prós: Simples, Git já faz isso
- Contras: Requer conhecimento de Git

## Decisão

**Remover rollback das docs, implementar apenas log/audit trail.**

Git history fornece rollback suficiente:
- Cada sync faz auto-commit
- Usuário pode fazer `git revert` ou `git reset`
- Histórico completo preservado

Histórico de operações registra:
- Timestamp
- Operação (sync, delete, rename)
- Arquivos afetados
- Status (success, error, conflict)

## Consequências

### Positivas
- Escopo reduzido da Fase 2
- Menos complexidade de implementação
- Git fornece rollback robusto
- Foco em features core

### Negativas
- Sem undo nativo na UI
- Usuário precisa conhecimento de Git para rollback
- Menos "feature-rich"

## Implementação

- [x] Remover rollback da documentação de Fase 2
- [ ] Implementar log estruturado de operações
- [ ] Implementar audit trail com timestamps
- [ ] Documentar como usar Git para rollback
- [ ] Adicionar logs detalhados em cada operação
