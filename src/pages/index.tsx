import { ButtonLink } from "@/components/link";
import { H1, H2, P } from "@/components/text";
import GridContainer from "@/components/grid-container";
import SectionWrapper from "@/components/section-wrapper";
import NavFooterLayout from "@/layouts/nav-footer-layout";
import { loadDocsNavTreeData } from "@/lib/fetch-nav";
import { DOCS_DIRECTORY } from "./docs/[...path]";
import { NavTreeNode } from "@/components/nav-tree";
import CodeBlock from "@/components/codeblock";
import Link from "next/link";
import s from "./Home.module.css";

export async function getStaticProps() {
  return {
    props: {
      docsNavTree: await loadDocsNavTreeData(DOCS_DIRECTORY, ""),
    },
  };
}

interface HomePageProps {
  docsNavTree: NavTreeNode[];
}

export default function Home({ docsNavTree }: HomePageProps) {
  return (
    <NavFooterLayout
      docsNavTree={docsNavTree}
      meta={{
        title: "yeet",
        description:
          "Homelab service manager over Tailscale RPC for shipping services to remote hosts.",
      }}
    >
      <main className={s.homePage}>
        <section className={s.hero}>
          <GridContainer className={s.heroGrid}>
            <div className={s.heroContent}>
              <div className={s.heroBadge}>
                Homelab-first • Tailscale RPC • Docker + systemd
              </div>
              <H1 className={s.heroTitle}>Ship services fast with yeet.</H1>
              <P className={s.heroSubtitle} weight="regular">
                Yeet is a lightweight client + server setup for deploying and
                managing services on remote Linux hosts. It’s optimized for a
                personal homelab: fast workflows, minimal ceremony, and a tight
                CLI that ships binaries, Dockerfiles, compose stacks, and images
                over your tailnet.
              </P>
              <div className={s.heroActions}>
                <ButtonLink
                  href="/docs/getting-started/quick-start"
                  text="Quick Start"
                  size="large"
                />
                <ButtonLink
                  href="/install"
                  text="Install"
                  size="large"
                  theme="neutral"
                />
              </div>
              <div className={s.heroNote}>
                <strong>Read this first:</strong> Yeet is personal infrastructure
                tooling tuned for a specific homelab. Use it as reference or a
                starting point, not a general-purpose platform.
              </div>
            </div>

            <div className={s.heroPanel}>
              <div className={s.panelHeader}>Quick bootstrap</div>
              <CodeBlock>
                <code>{`# install yeet
curl -fsSL https://yeetrun.com/install.sh | sh

# bootstrap a host
yeet init root@<host>

# deploy a compose stack
yeet run <svc> ./compose.yml --net=svc,ts`}</code>
              </CodeBlock>
              <div className={s.panelFooter}>
                Want the full workflow? Read the{" "}
                <Link href="/docs/operations/workflows">Workflows guide</Link>.
              </div>
            </div>
          </GridContainer>
        </section>

        <SectionWrapper className={s.section}>
          <div className={s.sectionHeader}>
            <H2>Core pieces</H2>
            <P>Yeet keeps the surface area small and explicit.</P>
          </div>
          <div className={s.featureGrid}>
            <div className={s.featureCard}>
              <h3>yeet CLI</h3>
              <p>Packages payloads, ships artifacts, and drives the workflow.</p>
            </div>
            <div className={s.featureCard}>
              <h3>catch daemon</h3>
              <p>Installs, runs, and monitors services on each host.</p>
            </div>
            <div className={s.featureCard}>
              <h3>catchrpc</h3>
              <p>JSON-RPC + streaming exec/events over your tailnet.</p>
            </div>
            <div className={s.featureCard}>
              <h3>Internal registry</h3>
              <p>Push local images once, run them on the host immediately.</p>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper className={s.sectionAlt}>
          <div className={s.sectionHeader}>
            <H2>Common workflows</H2>
            <P>Run what you already have. Yeet detects the payload type.</P>
          </div>
          <div className={s.workflowGrid}>
            <div className={s.workflowCard}>
              <h3>Compose stack</h3>
              <pre>
                <code>{`yeet run <svc> ./compose.yml
yeet run --pull <svc> ./compose.yml`}</code>
              </pre>
            </div>
            <div className={s.workflowCard}>
              <h3>Dockerfile</h3>
              <pre>
                <code>{`yeet run <svc> ./Dockerfile`}</code>
              </pre>
            </div>
            <div className={s.workflowCard}>
              <h3>Binary</h3>
              <pre>
                <code>{`GOOS=linux GOARCH=amd64 go build -o ./bin/<svc>
yeet run <svc> ./bin/<svc>`}</code>
              </pre>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper className={s.section}>
          <div className={s.sectionHeader}>
            <H2>Explore the docs</H2>
            <P>Everything from quick start to CLI references and networking.</P>
          </div>
          <div className={s.docsGrid}>
            <Link
              className={s.docsCard}
              href="/docs/getting-started/quick-start"
            >
              <h3>Quick Start</h3>
              <p>Fastest path to a working deployment.</p>
            </Link>
            <Link
              className={s.docsCard}
              href="/docs/getting-started/installation"
            >
              <h3>Installation</h3>
              <p>Toolchain setup, install flows, and Docker requirements.</p>
            </Link>
            <Link className={s.docsCard} href="/docs/cli/cli-overview">
              <h3>CLI Overview</h3>
              <p>Command model, global flags, and routing behavior.</p>
            </Link>
            <Link className={s.docsCard} href="/docs/operations/workflows">
              <h3>Workflows</h3>
              <p>Day‑to‑day deploy, update, and maintenance flows.</p>
            </Link>
          </div>
        </SectionWrapper>
      </main>
    </NavFooterLayout>
  );
}
