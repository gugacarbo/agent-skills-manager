---
title: Componentes Base
description: Estrutura de componentes iniciais e responsabilidades da camada de UI.
---

## Escopo

Organizar composicao base da UI e papeis de cada componente principal.

## API / Interface

- Container principal: compoe layout e roteia estado para subcomponentes.
- Componentes de dominio: exibem dados e emitem eventos de interacao.
- Componentes de UI: abstraem estilo e semantica visual reutilizavel.

## Contrato

- App coordena layout e distribuicao de estado recebido.
- Componentes UI mantem responsabilidade visual.
- Regras de negocio permanecem na extension e no protocolo.
- Estado derivado de protocolo nao deve ser reescrito por logica visual.
- Componente deve expor interface estavel para integracao entre modulos.

## Regras de Implementacao

- Evitar dependencia circular entre componentes de dominio.
- Separar camada de apresentacao e camada de integracao de mensagem.
- Preservar interface estavel para componentes compartilhados.
- Centralizar estados de carregamento e erro em pontos previsiveis.
- Evitar replicar parse de mensagem em mais de um componente.

## Erros e Limites

- Componente sem dados minimos deve exibir estado vazio controlado.
- Erro de renderizacao de modulo nao deve comprometer a pagina inteira.
- Interacao invalida deve falhar com feedback claro para usuario.

