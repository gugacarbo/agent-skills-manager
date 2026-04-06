import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
	docsSidebar: [
		{
			type: "category",
			label: "Início",
			items: ["intro"],
		},
		{
			type: "category",
			label: "Design",
			items: [
				"architecture",
				"supported-formats",
				"sync-destinations",
			],
		},
		{
			type: "category",
			label: "Guia do Usuário",
			items: ["getting-started", "configuration", "treeview", "commands"],
		},
		{
			type: "category",
			label: "Desenvolvimento",
			items: [
				"project-structure",
				"internal-components",
				"development-phases",
				"testing",
			],
		},
		{
			type: "category",
			label: "Referência",
			items: ["glossary"],
		},
	],
};

export default sidebars;
