import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import type { ReactNode } from "react";

function HomepageHeader(): ReactNode {
	const { siteConfig } = useDocusaurusContext();
	return (
		<header
			className="hero py-16 px-5"
			style={{
				background:
					"linear-gradient(180deg, var(--ifm-color-primary-darkest) 0%, var(--ifm-background-color) 100%)",
			}}
		>
			<div className="container text-center">
				<Heading
					as="h1"
					className="hero__title text-6xl font-extrabold tracking-tight mb-4"
				>
					🤖 {siteConfig.title}
				</Heading>
				<p className="hero__subtitle text-xl max-w-xl mx-auto opacity-90 leading-relaxed">
					{siteConfig.tagline}
				</p>
				<div className="hero__buttons flex gap-4 mt-8 justify-center flex-wrap">
					<Link
						className="button button--secondary button--lg"
						to="/docs/category/fase-1---core"
					>
						📖 Documentação
					</Link>
					<Link
						className="button button--outline button--lg"
						to="/docs/category/01-shared"
					>
						🚀 Primeiros Passos
					</Link>
				</div>
				<div className="flex justify-center gap-3 mt-10 flex-wrap">
					<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25">
						⚡ VS Code Extension
					</span>
					<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25">
						📦 TypeScript
					</span>
					<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25">
						🤖 Claude Desktop
					</span>
					<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25">
						🐙 GitHub Copilot
					</span>
				</div>
			</div>
		</header>
	);
}

function Feature({
	icon,
	title,
	description,
}: {
	icon: string;
	title: string;
	description: string;
}): ReactNode {
	return (
		<div className="p-8 rounded-xl border border-(--ifm-color-emphasis-200) bg-(--ifm-background-color) transition-all duration-250 ease-out hover:border-(--ifm-color-primary) hover:shadow-lg hover:shadow-[rgba(0,122,204,0.12)] hover:-translate-y-0.5">
			<span className="text-4xl mb-4 block">{icon}</span>
			<h3 className="text-lg font-bold mb-2">{title}</h3>
			<p className="text-sm text-(--ifm-color-emphasis-700) leading-relaxed">
				{description}
			</p>
		</div>
	);
}

function HomepageFeatures(): ReactNode {
	return (
		<section className="py-20">
			<div className="container max-w-5xl mx-auto px-4">
				<div className="text-center mb-14">
					<h2 className="text-3xl font-bold mb-3">Recursos Principais</h2>
					<p className="text-lg text-(--ifm-color-emphasis-600) max-w-xl mx-auto">
						Tudo que você precisa para gerenciar arquivos de agentes de IA
						(skills, rules, agents.md, prompts.md, etc.) com eficiência e
						segurança, incluindo seleção de padrões de salvamento para
						diferentes plataformas (Claude, Copilot, etc.).
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Feature
						icon="📁"
						title="Repositório Git como Fonte"
						description="Todas as suas skills ficam versionadas em um repositório git. Compartilhe, clone e sincronize entre máquinas naturalmente."
					/>
					<Feature
						icon="🔄"
						title="Sync Automático"
						description="Quando uma skill é modificada no repositório-fonte, a extensão copia automaticamente para Claude Desktop, Copilot e outros destinos."
					/>
					<Feature
						icon="🌳"
						title="TreeView Interativa"
						description="Interface visual na sidebar do VS Code para explorar, ativar, desativar, criar e editar skills com poucos cliques."
					/>
					<Feature
						icon="✅"
						title="Validação Inteligente"
						description="Validação de frontmatter YAML em tempo real com Diagnostics API. IntelliSense para campos obrigatórios e formatos suportados."
					/>
					<Feature
						icon="🎯"
						title="Ativação por Workspace"
						description="Repositório global de skills, mas cada projeto escolhe quais estão ativas. Configuração salva no storage da extensão."
					/>
					<Feature
						icon="🛡️"
						title="Segurança em Primeiro Lugar"
						description="Nunca sobrescreve arquivos manuais. Arquivos gerenciados são marcados com header de identificação. Conflitos são detectados e reportados."
					/>
				</div>
			</div>
		</section>
	);
}

function StepCard({
	number,
	title,
	children,
}: {
	number: number;
	title: string;
	children: React.ReactNode;
}): ReactNode {
	return (
		<div className="relative p-6 rounded-xl border border-(--ifm-color-emphasis-200) transition-colors hover:border-(--ifm-color-primary) dark:border-(--ifm-color-emphasis-300)">
			<span className="absolute -top-2.5 left-5 flex items-center justify-center w-5 h-5 rounded-full bg-(--ifm-color-primary) text-white text-xs font-bold">
				{number}
			</span>
			<h3 className="text-sm font-bold mb-2">{title}</h3>
			<div className="text-xs text-(--ifm-color-emphasis-700) leading-relaxed">
				{children}
			</div>
		</div>
	);
}

function QuickStart(): ReactNode {
	return (
		<section className="py-20">
			<div className="container max-w-3xl mx-auto px-4">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold mb-3">Quick Start</h2>
					<p className="text-(--ifm-color-emphasis-600)">
						Configure em 4 passos simples.
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<StepCard number={1} title="Configurar Source Path">
						Abra as settings (<code>Ctrl+,</code>) e defina{" "}
						<code>agentSkillsManager.skillSourcePath</code> com o caminho do seu
						repositório de arquivos de agentes de IA.
					</StepCard>
					<StepCard number={2} title="Abrir a Sidebar">
						Clique no ícone <strong>Agent Skills</strong> na activity bar do VS
						Code para abrir o Skills Explorer.
					</StepCard>
					<StepCard number={3} title="Ativar Skills">
						Use o toggle (ícone de olho) na TreeView para ativar skills por
						workspace. Elas são sincronizadas automaticamente.
					</StepCard>
					<StepCard number={4} title="Configurar Destinos">
						Nas settings, defina <code>agentSkillsManager.destinations</code>{" "}
						para onde as skills serão copiadas.
					</StepCard>
				</div>
			</div>
		</section>
	);
}

export default function Home(): ReactNode {
	const { siteConfig } = useDocusaurusContext();
	return (
		<Layout title={siteConfig.title} description={siteConfig.tagline}>
			<HomepageHeader />
			<main>
				<HomepageFeatures />
				<QuickStart />
			</main>
		</Layout>
	);
}
