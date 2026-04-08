# ADR-009: Política de Git Pull Manual

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

Git integration pode fazer auto-pull antes de sync para evitar conflitos com repositório remoto. Precisamos decidir comportamento padrão.

## Alternativas Consideradas

### Opção 1: Sempre auto-pull antes do primeiro sync
- Prós: Sincronizado com remoto automaticamente
- Contras: Pode sobrescrever work in progress

### Opção 2: Perguntar ao usuário na primeira execução
- Prós: Usuário decide explicitamente
- Contras: Friction adicional

### Opção 3: Nunca fazer auto-pull (manual)
- Prós: Usuário tem controle total, sem surpresas
- Contras: Usuário precisa lembrar de fazer pull

### Opção 4: Auto-pull sempre antes de cada sync
- Prós: Sempre atualizado
- Contras: Muito invasivo, pode causar conflitos

## Decisão

**Nunca fazer auto-pull, usuário deve fazer pull manual.**

Rationale:
- Máximo controle para o usuário
- Evita sobrescrever work in progress
- Usuário pode escolher quando fazer pull
- Extension não interfere com workflow de Git existente

Git operations suportadas:
- Auto-commit após sync: ✅ Sim
- Auto-push: 🔧 Configurável
- Auto-pull: ❌ Não

## Consequências

### Positivas
- Usuário tem controle total do Git workflow
- Sem risco de sobrescrever mudanças locais
- Comportamento previsível

### Negativas
- Usuário precisa lembrar de fazer pull manualmente
- Possível divergência com repositório remoto
- Requer disciplina do usuário

## Implementação

- [x] Remover auto-pull da documentação
- [ ] Documentar claramente que pull é manual
- [ ] Adicionar warning se repositório está desatualizado (opcional)
- [ ] Implementar apenas auto-commit
- [ ] Permitir configurar auto-push
