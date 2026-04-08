---
title: Formato de Mensagem
description: Estrutura canonica de mensagem entre webview e extension.
---

## Escopo

Padronizar o envelope de mensagem e remover formatos alternativos.

## Estrutura Canonica

- Campo `type`: identifica a acao e define o schema esperado.
- Campo `payload`: objeto validado para execucao da acao.
- Mensagem sem envelope nao deve atravessar a fronteira extension/webview.

## Contrato

- Toda mensagem usa o formato com tipo e payload.
- O campo type define a acao esperada.
- O campo payload contem os dados validados para a acao.
- O schema de payload deve ser determinado pelo tipo da mensagem.
- Tipo desconhecido encerra o fluxo com erro padronizado.

## Regras de Implementacao

- Nao processar mensagem sem payload estruturado.
- Validar schema por tipo antes de rotear para handlers.
- Rejeitar tipos desconhecidos com erro padronizado.
- Garantir resposta explicita em sucesso e em erro para evitar estado pendente.
- Preservar compatibilidade quando houver evolucao de tipos entre versoes.

## Erros e Limites

- Payload ausente ou invalido deve retornar erro contratual.
- Mensagem com campos extras deve seguir politica de compatibilidade definida no schema.
- Falha de parse deve ser logada com contexto minimo de diagnostico.

