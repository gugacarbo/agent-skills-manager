---
title: Multi-Agent Config
description: Estrategia de configuracao por agente apos estabilizacao do core.
---

## Escopo

Introduzir suporte a configuracao por agente somente apos estabilidade do fluxo base.

## API / Interface

- Entrada: configuracao global e overrides por agente.
- Operacoes: resolver valor efetivo por precedencia e origem.
- Saida: configuracao final aplicada com rastreio de origem.

## Contrato

- Regras globais continuam como fallback.
- Configuracao por agente deve herdar e sobrescrever apenas campos permitidos.
- Leitura de config deve continuar deterministica.
- Resolucao deve ser reproduzivel para o mesmo conjunto de entradas.

## Regras de Implementacao

- Definir fronteira clara entre config global e config por agente.
- Evitar quebra de compatibilidade de schema.
- Registrar origem do valor aplicado no painel de configuracao.
- Bloquear override para campos marcados como nao sobrescreviveis.

## Erros e Limites

- Configuracao de agente invalida deve cair para fallback global seguro.
- Conflito de override deve produzir erro de validacao rastreavel.
- Evolucao de schema deve prever migracao de valores persistidos.

