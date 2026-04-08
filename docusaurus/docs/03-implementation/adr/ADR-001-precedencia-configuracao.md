# ADR-001: Precedência de Configuração

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

O sistema precisa lidar com configurações de múltiplas fontes:
1. `.vscode/agent-skills-manager.json` (workspace)
2. VS Code Settings (`agent-skills-manager.*`)
3. `globalState` da extensão
4. Defaults do `ConfigSchema`

Quando há conflito entre workspace file e VS Code Settings, precisamos definir qual prevalece.

## Alternativas Consideradas

### Opção 1: Workspace file sempre sobrescreve VS Code Settings
- Prós: Simples, previsível, permite configuração por projeto
- Contras: Usuário pode não entender por que Settings não funcionam

### Opção 2: Fazer merge inteligente dos dois
- Prós: Flexível, combina melhor dos dois mundos
- Contras: Complexo, difícil de debugar, comportamento não-óbvio

### Opção 3: Permitir usuário escolher estratégia
- Prós: Máxima flexibilidade
- Contras: Mais configuração, complexidade desnecessária

## Decisão

**Workspace file (`.vscode/agent-skills-manager.json`) sempre sobrescreve VS Code Settings.**

Ordem de precedência (maior para menor):
1. `.vscode/agent-skills-manager.json` (workspace)
2. Settings do VS Code (`agent-skills-manager.*`)
3. `globalState` da extensão
4. Defaults do `ConfigSchema`

## Consequências

### Positivas
- Comportamento previsível e fácil de entender
- Permite configuração específica por projeto
- Implementação simples

### Negativas
- VS Code Settings podem ser ignoradas silenciosamente
- Necessário documentar claramente a precedência

## Implementação

- [x] Documentar ordem de precedência
- [ ] Implementar resolução de config com precedência correta
- [ ] Adicionar logs quando workspace file sobrescreve Settings
- [ ] Atualizar documentação do usuário
