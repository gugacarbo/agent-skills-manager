# ADR-010: Política de Retry com Backoff

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

Git operations podem falhar por erros de rede ou conflitos temporários. Precisamos definir política de retry.

## Alternativas Consideradas

### Opção 1: Retry 3x com backoff exponencial (2s, 4s, 8s)
- Prós: Balanceado, eficiente, padrão da indústria
- Contras: Pode demorar até 14s no pior caso

### Opção 2: Retry 5x com backoff linear (1s, 2s, 3s, 4s, 5s)
- Prós: Mais tentativas
- Contras: Demora mais, menos eficiente para problemas persistentes

### Opção 3: Retry infinito até sucesso
- Prós: Eventualmente funciona
- Contras: Pode travar indefinidamente, má UX

### Opção 4: Sem retry (apenas notificação)
- Prós: Simples, imediato
- Contras: Usuário precisa repetir manualmente para erros temporários

## Decisão

**Retry 3x com backoff exponencial (2s, 4s, 8s).**

Algoritmo:
1. Tentativa inicial
2. Falha → wait 2s → retry
3. Falha → wait 4s → retry
4. Falha → wait 8s → retry
5. Falha → notificar usuário

Total: ~14 segundos no pior caso, 3 retries

Aplicado a:
- Git push
- Git operations de rede
- Network errors

**Não** aplicado a:
- Merge conflicts (requer intervenção)
- Invalid credentials (erro permanente)
- Permission errors (erro permanente)

## Consequências

### Positivas
- Resiliente a falhas temporárias de rede
- Padrão da indústria (familiar)
- Balanceado entre rapidez e robustez

### Negativas
- Pode demorar ~14s no pior caso
- Usuário espera sem feedback (requer progress indicator)

## Implementação

- [ ] Implementar função de retry com backoff exponencial
- [ ] Classificar erros em temporários vs permanentes
- [ ] Adicionar progress indicator durante retries
- [ ] Adicionar logs de cada tentativa
- [ ] Permitir cancelamento pelo usuário
- [ ] Documentar comportamento
