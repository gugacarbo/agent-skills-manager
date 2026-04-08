---
title: Sync Policies
description: Políticas de retry, pull manual e operações destrutivas
---

# Sync Policies

Este documento consolida as políticas aplicadas pelo Sync Engine durante operações de sincronização, baseadas nos ADRs 009, 010 e 011.

## Status da Implementação

⚠️ **PLANEJADO** - Definido através de ADRs, aguardando implementação.

## Visão Geral

O Sync Engine aplica três políticas principais para garantir robustez, segurança e controle:

1. **Retry Policy** - Resiliência a falhas temporárias
2. **Git Pull Policy** - Controle do workflow Git
3. **Delete/Rename Policy** - Segurança em operações destrutivas

---

## 1. Retry Policy

**Baseado em**: [ADR-010: Política de Retry com Backoff](../adr/ADR-010-retry-policy.md)

### Objetivo

Tornar o Sync Engine resiliente a falhas temporárias de rede, sem travar indefinidamente ou requerer intervenção manual constante.

### Estratégia

**Retry 3x com backoff exponencial: 2s, 4s, 8s**

```
Tentativa 1: Imediata
Tentativa 2: Após 2 segundos
Tentativa 3: Após 4 segundos  
Tentativa 4: Após 8 segundos
Falha final: Notifica usuário (~14s total)
```

### Implementação Prevista

```typescript
interface RetryConfig {
  maxRetries: number;     // 3
  baseDelay: number;      // 2000ms
  maxDelay: number;       // 8000ms
  exponential: boolean;   // true
}

class RetryManager {
  constructor(private config: RetryConfig = DEFAULT_RETRY_CONFIG) {}

  /**
   * Executa operação com retry e backoff exponencial
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        // Mostra progresso se não é primeira tentativa
        if (attempt > 0) {
          this.showRetryProgress(operationName, attempt);
        }

        return await operation();
      } catch (error) {
        lastError = error;

        // Classifica o erro
        if (!this.isRetryable(error)) {
          throw error; // Erro permanente, não tenta novamente
        }

        // Última tentativa falhou
        if (attempt === this.config.maxRetries) {
          throw this.createRetryExhaustedError(operationName, lastError);
        }

        // Calcula delay e aguarda
        const delay = this.calculateDelay(attempt);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Calcula delay exponencial
   */
  private calculateDelay(attempt: number): number {
    const delay = this.config.baseDelay * Math.pow(2, attempt);
    return Math.min(delay, this.config.maxDelay);
  }

  /**
   * Classifica se erro é retryable
   */
  private isRetryable(error: any): boolean {
    // Network errors - retryable
    if (error.code === 'ECONNRESET') return true;
    if (error.code === 'ETIMEDOUT') return true;
    if (error.code === 'ENOTFOUND') return true;
    if (error.message?.includes('network')) return true;

    // Git errors - alguns são retryable
    if (error.message?.includes('Could not resolve host')) return true;
    if (error.message?.includes('Connection timed out')) return true;

    // Permanent errors - não retryable
    if (error.message?.includes('authentication failed')) return false;
    if (error.message?.includes('permission denied')) return false;
    if (error.message?.includes('conflict')) return false;
    if (error.message?.includes('merge')) return false;

    // Default: não retryable (conservador)
    return false;
  }

  /**
   * Mostra progresso durante retry
   */
  private showRetryProgress(operation: string, attempt: number): void {
    const delay = this.calculateDelay(attempt - 1);
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `Retrying ${operation}`,
        cancellable: true
      },
      async (progress, token) => {
        progress.report({
          message: `Attempt ${attempt} of ${this.config.maxRetries}...`
        });
      }
    );
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

### Operações com Retry

**Aplicado a**:
- ✅ Git push
- ✅ Git fetch
- ✅ Network operations
- ✅ File system operations (transient errors)

**NÃO aplicado a**:
- ❌ Merge conflicts (requer intervenção)
- ❌ Authentication errors (erro permanente)
- ❌ Permission errors (erro permanente)
- ❌ Invalid syntax errors (erro permanente)

### Retry Cancellation

**Botão "Cancel" na notificação de retry**

Durante o processo de retry, o usuário pode cancelar a operação:

```typescript
/**
 * Mostra progresso durante retry com opção de cancelamento
 */
private showRetryProgress(operation: string, attempt: number): CancellationTokenSource {
  const cancellationTokenSource = new vscode.CancellationTokenSource();
  
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Retrying ${operation}`,
      cancellable: true
    },
    async (progress, token) => {
      progress.report({
        message: `Attempt ${attempt} of ${this.config.maxRetries}...`
      });
      
      // Propaga cancelamento
      token.onCancellationRequested(() => {
        cancellationTokenSource.cancel();
      });
    }
  );
  
  return cancellationTokenSource;
}

/**
 * Executa operação com retry e suporte a cancelamento
 */
async executeWithRetry<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  let lastError: Error;
  let cancellationToken: CancellationTokenSource | null = null;

  for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
    try {
      // Mostra progresso se não é primeira tentativa
      if (attempt > 0) {
        cancellationToken = this.showRetryProgress(operationName, attempt);
      }

      // Verifica se foi cancelado
      if (cancellationToken?.token.isCancellationRequested) {
        throw new Error(`${operationName} cancelled by user`);
      }

      return await operation();
    } catch (error) {
      lastError = error;

      // Classifica o erro
      if (!this.isRetryable(error)) {
        throw error; // Erro permanente, não tenta novamente
      }

      // Última tentativa falhou
      if (attempt === this.config.maxRetries) {
        throw this.createRetryExhaustedError(operationName, lastError);
      }

      // Calcula delay e aguarda
      const delay = this.calculateDelay(attempt);
      await this.sleep(delay);
    } finally {
      cancellationToken?.dispose();
    }
  }

  throw lastError!;
}
```

**Comportamento do Cancel**:
- ❌ Aborta operação de retry
- ✅ Mantém estado anterior (não aplica mudanças parciais)
- 📝 Registra cancelamento nos logs
- 🔔 Notifica usuário que operação foi cancelada

### Exemplo de Uso

```typescript
const retryManager = new RetryManager();

// Git push com retry e cancelamento
await retryManager.executeWithRetry(
  async () => {
    await git.push();
  },
  'Git Push'
);

// Sync com retry e cancelamento
await retryManager.executeWithRetry(
  async () => {
    await syncEngine.sync();
  },
  'Skills Sync'
);
```

### Experiência do Usuário

```
[Tentativa 1] Pushing to origin... ❌ Network error
[Aguardando 2s...]
[Tentativa 2] Retrying push... ❌ Network error
[Aguardando 4s...]
[Tentativa 3] Retrying push... ❌ Network error
[Aguardando 8s...]
[Tentativa 4] Retrying push... ❌ Network error

❌ Failed to push after 4 attempts (~14s)
   Last error: Connection timed out
   
[Tentar Novamente] [Ver Logs] [Cancelar]
```

---

## 2. Git Pull Policy

**Baseado em**: [ADR-009: Política de Git Pull Manual](../adr/ADR-009-git-pull-policy.md)

### Objetivo

Garantir que o usuário tenha controle total sobre o workflow Git, sem surpresas ou perda de work in progress.

### Estratégia

**Nunca fazer auto-pull. Usuário deve fazer pull manualmente.**

⚠️ **IMPORTANTE**: Git pull é sempre manual. Não existe configuração `gitPullTiming` ou similar. Para fazer pull, use o comando `skills.gitPull` no Command Palette (ver [Commands](./02-commands.md)).

### Rationale

1. **Máximo Controle**: Usuário decide quando sincronizar com remoto
2. **Sem Surpresas**: Não sobrescreve work in progress
3. **Previsibilidade**: Comportamento consistente
4. **Compatibilidade**: Não interfere com workflow Git existente

### Operações Git Suportadas

| Operação | Status | Configurável | Descrição |
|----------|--------|--------------|-----------|
| **Pull** | ❌ Nunca | Não | Usuário faz pull manual |
| **Commit** | ✅ Automático | Não | Após cada sync bem-sucedido |
| **Push** | 🔧 Opcional | Sim | Configurável via settings |

### Implementação Prevista

```typescript
interface GitIntegration {
  /**
   * Auto-commit após sync (sempre habilitado)
   */
  autoCommit: boolean; // sempre true

  /**
   * Auto-push após commit (configurável)
   */
  autoPush: boolean; // padrão: false

  /**
   * Auto-pull nunca é suportado
   * (não há configuração para isso)
   */
}

class GitManager {
  /**
   * Commit automático após sync
   */
  async commitAfterSync(files: string[]): Promise<void> {
    await git.add(files);
    await git.commit('sync: Update skills from workspaces');
  }

  /**
   * Push opcional (se configurado)
   */
  async pushIfEnabled(): Promise<void> {
    const config = vscode.workspace.getConfiguration('skills');
    const autoPush = config.get<boolean>('git.autoPush', false);

    if (autoPush) {
      await git.push();
    }
  }

  /**
   * Pull NUNCA é automático
   * Método manual disponível via comando
   */
  async manualPull(): Promise<void> {
    // Usuário invoca explicitamente
    await git.pull();
  }
}
```

### Warning para Repositório Desatualizado

⚠️ **Recomendado**: Avisar o usuário quando repositório está desatualizado.

```typescript
async function checkRepositoryStatus(): Promise<void> {
  // Verifica se há commits remotos não baixados
  const status = await git.status();
  
  if (status.behind > 0) {
    const action = await vscode.window.showWarningMessage(
      `Repository is ${status.behind} commits behind origin. Consider pulling.`,
      'Pull Now',
      'Dismiss'
    );

    if (action === 'Pull Now') {
      // Executa comando skills.gitPull
      await vscode.commands.executeCommand('skills.gitPull');
    }
  }
}
```

**Uso Sugerido**: Use o comando `skills.gitPull` (ver [Commands](./02-commands.md)) para sincronizar manualmente com o repositório remoto.

### Exemplo de Workflow

```typescript
// 1. Usuário modifica skill no workspace
// 2. AutoSync detecta mudança (se habilitado)
// 3. Sync Engine sincroniza para Git
await syncEngine.sync();

// 4. Auto-commit (sempre)
await gitManager.commitAfterSync(changedFiles);

// 5. Auto-push (se configurado)
await gitManager.pushIfEnabled();

// 6. Pull NUNCA é automático - usuário decide
// Usuário pode fazer pull manualmente quando quiser
await gitManager.manualPull(); // Comando manual
```

---

## 3. Delete/Rename Policy

**Baseado em**: [ADR-011: Política de Delete/Rename](../adr/ADR-011-delete-rename-policy.md)

### Objetivo

Máxima segurança contra perda de dados acidental em operações destrutivas.

### Estratégia

**Sempre perguntar como comportamento padrão, com opção configurável de auto-aprovação.**

### Comportamento

#### Modo Padrão (`autoApproveDeletes: false`)

Para toda operação destrutiva (delete ou rename):

1. **Detecta** operação destrutiva
2. **Mostra** preview detalhado
3. **Aguarda** confirmação explícita do usuário
4. **Executa** apenas após aprovação

#### Modo Auto-Aprovação (`autoApproveDeletes: true`)

Quando configurado ([ADR-003](../adr/ADR-003-sync-strategy.md)):

1. **Detecta** operação destrutiva
2. **Registra** nos logs
3. **Executa** automaticamente sem confirmação

**Recomendação**: Manter `autoApproveDeletes=false` (padrão) para máxima segurança contra perda de dados acidental.

### Implementação Prevista

```typescript
interface DestructiveOperation {
  type: 'delete' | 'rename';
  source: string;
  target?: string; // apenas para rename
  reason: string;
}

class DestructiveOperationsManager {
  /**
   * Detecta operações destrutivas
   */
  async detectDestructiveOps(
    changes: SyncChange[]
  ): Promise<DestructiveOperation[]> {
    const destructive: DestructiveOperation[] = [];

    for (const change of changes) {
      // Delete detectado
      if (change.type === 'delete') {
        destructive.push({
          type: 'delete',
          source: change.file,
          reason: 'File deleted in source'
        });
      }

      // Rename detectado
      if (change.type === 'rename') {
        destructive.push({
          type: 'rename',
          source: change.oldPath,
          target: change.newPath,
          reason: 'File renamed in source'
        });
      }
    }

    return destructive;
  }

  /**
   * Solicita confirmação do usuário
   */
  async requestConfirmation(
    operations: DestructiveOperation[]
  ): Promise<boolean> {
    // Mostra preview detalhado
    const preview = this.generatePreview(operations);

    const action = await vscode.window.showWarningMessage(
      `${operations.length} destructive operation(s) detected`,
      {
        modal: true,
        detail: preview
      },
      'Approve',
      'Cancel'
    );

    return action === 'Approve';
  }

  /**
   * Gera preview das operações
   */
  private generatePreview(ops: DestructiveOperation[]): string {
    const lines = ['The following operations will be executed:', ''];

    for (const op of ops) {
      if (op.type === 'delete') {
        lines.push(`❌ DELETE: ${op.source}`);
        lines.push(`   Reason: ${op.reason}`);
      } else {
        lines.push(`📝 RENAME: ${op.source} → ${op.target}`);
        lines.push(`   Reason: ${op.reason}`);
      }
      lines.push('');
    }

    lines.push('⚠️  This action cannot be undone.');
    lines.push('Git history can be used to recover files.');

    return lines.join('\n');
  }

  /**
   * Executa operações após aprovação
   */
  async executeWithConfirmation(
    operations: DestructiveOperation[]
  ): Promise<void> {
    if (operations.length === 0) return;

    // Solicita confirmação
    const approved = await this.requestConfirmation(operations);

    if (!approved) {
      throw new Error('Destructive operations cancelled by user');
    }

    // Executa operações
    for (const op of operations) {
      if (op.type === 'delete') {
        await fs.unlink(op.source);
        this.logOperation('delete', op.source);
      } else {
        await fs.rename(op.source, op.target!);
        this.logOperation('rename', op.source, op.target);
      }
    }
  }

  private logOperation(type: string, source: string, target?: string): void {
    logger.info(`Executed ${type}: ${source}${target ? ` → ${target}` : ''}`);
  }
}
```

### Exemplo de Interface

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️  3 Destructive Operations Detected                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ The following operations will be executed:                  │
│                                                             │
│ ❌ DELETE: skill-old.yaml                                   │
│    Reason: File deleted in Git repository                  │
│                                                             │
│ 📝 RENAME: skill-a.yaml → skill-new-name.yaml              │
│    Reason: File renamed in Git repository                  │
│                                                             │
│ ❌ DELETE: deprecated-skill.yaml                            │
│    Reason: File deleted in Git repository                  │
│                                                             │
│ ⚠️  This action cannot be undone.                           │
│ Git history can be used to recover files.                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                   [Approve]  [Cancel]       │
└─────────────────────────────────────────────────────────────┘
```

### Operações em Lote

Para múltiplas operações:

```typescript
async function syncWithDestructiveOps(): Promise<void> {
  const changes = await detectChanges();
  const destructive = await detectDestructiveOps(changes);

  if (destructive.length > 0) {
    // Agrupa todas as operações destrutivas em um único prompt
    const approved = await requestConfirmation(destructive);

    if (!approved) {
      // Cancela todo o sync
      throw new Error('Sync cancelled - destructive operations not approved');
    }
  }

  // Executa sync completo (incluindo destrutivas)
  await applySyncChanges(changes);
}
```

---

## Integração das Políticas

As três políticas trabalham juntas durante o sync:

```typescript
async function performSync(): Promise<SyncResult> {
  try {
    // 1. Detecta mudanças
    const changes = await changeDetector.detectChanges();

    // 2. Aplica Delete/Rename Policy
    const destructive = await destructiveOpsManager.detectDestructiveOps(changes);
    if (destructive.length > 0) {
      await destructiveOpsManager.executeWithConfirmation(destructive);
    }

    // 3. Aplica Retry Policy para operações de rede
    await retryManager.executeWithRetry(async () => {
      await applySyncChanges(changes);
    }, 'Sync');

    // 4. Git operations (Pull Policy)
    await gitManager.commitAfterSync(changes.files);
    await gitManager.pushIfEnabled(); // Nunca pull automático

    return { success: true, changes };
  } catch (error) {
    return { success: false, error };
  }
}
```

---

## Consequências

### Retry Policy

**Positivas** ✅:
- Resiliente a falhas temporárias
- Experiência de usuário melhorada
- Padrão da indústria

**Negativas** ⚠️:
- Pode demorar ~14s no pior caso
- Requer progress indicator

### Git Pull Policy

**Positivas** ✅:
- Controle total para o usuário
- Sem surpresas ou perda de dados
- Comportamento previsível

**Negativas** ⚠️:
- Usuário precisa lembrar de fazer pull
- Possível divergência com remoto

### Delete/Rename Policy

**Positivas** ✅:
- Máxima segurança
- Usuário sempre consciente
- Sem perda de dados acidental

**Negativas** ⚠️:
- Friction adicional
- Pode ser repetitivo em lote

---

## Referências

- [ADR-009: Política de Git Pull Manual](../adr/ADR-009-git-pull-policy.md)
- [ADR-010: Política de Retry com Backoff](../adr/ADR-010-retry-policy.md)
- [ADR-011: Política de Delete/Rename](../adr/ADR-011-delete-rename-policy.md)
- [Sync Engine](./04-sync-engine.md)
- [Sync Strategies](./05-sync-strategies.md)
