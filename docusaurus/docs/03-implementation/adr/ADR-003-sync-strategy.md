# ADR-003: Estratégia de Sincronização

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

Sync Engine precisa detectar mudanças, resolver conflitos e sincronizar arquivos entre workspaces. Três tipos de conflito possíveis:
- `same`: Arquivos idênticos
- `different`: Alterações não-sobrepostas
- `conflict`: Alterações na mesma região

## Alternativas Consideradas

### Opção 1: Merge agressivo
- Prós: Menos intervenção manual
- Contras: Risco de perda de dados

### Opção 2: Auto-merge conservador com fallback manual
- Prós: Seguro, claro quando precisa de intervenção
- Contras: Pode requerer mais intervenção manual

### Opção 3: Sempre manual
- Prós: Máximo controle
- Contras: Friction alto, usuário cansado

## Decisão

**Auto-merge conservador com fallback manual:**
- Auto-merge apenas quando alterações não sobrepõem blocos da mesma região
- Qualquer ambiguidade vira conflito manual
- Sempre registrar decisão no histórico de operações

**Tipos de Conflito:**
- **same**: Hash SHA-256 idêntico → skip sync
- **different**: Arquivo modificado apenas em um workspace → cópia direta
- **different (merge)**: Linhas diferentes no mesmo arquivo → merge linha a linha
- **conflict**: Mesma linha modificada em ambos workspaces → prompt usuário

## Consequências

### Positivas
- Seguro: nunca perde dados sem aviso
- Claro: usuário sabe quando precisa intervir
- Rastreável: histórico de decisões

### Negativas
- Pode requerer intervenção manual frequente em cenários colaborativos
- Complexidade de implementação do merge engine

## Implementação

- [ ] Implementar comparação por hash SHA-256
- [ ] Implementar merge linha a linha
- [ ] Implementar detecção de conflitos
- [ ] Implementar UI para resolução manual
- [ ] Implementar histórico de operações
- [ ] Adicionar testes de cenários de conflito
