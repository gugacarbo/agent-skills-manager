# ADR-015: Framework de Testing de Skills

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

Fase 4 inclui "Skill Testing Framework" para validar skills antes de aplicar. Documentação menciona "validação de sintaxe" e "sandbox mínimo".

## Alternativas Consideradas

### Opção 1: Schema validation apenas (Zod)
- Prós: Simples, rápido, type-safe
- Contras: Não detecta erros lógicos

### Opção 2: Schema + Linting de regras customizáveis
- Prós: Detecta problemas comuns, extensível
- Contras: Mais complexo, requer regras bem definidas

### Opção 3: Schema + Sandbox execution com timeout
- Prós: Detecta erros de runtime
- Contras: Complexo, perigoso, pode travar

### Opção 4: Validação manual pelo usuário
- Prós: Simples
- Contras: Sem valor agregado

## Decisão

**Schema validation (Zod) + Linting de regras customizáveis.**

Camadas de validação:
1. **Schema Zod**: Estrutura básica (campos obrigatórios, tipos)
2. **Linting**: Regras customizáveis (naming conventions, patterns)
3. **Syntax Check**: Validação de markdown/código embutido

Sem sandbox execution (muito complexo, risco de segurança).

Regras de linting exemplo:
- Skill name deve ser kebab-case
- Description é obrigatória
- Triggers devem ser únicos
- Sem código executável em descriptions

## Consequências

### Positivas
- Detecta maioria dos problemas antes de aplicar
- Extensível com novas regras
- Seguro (sem execução de código)
- Feedback claro e útil

### Negativas
- Não detecta erros lógicos ou de runtime
- Requer manutenção de regras
- Pode ter falsos positivos

## Implementação

- [ ] Implementar schema Zod para skills
- [ ] Criar engine de linting customizável
- [ ] Definir regras de linting iniciais
- [ ] Implementar syntax checking para markdown
- [ ] Adicionar UI para exibir erros
- [ ] Permitir desabilitar regras específicas
- [ ] Documentar regras e como customizar
- [ ] Testes para cada regra
