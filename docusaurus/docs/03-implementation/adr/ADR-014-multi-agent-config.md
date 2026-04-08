# ADR-014: Configuração Multi-Agent

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

Fase 4 adiciona suporte a múltiplos agents (Copilot, Claude, etc). Usuário precisa especificar qual agent usar para cada skill/workspace.

## Alternativas Consideradas

### Opção 1: Sempre via arquivo de config (.vscode/agents.json)
- Prós: Versionável, compartilhável, explícito
- Contras: Requer edição manual de arquivo

### Opção 2: Via UI da extensão com persistência em config
- Prós: User-friendly, visual
- Contras: Mais complexo, ainda precisa persistir em arquivo

### Opção 3: Detecção automática + override manual
- Prós: Inteligente, menos configuração
- Contras: Mágico, pode ser imprevisível

### Opção 4: Hardcoded no código de cada skill
- Prós: Simples para skill único
- Contras: Inflexível, não escalável

## Decisão

**Sempre via arquivo de config (`.vscode/agents.json`).**

Estrutura:
```json
{
  "defaultAgent": "copilot",
  "agents": {
    "copilot": {
      "enabled": true,
      "skills": ["react", "typescript"]
    },
    "claude": {
      "enabled": true,
      "skills": ["python", "rust"]
    }
  },
  "workspaceOverrides": {
    "workspace-1": {
      "defaultAgent": "claude"
    }
  }
}
```

UI pode fornecer interface visual, mas sempre persiste em arquivo.

## Consequências

### Positivas
- Configuração versionável com Git
- Compartilhável entre equipe
- Explícito e previsível
- Fácil de auditar

### Negativas
- Requer conhecimento de estrutura JSON
- UI precisa ler/escrever arquivo corretamente
- Pode ter conflitos de merge

## Implementação

- [ ] Definir schema Zod para agents.json
- [ ] Implementar leitura/escrita do arquivo
- [ ] Criar UI visual para configuração
- [ ] Implementar resolução de defaultAgent e overrides
- [ ] Validar configuração em runtime
- [ ] Documentar estrutura do arquivo
- [ ] Adicionar exemplos
