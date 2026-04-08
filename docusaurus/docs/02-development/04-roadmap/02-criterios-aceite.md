---
title: Critérios de Aceite
sidebar_label: Critérios de Aceite
description: Métricas de sucesso e checklist de aceitação por fase
---

# Critérios de Aceite

## Fase 1 - Core Foundation

| Critério              | Descrição                            |
| --------------------- | ------------------------------------ |
| Extensão carrega      | Extension ativa no VS Code sem erros |
| Webview renderiza     | UI React renderiza corretamente      |
| TreeView navega       | Navegação por skills/agents funciona |
| Configuração funciona | Leitura/salvamento de config         |
| Message passing       | Comunicação Extension ↔ Webview      |

## Fase 2 - Sincronização e Git

| Critério              | Target            | Descrição                                  |
| --------------------- | ----------------- | ------------------------------------------ |
| Sync multi-workspace  | 2+                | Sync funciona entre múltiplos workspaces   |
| Detecção de conflitos | > 95%             | Precisão na detecção                       |
| Resolução automática  | 70%+              | Conflitos resolvidos automaticamente       |
| Git commits           | sim               | Auto-commit após sync                      |
| Auto-sync             | sim               | File watcher configurável                  |
| Throughput            | A definir         | Benchmark será especificado posteriormente |

### Testes de Aceite

```bash
# Sync entre 2 workspaces
1. Criar skill no workspace A
2. Executar sync
3. Verificar skill no workspace B

# Detecção de conflitos
1. Modificar skill em ambos workspaces
2. Executar sync
3. Verificar detecção correta do conflito

# Resolução automática
1. Modificar skill diferente em cada workspace
2. Executar sync
3. Verificar merge automáticop
```

## Fase 3 - UI/UX Avançada

| Critério         | Target  | Descrição                        |
| ---------------- | ------- | -------------------------------- |
| Editor funcional | sim     | Editor de skills com validação   |
| Preview claro    | sim     | Preview de changes compreensível |
| Busca            | < 200ms | Tempo de resposta                |
| UI responsiva    | sim     | Acessível e usável               |

### Checklist de UI

- [ ] Editor de skills com preview
- [ ] Diff viewer integrado
- [ ] Busca funcional
- [ ] Filtros por tag
- [ ] Status indicators visíveis
- [ ] Toast notifications funcionam
- [ ] Error boundaries implementados

## Fase 4 - Recursos Avançados

| Critério          | Target | Descrição                         |
| ----------------- | ------ | --------------------------------- |
| Multi-agent       | 2+     | Suporte a múltiplos agents        |
| Seleção manual    | sim    | Usuário escolhe agent             |
| Validação sintaxe | sim    | Verificação de schema             |
| Cobertura testes  | 80%+   | Testes unitários (exceto JSX/TSX) |

### Templates

~~Template Library removida do roadmap~~

> 🚫 Feature removida temporariamente. Pode ser reconsiderada futuramente.

