---
title: Resumo de Mudanças - Q2 2026
sidebar_label: Changelog Q2 2026
description: Atualização da documentação baseada em análise de gaps e decisões
---

# Resumo de Mudanças - Q2 2026

**Data**: 2026-04-08  
**Contexto**: Análise de gaps, incongruências e necessidades de esclarecimento na documentação

## 📋 Decisões Implementadas

Todas as 15 questões identificadas foram respondidas e aplicadas:

### ✅ Tecnologia e Implementação

| ID  | Decisão                             | Ação Realizada                                |
| --- | ----------------------------------- | --------------------------------------------- |
| Q3  | Zod instalado no shared package     | ✅ `pnpm add zod --filter shared` executado   |
| Q15 | ADRs em docs/03-implementation/adr/ | ✅ Estrutura criada com 4 ADRs + template     |

### 📝 Documentação Atualizada

#### Configuração e Validação
- **Q5**: Config workspace criado automaticamente com ação do usuário
- **Q7**: globalState usa JSON serializado  
- **Q9**: Documentação de tipos de conflito melhorada com cenários detalhados

#### Sincronização
- **Q8**: Git auto-pull padrão no primeiro sync (configurável via `gitPullTiming`)
- **Q10**: Delete/rename com preview configurável (`autoApproveDeletes`)
- **Q11**: Rollback removido da Fase 2 (usar `git revert` se necessário)

#### Arquitetura
- **Q12**: Capabilities compartilhadas em `/shared/types.ts`
- **Q13**: "Editor Assistido" consolidado como nomenclatura oficial

#### Roadmap
- **Q1**: Status de implementação rastreado em docs/03-implementation
- **Q2**: PathResolver documentado, implementação diferida
- **Q4**: TreeView marcado como não implementado
- **Q6**: Benchmark de performance definido posteriormente
- **Q14**: Template Library removida do roadmap

## 🗂️ ADRs Criados

### ADR-000: Template
Template estruturado para futuras decisões arquiteturais

### ADR-001: Precedência de Configuração
Define ordem de resolução:
1. `.vscode/agent-skills-manager.json`
2. VS Code settings
3. globalState
4. Zod defaults

### ADR-002: Protocolo de Mensagens por Capability
- União discriminada em `shared/src/types.ts`
- Capabilities para descoberta em runtime
- Type safety end-to-end

### ADR-003: Estratégia de Sincronização
- Hash SHA-256 para detecção
- Merge conservador automático
- Preview configurável para delete/rename
- Git integration com auto-pull configurável

### ADR-004: Exclusão de Template Library
- Feature removida do roadmap inicial
- Foco em core features (sync, validação, multi-agent)
- Pode ser reconsiderada após validação do produto

## 📁 Arquivos Modificados

### Configuração
- `docusaurus/docs/02-development/02-implementacao/01-configuracao-validacao.md`
  - ✅ Zod marcado como instalado
  - ✅ globalState format: JSON
  - ✅ Config workspace: criação automática

### Sincronização
- `docusaurus/docs/02-development/02-implementacao/02-sincronizacao.md`
  - ✅ Tipos de conflito com cenários detalhados
  - ✅ Delete/rename configurável
  - ✅ Git auto-pull timing configurável
  - ✅ Rollback removido
  - ✅ Benchmark "a definir"

### Message Passing
- `docusaurus/docs/02-development/02-implementacao/04-message-passing.md`
  - ✅ Capabilities em shared types

### Features e Roadmap
- `docusaurus/docs/02-development/03-features/01-decisoes-features.md`
  - ✅ Template Library removida
  - ✅ Editor Assistido consolidado
  - ✅ Status de implementação adicionado

- `docusaurus/docs/02-development/04-roadmap/00-decisoes-consolidadas.md`
  - ✅ Tabela de decisões atualizada com datas

- `docusaurus/docs/02-development/04-roadmap/01-fases-implementacao.md`
  - ✅ Rollback removido da Fase 2
  - ✅ Template Library removida da Fase 4

- `docusaurus/docs/02-development/04-roadmap/02-criterios-aceite.md`
  - ✅ Benchmark "a definir"
  - ✅ Template Library removida

## 📦 Dependências

```bash
# Executado com sucesso
pnpm add zod --filter shared
```

**Pacote instalado**: `zod@^3.x` (versão mais recente)

## 🎯 Próximos Passos

### Imediato
1. Implementar `shared/src/types.ts` com `ExtensionMessage` e `ConfigSchema`
2. Implementar `ConfigManager` seguindo ADR-001
3. Implementar handlers de mensagem seguindo ADR-002

### Fase 2 (Sincronização)
1. Implementar `SyncEngine` seguindo ADR-003
2. Integrar `simple-git` para operações Git
3. Implementar preview de delete/rename
4. Adicionar configurações: `autoApproveDeletes`, `gitPullTiming`

### Documentação
1. Criar ADRs adicionais conforme novas decisões surgem
2. Manter `00-decisoes-consolidadas.md` como fonte de verdade
3. Atualizar status em `docs/03-implementation/` conforme implementação

## 🔗 Referências

- [Decisões Consolidadas](../02-development/04-roadmap/00-decisoes-consolidadas.md)
- [ADR-001: Config Precedence](./adr/001-config-precedence.md)
- [ADR-002: Message Protocol](./adr/002-message-protocol.md)
- [ADR-003: Sync Strategy](./adr/003-sync-strategy.md)
- [ADR-004: Template Library Removal](./adr/004-template-library-removal.md)
