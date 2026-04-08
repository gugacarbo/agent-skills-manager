# ADR-006: AutoSync Habilitado por Padrão

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

File watcher pode detectar mudanças automaticamente e disparar sync. Precisamos decidir se `autoSync` deve estar habilitado por padrão.

## Alternativas Consideradas

### Opção 1: AutoSync habilitado por padrão (autoSync: true)
- Prós: Experiência mais fluida, sync automático
- Contras: Pode surpreender usuário, consome recursos

### Opção 2: AutoSync desabilitado por padrão
- Prós: Usuário tem controle explícito
- Contras: Menos conveniente, requer ação manual

### Opção 3: Prompt na primeira execução
- Prós: Usuário decide explicitamente
- Contras: Friction no onboarding

## Decisão

**AutoSync habilitado por padrão (autoSync: true).**

Schema atualizado:
```typescript
autoSync: z
  .boolean()
  .default(true)  // Mudado de false para true
  .describe('Habilita auto-sync via file watcher')
```

Debounce padrão de 500ms para evitar syncs excessivos.

## Consequências

### Positivas
- Experiência mais fluida
- Menos trabalho manual do usuário
- Sync mantém workspaces em sincronia automaticamente

### Negativas
- Consome recursos em background
- Pode ser inesperado para usuários que não leram docs
- Precisa de debounce bem ajustado

## Implementação

- [x] Atualizar default do ConfigSchema de false para true
- [ ] Implementar file watcher com debounce
- [ ] Adicionar indicador visual quando autoSync está ativo
- [ ] Permitir desabilitar facilmente via config
- [ ] Documentar comportamento claramente
