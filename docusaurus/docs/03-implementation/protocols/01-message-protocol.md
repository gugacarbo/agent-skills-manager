---
title: Message Protocol
description: Protocolo de comunicação entre Extension e Webview
---

## Visão Geral

O protocolo de message passing estabelece a comunicação bidirecional entre a Extension (Node.js) e a Webview (React/Browser). Utiliza a API `postMessage` do VS Code com tipagem forte compartilhada.

## Protocolo

Baseado em **ADR-002**, o protocolo utiliza **união discriminada** (`discriminated union`) com tipos compartilhados no package `shared`, garantindo type safety end-to-end.

### Decisões de Design

- **Tipos compartilhados**: Definidos em `shared/src/types.ts` para evitar drift entre implementações
- **União discriminada**: Campo `type` como discriminador + `payload` opcional
- **Type safety**: TypeScript garante exaustividade em switch statements
- **Capabilities**: Descoberta de funcionalidades em runtime

## Estrutura de Mensagem

Todas as mensagens seguem a estrutura base:

```typescript
type ExtensionMessage =
  | { type: 'MESSAGE_TYPE' }
  | { type: 'MESSAGE_TYPE'; payload: PayloadType }
```

### Componentes

- **`type`** (obrigatório): String literal que identifica o tipo de mensagem
- **`payload`** (opcional): Dados associados à mensagem, tipados conforme o `type`

## Direções de Comunicação

### Extension → Webview

Mensagens enviadas pela extension para atualizar o estado da UI:

- **STATUS_UPDATE**: Atualização de capabilities da extension
- **CONFIG_UPDATE**: Mudanças na configuração
- **SYNC_COMPLETE**: Confirmação de sincronização bem-sucedida
- **SYNC_ERROR**: Erro durante operação
- **TREE_REFRESH**: Solicitação para refresh da árvore de skills

### Webview → Extension

Mensagens enviadas pela webview para solicitar operações:

- **GET_STATUS**: Requisição do status atual da extension
- **SYNC_PATTERN**: Solicita sincronização de pattern para destino

## Garantias do Protocolo

### Serialização

- Mensagens são serializadas via JSON
- Payloads devem ser serializáveis (sem funções, símbolos, etc.)
- Strings, números, objetos e arrays simples são suportados

### Type Safety

- União discriminada permite narrowing automático
- TypeScript detecta mensagens não tratadas em compilação
- Refatoração segura (renomear tipo afeta ambos os lados)

### Error Handling

- Mensagens malformadas são descartadas
- Erros de operação retornam mensagens `*_ERROR`
- Extension nunca crasha por mensagem inválida

## Ciclo de Vida

```
1. Webview carrega
2. Webview envia GET_STATUS
3. Extension responde com STATUS_UPDATE
4. Comunicação bidirecional estabelecida
```

## Implementação

### Status Atual

- **ADR-002**: ✅ Aprovado
- **shared/src/types.ts**: ⚠️ Pendente criação
- **Extension handlers**: ⚠️ Não implementado
- **Webview handlers**: ⚠️ Não implementado

### Próximos Passos

1. Criar definições de tipos em `shared/src/types.ts`
2. Implementar handlers na extension
3. Implementar handlers na webview
4. Adicionar testes de integração

## Exemplo de Uso

### Na Extension

```typescript
// Enviar mensagem para webview
webviewPanel.webview.postMessage({
  type: 'STATUS_UPDATE',
  payload: { capabilities: ['sync', 'tree'] }
});

// Receber mensagens da webview
webviewPanel.webview.onDidReceiveMessage((message: ExtensionMessage) => {
  switch (message.type) {
    case 'GET_STATUS':
      // Handler
      break;
    case 'SYNC_PATTERN':
      // Handler com message.payload
      break;
  }
});
```

### Na Webview

```typescript
// Enviar mensagem para extension
vscode.postMessage({
  type: 'GET_STATUS'
});

// Receber mensagens da extension
window.addEventListener('message', (event) => {
  const message: ExtensionMessage = event.data;
  switch (message.type) {
    case 'STATUS_UPDATE':
      // Handler com message.payload
      break;
  }
});
```

## Referências

- [ADR-002: Message Passing Protocol](../adr/ADR-002-message-passing-protocol.md)
- [Tipos de Mensagens](./02-message-types.md)
- [Fluxo de Comunicação](./03-communication-flow.md)
- [VS Code Webview API](https://code.visualstudio.com/api/extension-guides/webview)
