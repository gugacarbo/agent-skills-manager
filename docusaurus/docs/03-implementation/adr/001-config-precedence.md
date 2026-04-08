---
title: ADR-001 Precedência de Configuração
sidebar_label: "001: Config Precedence"
description: Ordem de precedência para resolução de configurações
---

# ADR-001: Precedência de Configuração e Storage Global

**Data**: 2026-04-08  
**Status**: Aceito  
**Decisores**: Equipe de desenvolvimento  

## Contexto

O Agent Skills Manager precisa suportar configurações em múltiplos níveis:
- Configurações globais (todas workspaces)
- Configurações por workspace (projeto específico)
- Settings do VS Code
- Defaults do sistema

É necessário definir uma ordem clara de precedência para resolver conflitos e garantir comportamento previsível.

## Decisão

**Ordem de precedência (maior para menor)**:
1. `.vscode/agent-skills-manager.json` (workspace file)
2. VS Code settings (`agent-skills-manager.*`)
3. `ExtensionContext.globalState` (global storage)
4. Defaults do `ConfigSchema` (Zod)

**Storage global**: `ExtensionContext.globalState` com JSON serializado

## Alternativas Consideradas

### Opção 1: VS Code Settings como prioridade máxima
- **Prós**: 
  - Familiar para usuários VS Code
  - Sincronização via Settings Sync
- **Contras**:
  - Mais difícil de versionar no Git
  - Menos explícito para configurações de projeto

### Opção 2: Apenas arquivo workspace
- **Prós**: 
  - Simplicidade
  - Versionamento direto
- **Contras**:
  - Sem configurações globais
  - Usuário precisa duplicar config em cada projeto

### Opção Escolhida: Precedência em camadas
**Justificativa**: 
- Workspace file permite versionamento Git
- VS Code settings para preferências pessoais
- GlobalState para defaults do usuário
- Zod defaults como fallback seguro

## Consequências

### Positivas
- Configuração de projeto versionável
- Flexibilidade para usuários
- Defaults sensatos sempre disponíveis
- Sobrescrita granular por nível

### Negativas
- Complexidade na resolução de config
- Múltiplas fontes podem confundir usuários
- Debug de configuração requer verificação em camadas

### Neutras
- Necessário documentar claramente a precedência
- UI deve mostrar origem da configuração ativa

## Implementação

- [x] Definir `ConfigSchema` com Zod
- [x] Instalar Zod no shared package
- [ ] Implementar `ConfigManager` em `extension/src/config/`
- [ ] Criar método `resolveConfig()` com merge de camadas
- [ ] Implementar persistência em `globalState` (JSON)
- [ ] Criar comando para abrir `.vscode/agent-skills-manager.json`
- [ ] Adicionar UI indicator mostrando fonte da config ativa

## Referências

- [Configuração e Validação](../02-implementacao/01-configuracao-validacao.md)
- [Decisões Consolidadas](../../02-development/04-roadmap/00-decisoes-consolidadas.md) (Q9, Q10)
