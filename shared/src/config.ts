/**
 * Shared app configuration contract.
 *
 * TODO: Wire this into VS Code settings integration.
 * TODO: Apply the ADR-018 validation-error behavior when config parsing fails.
 */
export interface AppConfig {
	agent: string;
	syncDirection: "push" | "pull" | "both";
	autoSync: boolean;
	debounceMs: number;
	logLevel: "debug" | "info" | "warn" | "error";
	logToFile: boolean;
}
