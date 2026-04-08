# ADR-011: Política de Delete/Rename

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

Sync Engine precisa sincronizar deleções e renomeações de skills. Operações destrutivas requerem cuidado especial.

## Alternativas Consideradas

### Opção 1: Preview habilitado por padrão
- Prós: Seguro, usuário vê o que vai acontecer
- Contras: Friction adicional

### Opção 2: Auto-aprovação habilitada por padrão
- Prós: Menos friction, mais fluido
- Contras: Risco de deleções acidentais

### Opção 3: Sempre perguntar, sem opção de auto-aprovação
- Prós: Máxima segurança, sem perda de dados acidental
- Contras: Friction, pode ser repetitivo

## Decisão

**Sempre perguntar como comportamento padrão, com opção configurável de auto-aprovação.**

### Comportamento Padrão (`autoApproveDeletes: false`)

1. Detectar operação destrutiva
2. Mostrar preview detalhado
3. Perguntar confirmação ao usuário
4. Executar apenas após confirmação explícita

### Comportamento com Auto-Aprovação (`autoApproveDeletes: true`)

Quando `autoApproveDeletes=true` está configurado ([ADR-003](./ADR-003-sync-strategy.md)):
- Operações destrutivas (delete/rename) são executadas automaticamente
- Preview ainda é mostrado nos logs
- Nenhuma confirmação manual é necessária
- Útil para workflows automatizados

**Recomendação**: Manter `autoApproveDeletes=false` (padrão) para máxima segurança.

## Consequências

### Positivas
- Máxima segurança contra perda de dados
- Comportamento previsível
- Usuário sempre consciente de operações destrutivas

### Negativas
- Friction adicional em cada delete/rename
- Pode ser repetitivo em operações em lote
- Menos conveniente que auto-aprovação

## Implementação

### Preview de Batch Operations

Para operações em lote (múltiplos deletes/renames), a UX deve ser:

**Preview Consolidado**:
- Mostrar apenas contagem total: "50 files will be deleted"
- Não mostrar lista completa de arquivos (evita UI poluída)
- Opcionalmente: Top 5 arquivos + contagem restante

**Confirmação Única**:
- Usuário confirma toda a operação batch com 1 clique
- Não confirmar item por item (evita fadiga de cliques)
- Checkbox "Don't ask again for this batch" disponível

**Exemplo de UI**:
```
┌─────────────────────────────────────────┐
│ Batch Delete Operation                  │
├─────────────────────────────────────────┤
│ 50 files will be deleted                │
│                                          │
│ ☐ Don't ask again for this batch        │
│                                          │
│ [Cancel]  [Confirm Delete]               │
└─────────────────────────────────────────┘
```

**Comportamento de "Don't ask again"**:
- Aplica apenas para operações restantes do batch atual
- Não persiste para futuras sessões
- Usuário ainda vê summary no log

- [ ] Implementar detecção de delete/rename
- [ ] Criar UI de preview com detalhes
- [ ] Implementar preview consolidado para batch operations
- [ ] Implementar checkbox "Don't ask again for this batch"
- [ ] Implementar confirmação explícita
- [ ] Implementar suporte a `autoApproveDeletes` configurável
- [ ] Adicionar logs de operações destrutivas
- [ ] Documentar comportamento claramente

## Referências Cruzadas

- [ADR-003: Sync Strategy](./ADR-003-sync-strategy.md) - Define a configuração `autoApproveDeletes`
