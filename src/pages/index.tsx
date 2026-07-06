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
import s from "./Home.module.css";

const payloadChips = [
  "Compose",
  "Dockerfile",
  "Image",
  "Binary",
  "Cron",
  "microVM",
];

const proofPoints = [
  {
    title: "Bring what you have",
    text: "Compose app, Dockerfile, image ref, binary, script, cron job, or microVM. Yeet should not make you repackage it before it can run.",
  },
  {
    title: "Use normal Linux parts",
    text: "Catch sets up pieces Linux already knows how to run: systemd units and timers, Docker/Compose projects, network namespaces, service directories or ZFS datasets, and Firecracker VM disks.",
  },
  {
    title: "Service management",
    text: "Catch handles generations, status, logs, port changes, service networks, per-service Tailscale identities, ZFS roots, and recovery snapshots.",
  },
  {
    title: "Declarative config",
    text: "Keep payload files and yeet.toml in one service workspace. The config records the host, payload, ports, service root, snapshots, and deploy shape.",
  },
];

const docsLinks = [
  {
    href: "/docs/getting-started/quick-start",
    title: "Quick Start",
    text: "Install yeet, bootstrap catch, and deploy a first disposable service.",
  },
  {
    href: "/docs/payloads",
    title: "Payloads",
    text: "Pick the right shape for containers, binaries, cron jobs, and VMs.",
  },
  {
    href: "/docs/concepts/networking",
    title: "Networking",
    text: "Use service networks, LAN or VLAN presence, and Tailscale identities.",
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
  return (
    <NavFooterLayout
      docsNavTree={docsNavTree}
      meta={{
        title: "yeet: FOSS Homelab CLI for Containers, Binaries, and MicroVMs",
        description:
          "A lightweight FOSS CLI for deploying binaries, compose files, Docker images, cron jobs, and microVMs to Linux hosts.",
        path: "/",
      }}
    >
      <main className={s.homePage}>
        <section className={s.hero}>
          <GridContainer className={s.heroGrid}>
            <div className={s.heroContent}>
              <div className={s.heroBadge}>
                Containers, binaries, and microVMs from one CLI.
              </div>
              <H1 className={s.heroTitle}>
                Yeet your homelab.
                <span>Your service just runs.</span>
              </H1>
              <P className={s.heroSubtitle} weight="regular">
                Point yeet at a Linux host and deploy from your workstation.
                Bring the payload you already have; catch turns the host into
                the service layer instead of making you build one first.
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
              <div className={s.payloadStrip} aria-label="Supported payloads">
                {payloadChips.map((chip) => (
                  <span key={chip} className={s.payloadChip}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className={s.heroPanel}>
              <div className={s.panelHeader}>Yeet it up</div>
              <CodeBlock>
                <code>{`yeet init root@<host>
yeet run app ./compose.yml
yeet logs -f app
yeet rm app`}</code>
              </CodeBlock>
              <div className={s.panelFooter}>
                The local CLI hands the payload to catch. The service runs on
                the host.
              </div>
            </div>
          </GridContainer>
        </section>

        <SectionWrapper className={s.sectionTight}>
          <div className={s.truthGrid}>
            <div className={s.truthIntro}>
              <H2>Why yeet exists</H2>
              <P>
                Proxmox and Unraid are useful when you want an appliance. Yeet
                is for the other case: you have a Linux box and something to
                run. The workflow stays local and declarative: pick the thing
                you want to deploy, point <code>yeet run</code> at it, and let
                catch do the host-side work. No control panel first. No
                rebuilding half a cloud just to ship one app. Just yeet it and
                let it run.
              </P>
            </div>
            <div className={s.truthList}>
              {proofPoints.map((point) => (
                <div key={point.title} className={s.truthItem}>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper className={s.webSection}>
          <div className={s.webProof}>
            <div className={s.webCopy}>
              <H2>CLI first. Web when useful.</H2>
              <P>
                <code>yeet run</code> is the normal path when you know the
                shape. Add <code>--web</code> when you want a local form instead
                of memorizing every flag: service name, payload, storage, ports,
                and network settings. It writes the same declarative{" "}
                <code>yeet.toml</code> and streams the deploy output.
              </P>
            </div>
            <figure className={s.webRunShotFrame}>
              <Image
                className={s.webRunShot}
                src="/images/web-run-deploy.png"
                alt="The yeet web deploy form configuring a new service"
                width={1440}
                height={965}
              />
            </figure>
          </div>
        </SectionWrapper>

        <SectionWrapper className={s.sectionTight}>
          <div className={s.docsHeader}>
            <H2>Read what you need next.</H2>
            <P>
              Start with the shortest path. Add host, payload, and network
              details only when you need them.
            </P>
          </div>
          <div className={s.docsGrid}>
            {docsLinks.map((doc) => (
              <Link key={doc.href} className={s.docsCard} href={doc.href}>
                <h3>{doc.title}</h3>
                <p>{doc.text}</p>
              </Link>
            ))}
          </div>
        </SectionWrapper>
      </main>
    </NavFooterLayout>
  );
}
