/**
 * Shared Zod schemas.
 *
 * TODO: Replace these placeholders with the full schema set once the shared
 * contracts are finalized.
 */

import { z } from "zod";

export const statusSchema = z.enum(["idle", "syncing", "error"]);
export const syncDirectionSchema = z.enum(["push", "pull", "both"]);

export const emptyPayloadSchema = z.object({});

export const messageEnvelopeSchema = z.object({
	type: z.string(),
	payload: z.object({}).passthrough(),
});

export const appConfigSchema = z.object({}).passthrough();
export const fileNodeSchema = z.object({}).passthrough();
export const syncErrorDetailsSchema = z.object({}).passthrough();
