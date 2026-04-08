---
title: Config Panel
description: Edicao de configuracoes com validacao e sincronizacao com extension.
---

## Escopo

Permitir ajuste de configuracoes sem violar contrato compartilhado.

## API / Interface

- Entrada: configuracao atual validada e metadados de campo.
- Operacoes: edicao de formulario, validacao incremental e envio de alteracao.
- Saida: atualizacao de configuracao aplicada ou erro contratual por campo.

## Contrato

- Formulario representa configuracao tipada do shared.
- Alteracao valida deve refletir no estado da extension.
- Erro de validacao deve ser exibido sem bloquear leitura da tela.

## Regras de Implementacao

- Aplicar validacao no envio e no recebimento de dados.
- Manter feedback de erro por campo.
- Persistir somente configuracoes aprovadas pelo schema.

## Efeitos Colaterais

- Envia comandos de atualizacao para extension conforme fluxo de confirmacao.
- Reflete de volta estado efetivo aplicado para evitar divergencia de UI.

## Erros e Limites

- Falha de validacao deve manter ultimo estado valido visivel.
- Erro de persistencia deve preservar rascunho ate nova tentativa do usuario.

