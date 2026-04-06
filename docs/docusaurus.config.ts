import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
	title: "Agent Skills Manager",
	tagline:
		"Gerencie, sincronize e valide skills de agentes de IA a partir de um repositório git central",
	favicon: "img/favicon.ico",

	future: {
		v4: true,
	},

	url: "https://your-docusaurus-site.example.com",
	baseUrl: "/",

	organizationName: "agent-skills-manager",
	projectName: "agent-skills-manager",

	onBrokenLinks: "throw",

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
					editUrl: "https://github.com/agent-skills-manager/docs/tree/main/",
				},
				blog: {
					showReadingTime: true,
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
				{ to: "/blog", label: "Blog", position: "left" },
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
