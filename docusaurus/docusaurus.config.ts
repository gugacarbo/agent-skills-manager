import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
	title: "Agent Skills Manager",
	tagline:
		"Gerencie, sincronize e valide arquivos de agentes de IA com suporte a múltiplos padrões de salvamento (Claude, Copilot, etc.)",
	favicon: "img/favicon.ico",

	future: {
		v4: true,
	},

	onBrokenLinks: "warn",

	url: "https://gugacarbo.github.io/",
	baseUrl: "/agent-skills-manager/",
	i18n: {
		defaultLocale: "pt-BR",
		locales: ["pt-BR"],
	},

	presets: [
		[
			"classic",
			{
				docs: {
					sidebarPath: "./sidebars.ts",
					editUrl:
						"https://github.com/gugacarbo/agent-skills-manager/tree/main/docusaurus/",
					showLastUpdateAuthor: false,
					showLastUpdateTime: true,
				},
				theme: {
					customCss: "./src/css/custom.css",
				},
			} satisfies Preset.Options,
		],
	],
	markdown: {
		mermaid: true,
	},
	themes: ["@docusaurus/theme-mermaid"],

	themeConfig: {
		colorMode: {
			respectPrefersColorScheme: true,
		},
		navbar: {
			title: "Agent Skills Manager",
			logo: {
				alt: "Agent Skills Manager Logo",
				src: "img/logo.svg",
			},
			items: [
				{
					type: "docSidebar",
					sidebarId: "docsSidebar",
					position: "left",
					label: "Documentação",
				},
			],
		},
		footer: {
			style: "dark",
			copyright: `Copyright © ${new Date().getFullYear()} Agent Skills Manager. Built with Docusaurus.`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,
};

export default config;
