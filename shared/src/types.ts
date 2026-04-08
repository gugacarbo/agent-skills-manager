/**
 * Shared message/data contracts.
 *
 * TODO: Revisit every message shape after the ADR-016 payload wrapper decision
 * is fully applied across the codebase.
 */

import type { AppConfig } from "./config.js";

export type Status = "idle" | "syncing" | "error";
export type SyncDirection = "push" | "pull" | "both";
export type MessagePayload = Record<string, unknown>;
export type EmptyPayload = Record<string, never>;

export interface MessageEnvelope<
	TType extends string,
	TPayload extends object = MessagePayload,
> {
	type: TType;
	payload: TPayload;
}

export interface SyncErrorDetails {
	file?: string;
	operation?: string;
	retryable: boolean;
}

export interface FileNode {
	name: string;
	path: string;
	type: "file" | "directory";
	children?: readonly FileNode[];
}

export interface GetStatusMessage extends MessageEnvelope<"GET_STATUS", EmptyPayload> {}

export interface StatusUpdateMessage
	extends MessageEnvelope<
		"STATUS_UPDATE",
		{
			status: Status;
			message?: string;
		}
	> {}

export interface ConfigUpdateMessage
	extends MessageEnvelope<"CONFIG_UPDATE", { config: AppConfig }> {}

export interface UpdateConfigMessage
	extends MessageEnvelope<"UPDATE_CONFIG", { config: Partial<AppConfig> }> {}

export interface SyncPatternMessage
	extends MessageEnvelope<
		"SYNC_PATTERN",
		{
			pattern: string;
			direction: SyncDirection;
		}
	> {}

export interface SyncCompleteMessage
	extends MessageEnvelope<
		"SYNC_COMPLETE",
		{
			filesProcessed: number;
			filesModified: number;
			filesConflicted: number;
			duration: number;
		}
	> {}

export interface SyncErrorMessage
	extends MessageEnvelope<
		"SYNC_ERROR",
		{
			error: string;
			details?: SyncErrorDetails;
		}
	> {}

export interface TreeRefreshMessage
	extends MessageEnvelope<"TREE_REFRESH", { tree: readonly FileNode[] }> {}

export type ExtensionMessage =
	| StatusUpdateMessage
	| ConfigUpdateMessage
	| SyncCompleteMessage
	| SyncErrorMessage
	| TreeRefreshMessage;

export type WebviewMessage =
	| GetStatusMessage
	| UpdateConfigMessage
	| SyncPatternMessage
	| TreeRefreshMessage;
