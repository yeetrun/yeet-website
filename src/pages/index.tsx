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
import Image from "next/image";
import { useState } from "react";
import s from "./Home.module.css";

const commonWorkflows = [
  {
    id: "compose",
    title: "Compose stack",
    description:
      "Bring the compose file you already have. Yeet keeps the deploy recipe.",
    code: `yeet run <svc> ./compose.yml
yeet run --pull <svc> ./compose.yml
yeet logs -f <svc>`,
  },
  {
    id: "dockerfile",
    title: "Dockerfile",
    description:
      "Build locally, push to the host, and run the resulting image.",
    code: `yeet run <svc> ./Dockerfile
yeet status <svc>`,
  },
  {
    id: "vm",
    title: "MicroVM",
    description:
      "Run Ubuntu, NixOS, or an imported image when you need a full OS.",
    code: `yeet vm images catalog
yeet run <vm> vm://ubuntu/26.04
yeet run <vm> vm://nixos/26.05
yeet ssh <vm>
yeet vm images import lab/debian ./dist/my-vm`,
  },
  {
    id: "binary",
    title: "Binary",
    description:
      "Ship one executable or script as a plain systemd service.",
    code: `GOOS=linux GOARCH=amd64 go build -o ./bin/<svc>
yeet run <svc> ./bin/<svc>
yeet logs -f <svc>`,
  },
  {
    id: "cron",
    title: "Cron job",
    description:
      "Install a scheduled script or binary as a systemd timer.",
    code: `yeet cron <svc> ./job.sh "0 3 * * *"
yeet logs -f <svc>
yeet rm <svc>`,
  },
];

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
  const [activeWorkflowId, setActiveWorkflowId] = useState(
    commonWorkflows[0].id,
  );
  const activeWorkflow =
    commonWorkflows.find((workflow) => workflow.id === activeWorkflowId) ??
    commonWorkflows[0];

  return (
    <NavFooterLayout
      docsNavTree={docsNavTree}
      meta={{
        title: "yeet: FOSS Homelab CLI for Containers, VMs, and Cron",
        description:
          "A lightweight FOSS CLI for deploying containers, binaries, cron jobs, and microVMs to ordinary Linux hosts.",
        path: "/",
      }}
    >
      <main className={s.homePage}>
        <section className={s.hero}>
          <GridContainer className={s.heroGrid}>
            <div className={s.heroContent}>
              <div className={s.heroBadge}>
                FOSS homelab ops without the appliance.
              </div>
              <H1 className={s.heroTitle}>
                Yeet workloads onto Linux. Skip the platform.
              </H1>
              <P className={s.heroSubtitle} weight="regular">
                Start with a Debian or Ubuntu host and a local CLI instead of a
                control panel. Send yeet a binary, script, Docker image,
                Dockerfile, compose.yml, cron job, or microVM. Ubuntu and NixOS
                work out of the box; custom images import as{" "}
                <code>vm://&lt;name&gt;</code>. Catch turns the payload into
                inspectable Linux state: systemd units, Docker projects,
                service networks, Tailscale identities, ZFS-backed roots, logs,
                and cleanup.
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
                This is the anti-clickops path for single-operator homelabs and
                small private infrastructure: declarative config, mesh
                networking, ZFS support when you want it, and normal Linux
                underneath. Not a multi-tenant cloud in a box.
              </div>
            </div>

            <div className={s.heroPanel}>
              <div className={s.panelHeader}>Yeet it up</div>
              <CodeBlock>
                <code>{`# install yeet
curl -fsSL https://yeetrun.com/install.sh | sh

# bootstrap a host
yeet init root@<machine-host>

# deploy whatever shape you already have
yeet run <svc> ./compose.yml
yeet run <svc> ./Dockerfile
yeet cron <job> ./backup.sh "0 3 * * *"
yeet run <vm> vm://ubuntu/26.04
yeet run <vm> vm://nixos/26.05
yeet ssh <vm>`}</code>
              </CodeBlock>
              <div className={s.panelFooter}>
                Need the setup details before touching a host? Read the{" "}
                <Link href="/docs/getting-started/quick-start">
                  Quick Start
                </Link>
                .
              </div>
            </div>
          </GridContainer>
        </section>

        <SectionWrapper className={s.section}>
          <div className={s.deployPaths}>
            <div className={s.deployCopy}>
              <H2>
                CLI first. Browser optional. The recipe stays declarative.
              </H2>
              <P>
                The durable object is <code>yeet.toml</code>, not a trail of
                clicks. Use the terminal when you already know the payload,
                network mode, and storage root. Use <code>yeet run --web</code>
                when you want a guided first pass. It saves the same config and
                mirrors terminal output in the browser.
              </P>
              <pre className={s.deployCode}>
                <code>{`yeet run <svc> ./compose.yml --net=svc,ts
yeet run <svc> ./compose.yml --service-root=tank/apps/<svc> --zfs
yeet vm images import lab/debian ./dist/my-vm
yeet run --web`}</code>
              </pre>
            </div>
            <figure className={s.webRunShotFrame}>
              <Image
                className={s.webRunShot}
                src="/images/web-run-deploy.png"
                alt="The yeet web deploy form configuring a new service"
                width={1440}
                height={963}
              />
            </figure>
          </div>
        </SectionWrapper>

        <SectionWrapper className={s.section}>
          <div className={s.sectionHeader}>
            <H2>Everything you need. Nothing that wants to become your cloud.</H2>
            <P>
              Yeet gives the boring host primitives a useful control plane
              without hiding the host from you.
            </P>
          </div>
          <div className={s.featureGrid}>
            <div className={s.featureCard}>
              <h3>Normal Linux underneath</h3>
              <p>
                Catch manages systemd units, Docker projects, VM data, logs,
                files, and cleanup on the host. You can still inspect the
                pieces directly.
              </p>
            </div>
            <div className={s.featureCard}>
              <h3>One CLI for every payload</h3>
              <p>
                Compose stacks, image refs, Dockerfiles, binaries, scripts,
                cron jobs, and microVMs all enter through the same workstation
                command model.
              </p>
            </div>
            <div className={s.featureCard}>
              <h3>Mesh networking built in</h3>
              <p>
                Catch joins your tailnet. Services can use private yeet DNS,
                LAN or VLAN presence, Tailscale identities, or combined modes
                when the access path needs it.
              </p>
            </div>
            <div className={s.featureCard}>
              <h3>ZFS when storage matters</h3>
              <p>
                Optional ZFS service roots give you dataset-backed app data,
                snapshots before risky changes, and faster VM disk clones.
              </p>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper className={s.sectionAlt}>
          <div className={s.sectionHeader}>
            <H2>Bring the thing you already have</H2>
            <P>
              Binary, script, Dockerfile, compose.yml, cron job, or microVM.
              Yeet routes the work to the boring host primitive that fits.
            </P>
          </div>
          <div className={s.workflowShell}>
            <div
              className={s.workflowList}
              role="tablist"
              aria-label="Common workflow examples"
            >
              {commonWorkflows.map((workflow) => {
                const isActive = workflow.id === activeWorkflow.id;
                return (
                  <button
                    key={workflow.id}
                    id={`workflow-tab-${workflow.id}`}
                    className={`${s.workflowTab} ${
                      isActive ? s.workflowTabActive : ""
                    }`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="workflow-panel"
                    onClick={() => setActiveWorkflowId(workflow.id)}
                  >
                    <span className={s.workflowTitle}>{workflow.title}</span>
                    <span className={s.workflowDescription}>
                      {workflow.description}
                    </span>
                  </button>
                );
              })}
            </div>
            <div
              className={s.workflowPanel}
              id="workflow-panel"
              role="tabpanel"
              aria-labelledby={`workflow-tab-${activeWorkflow.id}`}
            >
              <div className={s.workflowPanelHeader}>
                <h3>{activeWorkflow.title}</h3>
                <Link href="/docs/operations/workflows">Workflow docs</Link>
              </div>
              <CodeBlock>
                <code>{activeWorkflow.code}</code>
              </CodeBlock>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper className={s.section}>
          <div className={s.sectionHeader}>
            <H2>Docs for the next decision</H2>
            <P>
              Start with setup if the host is new. Jump to payloads or workflows
              when you already know what needs to run.
            </P>
          </div>
          <div className={s.docsGrid}>
            <Link
              className={s.docsCard}
              href="/docs/getting-started/quick-start"
            >
              <h3>Quick Start</h3>
              <p>Shortest path from empty host to a disposable service.</p>
            </Link>
            <Link
              className={s.docsCard}
              href="/docs/getting-started/installation"
            >
              <h3>Installation</h3>
              <p>
                Install yeet, bootstrap catch, and check the host assumptions.
              </p>
            </Link>
            <Link className={s.docsCard} href="/docs/payloads">
              <h3>Payloads</h3>
              <p>
                Choose containers, binaries, scripts, cron jobs, or microVMs by
                what the workload needs.
              </p>
            </Link>
            <Link className={s.docsCard} href="/docs/operations/workflows">
              <h3>Workflows</h3>
              <p>
                Deploy, update, tail logs, stage config, and clean up services.
              </p>
            </Link>
          </div>
        </SectionWrapper>
      </main>
    </NavFooterLayout>
  );
}
