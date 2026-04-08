# ADR-008: Estratégia Híbrida de Hash

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

Sync Engine precisa detectar mudanças em arquivos. Três estratégias possíveis:
- Timestamp: rápido mas impreciso
- Hash SHA-256: preciso mas lento
- Git diff: preciso mas mais lento ainda

## Alternativas Consideradas

### Opção 1: SHA-256 sempre (máxima precisão)
- Prós: 100% precisão, detecta qualquer mudança
- Contras: Lento para arquivos grandes, I/O intensivo

### Opção 2: Timestamp + tamanho (95% precisão)
- Prós: Muito rápido, baixo I/O
- Contras: False positives/negatives possíveis

### Opção 3: Híbrido (timestamp primeiro, SHA-256 se diferente)
- Prós: Rápido na maioria dos casos, preciso quando necessário
- Contras: Complexidade adicional

## Decisão

**Estratégia híbrida: timestamp primeiro, SHA-256 só se diferente.**

Algoritmo:
1. Comparar timestamp + tamanho
2. Se iguais → assumir sem mudança (skip)
3. Se diferentes → calcular SHA-256 para confirmar
4. Comparar hashes para decisão final

## Consequências

### Positivas
- Performance otimizada (fast path para maioria dos casos)
- Precisão garantida quando necessário
- Escalável para grandes volumes de arquivos

### Negativas
- Complexidade adicional na implementação
- Timestamp pode ser enganoso (touches sem mudança de conteúdo)
- Requer cache de hashes para máxima eficiência

## Implementação

- [ ] Implementar comparação por timestamp + size
- [ ] Implementar cálculo de SHA-256
- [ ] Implementar cache de hashes
- [ ] Adicionar métricas de performance
- [ ] Benchmark em cenários reais
- [ ] Documentar algoritmo e edge cases
