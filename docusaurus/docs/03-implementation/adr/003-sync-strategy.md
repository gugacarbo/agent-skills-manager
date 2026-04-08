---
title: ADR-003 Estratégia de Sincronização
sidebar_label: "003: Sync Strategy"
description: Detecção de conflitos, merge automático e políticas de sincronização
---

# ADR-003: Estratégia de Sincronização e Resolução de Conflitos

**Data**: 2026-04-08  
**Status**: Aceito  
**Decisores**: Equipe de desenvolvimento  

## Contexto

O Sync Engine precisa coordenar skills entre múltiplos workspaces com:
- Detecção confiável de mudanças
- Resolução de conflitos automática quando possível
- Intervenção manual clara quando necessário
- Integração Git para histórico e rollback via Git
- Preview para operações destrutivas (delete/rename)

## Decisão

### 1. Detecção de Mudanças
**Método**: Hash SHA-256 para comparação de conteúdo

### 2. Tipos de Conflito

| Tipo        | Descrição                                      | Resolução          |
| ----------- | ---------------------------------------------- | ------------------ |
| `same`      | Arquivos idênticos (hash SHA-256 igual)        | Nenhuma ação       |
| `different` | Alterações em regiões não-sobrepostas          | Merge automático   |
| `conflict`  | Alterações na mesma região ou ambiguidade      | Intervenção manual |

**Cenários**:
- **same**: Hash idêntico → skip
- **different (single)**: Arquivo modificado em apenas um workspace → cópia direta
- **different (merge)**: Linhas diferentes no mesmo arquivo → merge linha a linha
- **conflict**: Mesma linha modificada → prompt usuário

### 3. Política de Merge
- Auto-merge conservador: apenas quando não há sobreposição
- Ambiguidade = conflito manual
- Registro de decisões no log

### 4. Delete e Rename
- Preview configurável (`autoApproveDeletes: boolean`)
- Padrão: preview habilitado
- Usuário pode auto-aprovar se desejar
- Aplicação em lote após confirmação

### 5. Git Integration
- Auto-pull antes do sync (padrão: primeiro sync)
- Configurável via `gitPullTiming: 'always' | 'first' | 'never'`
- Auto-commit após sync
- Push automático (configurável)
- Retry com backoff exponencial para erros de rede

### 6. Rollback
**Não implementado na Fase 2** → usar `git revert` manualmente

## Alternativas Consideradas

### Opção 1: Timestamp-based sync
- **Prós**: 
  - Mais rápido
  - Menos CPU
- **Contras**:
  - Menos confiável (timestamps podem enganar)
  - Não detecta mudanças semânticas

### Opção 2: Git diff nativo
- **Prós**: 
  - Usa ferramenta madura
  - Merge de 3 vias
- **Contras**:
  - Mais lento
  - Requer repositório Git configurado
  - Complexidade adicional

### Opção 3: Sempre intervenção manual
- **Prós**: 
  - Zero risco de merge incorreto
- **Contras**:
  - UX terrível
  - Não escala

### Opção Escolhida: Hash + merge conservador
**Justificativa**: 
- Precisão confiável com SHA-256
- Auto-merge resolve casos simples
- Fallback manual para ambiguidade
- Balance entre automação e segurança

## Consequências

### Positivas
- Detecção confiável de mudanças
- Auto-merge reduz interrupções
- Git fornece histórico e auditoria
- Preview evita surpresas em operações destrutivas
- Configurável para diferentes workflows

### Negativas
- Hash calculation pode ser lento para arquivos grandes
- Auto-merge pode falhar em conflitos semânticos
- Sem rollback nativo (apenas via Git)
- Múltiplas configurações podem confundir

### Neutras
- Cache de hashes pode ser necessário no futuro
- Benchmark de performance será definido depois
- UX de resolução manual crítica para adoção

## Implementação

- [ ] Implementar `SyncEngine` em `extension/src/sync/`
- [ ] Implementar cálculo de hash SHA-256
- [ ] Implementar comparador de arquivos
- [ ] Implementar merge linha a linha para `different`
- [ ] Implementar detector de conflitos para `conflict`
- [ ] Integrar `simple-git` para operações Git
- [ ] Implementar auto-pull configurável
- [ ] Implementar auto-commit e push
- [ ] Implementar preview de delete/rename
- [ ] Adicionar configuração `autoApproveDeletes`
- [ ] Adicionar configuração `gitPullTiming`
- [ ] Log estruturado de operações
- [ ] Testes unitários para cada cenário

## Referências

- [Sincronização](../../02-development/02-implementacao/02-sincronizacao.md)
- [Decisões Consolidadas](../../02-development/04-roadmap/00-decisoes-consolidadas.md) (Q8, Q9, Q10, Q11, Q12)
- [Critérios de Aceite - Fase 2](../../02-development/04-roadmap/02-criterios-aceite.md)
