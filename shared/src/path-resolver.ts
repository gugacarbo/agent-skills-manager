import * as os from "os";
import * as path from "path";
import type * as vscode from "vscode";

/**
 * Expands path aliases in the given path string
 * @param pathString The path string that may contain aliases
 * @param workspaceFolder Optional workspace folder to use for ${workspaceFolder} resolution
 * @returns The path with all aliases expanded
 */
export function expandPathAliases(
	pathString: string,
	workspaceFolder?: vscode.WorkspaceFolder,
): string {
	let result = pathString;

	// Expand ${workspaceFolder} if workspace folder is provided
	if (workspaceFolder) {
		result = result.replace(
			/\$\{workspaceFolder\}/g,
			workspaceFolder.uri.fsPath,
		);
	}

	// Expand ${userSettingsFolder} - VS Code settings directory
	const userSettingsFolder = getUserSettingsFolder();
	result = result.replace(/\$\{userSettingsFolder\}/g, userSettingsFolder);

	// Expand ${userHome} - User's home directory
	const userHome = os.homedir();
	result = result.replace(/\$\{userHome\}/g, userHome);

	// Expand ${userDesktop} - User's desktop directory
	const userDesktop = path.join(userHome, "Desktop");
	result = result.replace(/\$\{userDesktop\}/g, userDesktop);

	// Expand ${userDocuments} - User's documents directory
	const userDocuments = getUserDocumentsFolder();
	result = result.replace(/\$\{userDocuments\}/g, userDocuments);

	// Expand ${userDownloads} - User's downloads directory
	const userDownloads = getUserDownloadsFolder();
	result = result.replace(/\$\{userDownloads\}/g, userDownloads);

	// Expand ~ to home directory
	if (result.startsWith("~/") || result === "~") {
		result = result.replace("~", userHome);
	}

	return result;
}

/**
 * Gets the VS Code user settings folder path
 * @returns Path to the VS Code user settings folder
 */
function getUserSettingsFolder(): string {
	const homedir = os.homedir();

	if (process.platform === "win32") {
		return path.join(homedir, "AppData", "Roaming", "Code", "User");
	} else if (process.platform === "darwin") {
		return path.join(homedir, "Library", "Application Support", "Code", "User");
	} else {
		return path.join(homedir, ".config", "Code", "User");
	}
}

/**
 * Gets the user's documents folder path
 * @returns Path to the user's documents folder
 */
function getUserDocumentsFolder(): string {
	const homedir = os.homedir();

	if (process.platform === "win32") {
		return path.join(homedir, "Documents");
	} else if (process.platform === "darwin") {
		return path.join(homedir, "Documents");
	} else {
		// On Linux, Documents folder might be localized, try common paths
		const documentsPath = path.join(homedir, "Documents");

		// Check if Documents folder exists, otherwise fall back to home
		try {
			const fs = require("fs");
			if (fs.existsSync(documentsPath)) {
				return documentsPath;
			}
		} catch {
			// If we can't check existence, return the default path
		}

		return documentsPath;
	}
}

/**
 * Gets the user's downloads folder path
 * @returns Path to the user's downloads folder
 */
function getUserDownloadsFolder(): string {
	const homedir = os.homedir();

	if (process.platform === "win32") {
		return path.join(homedir, "Downloads");
	} else if (process.platform === "darwin") {
		return path.join(homedir, "Downloads");
	} else {
		// On Linux, Downloads folder might be localized, try common paths
		const downloadsPath = path.join(homedir, "Downloads");

		// Check if Downloads folder exists, otherwise fall back to home
		try {
			const fs = require("fs");
			if (fs.existsSync(downloadsPath)) {
				return downloadsPath;
			}
		} catch {
			// If we can't check existence, return the default path
		}

		return downloadsPath;
	}
}
