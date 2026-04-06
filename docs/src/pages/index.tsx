import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import type { ReactNode } from "react";

function HomepageHeader() {
	const { siteConfig } = useDocusaurusContext();
	return (
		<header className="hero hero--primary">
			<div className="container">
				<Heading as="h1" className="hero__title">
					🤖 {siteConfig.title}
				</Heading>
				<p className="hero__subtitle">{siteConfig.tagline}</p>
				<div className="hero__buttons">
					<Link
						className="button button--secondary button--lg"
						to="/docs/intro"
					>
						📖 Começar a Documentação
					</Link>
					<Link
						className="button button--outline button--lg"
						to="/docs/getting-started"
					>
						🚀 Primeiros Passos
					</Link>
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
}) {
	return (
		<div className="col col--4 feature-item">
			<div className="feature-icon">{icon}</div>
			<h3>{title}</h3>
			<p>{description}</p>
		</div>
	);
}

function HomepageFeatures(): ReactNode {
	return (
		<section className="features-section">
			<div className="container">
				<div className="row">
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
				</div>
				<div className="row">
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

export default function Home(): ReactNode {
	const { siteConfig } = useDocusaurusContext();
	return (
		<Layout
			title={siteConfig.title}
			description="Gerencie, sincronize e valide skills de agentes de IA (Claude Desktop, VS Code Copilot) a partir de um repositório git central."
		>
			<HomepageHeader />
			<HomepageFeatures />
		</Layout>
	);
}
