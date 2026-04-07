import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import type { ReactNode } from "react";
import styles from "./index.module.css";

function HomepageHeader(): ReactNode {
	const { siteConfig } = useDocusaurusContext();
	return (
		<header className={`hero ${styles.hero} pb-64`}>
			<div className="container">
				<Heading as="h1" className={`hero__title ${styles.hero__title}`}>
					🤖 {siteConfig.title}
				</Heading>
				<p className={`hero__subtitle ${styles.hero__subtitle}`}>
					{siteConfig.tagline}
				</p>
				<div className={`hero__buttons ${styles.hero__buttons}`}>
					{" "}
					<Link
						className="button button--secondary button--lg"
						to="/docs/planning/architecture-and-dev-guide"
					>
						📖 Documentação
					</Link>
					<Link
						className="button button--outline button--lg"
						to="/docs/planning/architecture-and-dev-guide"
					>
						🚀 Primeiros Passos
					</Link>
				</div>
				<div className={styles.techBadges}>
					<span className={styles.techBadge}>⚡ VS Code Extension</span>
					<span className={styles.techBadge}>📦 TypeScript</span>
					<span className={styles.techBadge}>🤖 Claude Desktop</span>
					<span className={styles.techBadge}>🐙 GitHub Copilot</span>
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
		<div className={styles.featureCard}>
			<span className={styles.featureIcon}>{icon}</span>
			<h3>{title}</h3>
			<p>{description}</p>
		</div>
	);
}

function HomepageFeatures(): ReactNode {
	return (
		<section className={styles.featuresSection}>
			<div className="container">
				<div className={styles.sectionHeader}>
					<h2>Recursos Principais</h2>
					<p>
						Tudo que você precisa para gerenciar skills de IA com eficiência e
						segurança.
					</p>
				</div>
				<div className={styles.featureGrid}>
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

function QuickStart(): ReactNode {
	return (
		<section className={styles.quickstartSection}>
			<div className="container">
				<h2>Quick Start</h2>
				<p>Configure em 4 passos simples.</p>
				<div className={styles.quickstartGrid}>
					<div className={styles.stepCard}>
						<h3>Configurar Source Path</h3>
						<p>
							Abra as settings (<code>Ctrl+,</code>) e defina{" "}
							<code>agentSkillsManager.skillSourcePath</code> com o caminho do
							seu repositório de skills.
						</p>
					</div>
					<div className={styles.stepCard}>
						<h3>Abrir a Sidebar</h3>
						<p>
							Clique no ícone <strong>Agent Skills</strong> na activity bar do
							VS Code para abrir o Skills Explorer.
						</p>
					</div>
					<div className={styles.stepCard}>
						<h3>Ativar Skills</h3>
						<p>
							Use o toggle (ícone de olho) na TreeView para ativar skills por
							workspace. Elas são sincronizadas automaticamente.
						</p>
					</div>
					<div className={styles.stepCard}>
						<h3>Configurar Destinos</h3>
						<p>
							Nas settings, defina <code>agentSkillsManager.destinations</code>{" "}
							para onde as skills serão copiadas (Claude, Copilot, custom).
						</p>
					</div>
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
