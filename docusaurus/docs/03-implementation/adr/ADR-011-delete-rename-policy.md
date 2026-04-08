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

**Sempre perguntar, sem opção de auto-aprovação.**

Comportamento para delete/rename:
1. Detectar operação destrutiva
2. Mostrar preview detalhado
3. Perguntar confirmação ao usuário
4. Executar apenas após confirmação explícita

Sem opção `autoApproveDeletes` (removida do escopo).

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

- [ ] Implementar detecção de delete/rename
- [ ] Criar UI de preview com detalhes
- [ ] Implementar confirmação explícita
- [ ] Remover `autoApproveDeletes` da documentação
- [ ] Adicionar logs de operações destrutivas
- [ ] Documentar comportamento claramente
