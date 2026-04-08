# ADR-002: Protocolo de Message Passing

**Status**: Aprovado  
**Data**: 2026-04-08  
**Decisor(es)**: Team

## Contexto

Extension (Node.js) e Webview (React) precisam se comunicar bidirecionalmente. VS Code fornece API de `postMessage`, mas precisamos definir estrutura de tipos e protocolo.

## Alternativas Consideradas

### Opção 1: Tipos separados em cada package
- Prós: Cada package independente
- Contras: Drift entre implementações, falta de type safety

### Opção 2: União discriminada compartilhada em `shared/src/types.ts`
- Prós: Type safety, evita drift, exaustividade garantida
- Contras: Acoplamento entre packages

### Opção 3: Mensagens sem tipagem forte
- Prós: Flexível
- Contras: Sem type safety, propenso a erros

## Decisão

**Usar união discriminada compartilhada em `shared/src/types.ts`.**

```typescript
type ExtensionMessage =
  | { type: 'GET_STATUS' }
  | { type: 'STATUS_UPDATE'; payload: { capabilities: string[] } }
  | { type: 'CONFIG_UPDATE'; payload: { config: AppConfig } }
  | { type: 'SYNC_PATTERN'; payload: { destination: string } }
  | { type: 'SYNC_COMPLETE'; payload: { status: 'success'; syncedFiles: number } }
  | { type: 'SYNC_ERROR'; payload: { error: string } }
  | { type: 'TREE_REFRESH' }
```

### Sistema de Capabilities

Capabilities permitem descoberta de funcionalidades em runtime:

**Lista estática de capabilities**:
- `sync` - Sincronização de patterns
- `tree` - Navegação em árvore de skills  
- `config` - Gerenciamento de configuração

**Versionamento**: 
Capabilities suportam versionamento no formato `capability@version` (ex: `sync@2.0`, `tree@1.0`)

**Registro**:
Capabilities são centralizadas em `shared/src/capabilities.ts` que fornece:
- Lista canônica de capabilities disponíveis
- Versões de cada capability
- Validação e parsing de capabilities
- Helpers para verificação de compatibilidade

## Consequências

### Positivas
- Type safety end-to-end entre extension e webview
- Switch statements exaustivos (TypeScript garante)
- Fácil evolução do protocolo
- Capabilities descobertas em runtime

### Negativas
- Acoplamento entre packages (aceitável para monorepo)
- Mudanças em tipos requerem rebuild de ambos packages

## Implementação

- [x] Criar `shared/src/types.ts`
- [ ] Definir todos os tipos de mensagem
- [ ] Implementar handlers em extension
- [ ] Implementar handlers em webview
- [ ] Adicionar testes de integração
