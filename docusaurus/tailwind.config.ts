import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./docs/**/*.{md,mdx}",
		"./docusaurus.config.ts",
	],
	theme: {
		extend: {},
	},
} satisfies Config;
