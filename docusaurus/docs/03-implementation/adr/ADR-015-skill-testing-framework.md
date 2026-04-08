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

### Regras de Linting Iniciais

Lista completa de regras de linting a serem implementadas na versão inicial:

1. **Skill name deve ser kebab-case**
   - Formato: `my-skill-name`
   - Proibido: `MySkillName`, `my_skill_name`, `mySkillName`
   - Severidade: Warning
   
2. **Description é obrigatória**
   - Todo skill deve ter description não-vazia
   - Severidade: Error

### Configurabilidade

- **Por workspace**: Regras podem ser customizadas via `.vscode/settings.json`
- **Severidade ajustável**: Cada regra pode ser `error`, `warning`, ou `off`
- **Warnings não bloqueiam sync**: Apenas logs, usuário pode prosseguir

Exemplo de configuração:

```json
{
  "skills.linting.rules": {
    "kebab-case-name": "warning",
    "required-description": "error"
  }
}

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
