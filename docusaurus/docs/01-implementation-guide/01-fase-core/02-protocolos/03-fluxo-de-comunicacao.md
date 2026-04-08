---
title: Fluxo de Comunicacao
description: Sequencia de envio, validacao, processamento e resposta entre modulos.
---

## Escopo

Definir fluxo operacional de mensagens do ciclo requisicao-resposta.

## API / Interface

- Origem: webview envia comando tipado.
- Processamento: extension valida, roteia e executa handler.
- Destino: webview recebe estado atualizado ou erro contratual.

## Contrato

- Webview envia comando tipado com payload.
- Extension valida e executa handler correspondente.
- Extension responde com estado atualizado ou erro padronizado.
- Uma requisicao ativa deve ter encerramento explicito no protocolo.
- Ordem de eventos deve preservar consistencia de estado da UI.

## Regras de Implementacao

- Registrar inicio e fim de operacao para auditoria de suporte.
- Encerrar fluxo com resposta explicita para evitar estado pendente na UI.
- Nao propagar excecao bruta para a webview.
- Aplicar timeout e estrategia de falha controlada em operacoes longas.
- Garantir idempotencia para reenvio de requisicao quando aplicavel.

## Erros e Limites

- Resposta de erro deve conter codigo e mensagem legivel.
- Falha em etapa intermediaria deve interromper fluxo de forma previsivel.
- Mensagens fora de sequencia nao devem sobrescrever estado valido.

