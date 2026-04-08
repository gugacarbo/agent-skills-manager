---
title: Configuracao e Tipos
description: Contrato de configuracao, precedencia e tipos base compartilhados.
---

## Escopo

Definir tipos centrais em shared e garantir precedencia unica para leitura de configuracao.

## Ordem de Precedencia

1. Configuracao de workspace.
2. Settings da extensao no VS Code.
3. Estado persistido da extensao.
4. Defaults do schema.

## Contrato

- Ordem de precedencia: workspace, settings, estado persistido, defaults.
- O carregamento deve ser deterministico para evitar divergencia entre extension e webview.
- Tipos devem ficar centralizados em shared e ser consumidos sem redefinicao local.
- Campos essenciais de configuracao devem possuir tipo explicito e valor padrao quando permitido.
- Mudanca de tipo compartilhado deve ser refletida em extension e webview no mesmo ciclo.

## Regras de Implementacao

- Expor tipos em ponto unico de exportacao do pacote shared.
- Aplicar defaults conservadores quando valores forem ausentes.
- Emitir warning quando valor recebido for invalido e corrigido por fallback.
- Nao inferir comportamento por ausencia de campo quando existir default definido.
- Preservar compatibilidade de leitura ao evoluir schema entre versoes.

## Erros e Limites

- Configuracao invalida nao deve interromper ativacao da extensao.
- Campo desconhecido deve ser ignorado ou normalizado conforme schema.
- Erro de parse deve registrar motivo tecnico e aplicar fallback seguro.
