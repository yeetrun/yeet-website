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
      "Run the compose file you already have. Pull and redeploy when it changes.",
    code: `yeet run <svc> ./compose.yml
yeet run --pull <svc> ./compose.yml
yeet logs -f <svc>`,
  },
  {
    id: "dockerfile",
    title: "Dockerfile",
    description:
      "Hand yeet a Dockerfile. The host builds it and runs the result.",
    code: `yeet run <svc> ./Dockerfile
yeet status <svc>`,
  },
  {
    id: "vm",
    title: "Linux VM",
    description:
      "Create a Firecracker guest when a container is the wrong box for the job.",
    code: `yeet run <vm> vm://ubuntu/26.04
yeet ssh <vm>
yeet vm console <vm>`,
  },
  {
    id: "binary",
    title: "Binary",
    description:
      "Build the Linux binary locally. Install it as a boring service.",
    code: `GOOS=linux GOARCH=amd64 go build -o ./bin/<svc>
yeet run <svc> ./bin/<svc>
yeet logs -f <svc>`,
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
        title:
          "yeet: Homelab Service Manager for Containers, VMs, and Binaries",
        description:
          "Run containers, VMs, binaries, scripts, and cron jobs on Linux hosts you control, without building a tiny cloud by accident.",
        path: "/",
      }}
    >
      <main className={s.homePage}>
        <section className={s.hero}>
          <GridContainer className={s.heroGrid}>
            <div className={s.heroContent}>
              <div className={s.heroBadge}>
                Linux hosts you control. No tiny cloud required.
              </div>
              <H1 className={s.heroTitle}>
                Run services and VMs on your own Linux hosts.
              </H1>
              <P className={s.heroSubtitle} weight="regular">
                Yeet runs on your workstation. The catch daemon runs on the
                host. Together they deploy compose stacks, images, Dockerfiles,
                binaries, scripts, cron jobs, and Firecracker VMs over your
                tailnet. The result is ordinary Linux state: systemd units,
                Docker projects, files, logs, and VM data you can inspect
                directly.
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
                <strong>Read this first:</strong> Yeet is for single-operator
                homelabs and small private infrastructure. It expects Linux, SSH
                for first setup, systemd, Tailscale or tsnet connectivity, and
                Docker when you run container payloads. It is not a multi-tenant
                platform. That boundary is intentional.
              </div>
            </div>

            <div className={s.heroPanel}>
              <div className={s.panelHeader}>First useful run</div>
              <CodeBlock>
                <code>{`# install yeet
curl -fsSL https://yeetrun.com/install.sh | sh

# bootstrap a host
yeet init root@<machine-host>

# deploy a compose stack
yeet run <svc> ./compose.yml

# create a VM
yeet run <vm> vm://ubuntu/26.04
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
                Use the terminal when you know the shape. Use the browser when
                you do not.
              </H2>
              <P>
                The CLI is fastest when the command is already in your hands.{" "}
                <code>yeet run --web</code> gives you a guided deploy for the
                first pass, saves the same config to <code>yeet.toml</code>, and
                mirrors terminal output in the browser. Same machinery, less
                flag archaeology.
              </P>
              <pre className={s.deployCode}>
                <code>{`yeet run --web
yeet run <svc> ./compose.yml`}</code>
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
            <H2>The moving parts</H2>
            <P>There are not many. That is the point.</P>
          </div>
          <div className={s.featureGrid}>
            <div className={s.featureCard}>
              <h3>yeet CLI</h3>
              <p>
                Your local control surface. It packages payloads, writes{" "}
                <code>yeet.toml</code>, and sends work to catch.
              </p>
            </div>
            <div className={s.featureCard}>
              <h3>catch on each host</h3>
              <p>
                The small daemon on the host. It owns systemd units, Docker
                projects, logs, files, and cleanup.
              </p>
            </div>
            <div className={s.featureCard}>
              <h3>Tailnet connection</h3>
              <p>
                SSH installs catch. After that, yeet talks to catch through
                embedded Tailscale nodes.
              </p>
            </div>
            <div className={s.featureCard}>
              <h3>Local image push</h3>
              <p>
                For images that only exist on your workstation. Push them to the
                host, then run the thing you actually built.
              </p>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper className={s.sectionAlt}>
          <div className={s.sectionHeader}>
            <H2>Bring the thing you already have</H2>
            <P>
              Compose file, Dockerfile, VM image, binary. Yeet routes the work.
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
                Choose containers, VMs, binaries, scripts, or cron jobs by what
                the workload needs.
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
