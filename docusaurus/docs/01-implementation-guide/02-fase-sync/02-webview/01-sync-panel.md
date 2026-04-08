---
title: Sync Panel
description: Painel de monitoramento de sync, conflitos e acao do usuario.
---

## Escopo

Entregar painel de sincronizacao como ponto de observabilidade e acao.

## API / Interface

- Entrada: eventos de progresso, conflito e resultado emitidos pela extension.
- Operacoes: renderizar estado atual, permitir acao do usuario e refletir transicoes.
- Saida: comandos de confirmar, adiar, cancelar e reexecutar sync.

## Contrato

- Exibir estado de sync em tempo real.
- Exibir conflitos com contexto suficiente para decisao.
- Permitir acao explicita de confirmar, adiar ou cancelar.
- Exibir ultimo resultado com contagem de operacoes e falhas.

## Regras de Implementacao

- Atualizar progresso por eventos de protocolo, sem polling nao controlado.
- Priorizar clareza de erro e proxima acao recomendada.
- Manter historico resumido da ultima execucao.
- Garantir consistencia visual entre estado local e estado retornado pela extension.

## Erros e Limites

- Evento invalido nao deve quebrar o painel.
- Conflito sem dados minimos deve exibir estado de recuperacao manual.
- Acao de usuario indisponivel no estado atual deve ser bloqueada com feedback.

