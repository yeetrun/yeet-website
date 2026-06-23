import NavFooterLayout from "@/layouts/nav-footer-layout";
import { loadDocsNavTreeData } from "@/lib/fetch-nav";
import { DOCS_DIRECTORY } from "../docs/[...path]";
import { NavTreeNode } from "@/components/nav-tree";
import { H1, H2, P } from "@/components/text";
import CodeBlock from "@/components/codeblock";
import { ButtonLink } from "@/components/link";
import SectionWrapper from "@/components/section-wrapper";
import Link from "next/link";
import s from "./Install.module.css";

export async function getStaticProps() {
  return {
    props: {
      docsNavTree: await loadDocsNavTreeData(
        DOCS_DIRECTORY,
        "getting-started/installation",
      ),
    },
  };
}

interface InstallPageProps {
  docsNavTree: NavTreeNode[];
}

export default function InstallPage({ docsNavTree }: InstallPageProps) {
  return (
    <NavFooterLayout
      docsNavTree={docsNavTree}
      meta={{
        title: "Install yeet",
        description:
          "Install yeet locally, bootstrap catch on a host, and start deploying services.",
        path: "/install",
      }}
    >
      <main className={s.installPage}>
        <SectionWrapper>
          <header className={s.header}>
            <H1>Install yeet</H1>
            <P className={s.subtitle} weight="regular">
              Install the CLI on your laptop or workstation and bootstrap a
              Linux host running catch. Yeet embeds Tailscale via tsnet, so you
              don’t need Tailscale installed on either machine.
            </P>
            <div className={s.actions}>
              <ButtonLink
                href="/docs/getting-started/quick-start"
                text="Quick Start"
                size="large"
              />
              <ButtonLink
                href="/docs/getting-started/installation"
                text="Full Installation Guide"
                size="large"
                theme="neutral"
              />
              <ButtonLink
                href="/docs/getting-started/first-run-validation"
                text="Validate a Fresh Host"
                size="large"
                theme="neutral"
              />
            </div>
          </header>
        </SectionWrapper>

        <SectionWrapper>
          <div className={s.grid}>
            <section className={s.card}>
              <H2>Install yeet</H2>
              <P>Recommended release install:</P>
              <CodeBlock>
                <code>{`curl -fsSL https://yeetrun.com/install.sh | sh`}</code>
              </CodeBlock>
              <P className={s.note}>Nightly builds:</P>
              <CodeBlock>
                <code>{`curl -fsSL https://yeetrun.com/install.sh | sh -s -- --nightly`}</code>
              </CodeBlock>
              <P className={s.note}>
                For host setup details and upgrade commands, see the{" "}
                <Link href="/docs/getting-started/installation">
                  installation guide
                </Link>
                .
              </P>
            </section>

            <section className={s.card}>
              <H2>Bootstrap a host</H2>
              <P>
                Prepare the Tailscale tag policy first, then install catch on a
                remote Linux host via SSH. Interactive setup asks for the
                Tailscale OAuth client secret and can ask before installing
                missing Debian/Ubuntu packages.
              </P>
              <CodeBlock>
                <code>{`yeet init root@<machine-host>`}</code>
              </CodeBlock>
              <P className={s.note}>
                KVM-capable VM host, unattended package install:
              </P>
              <CodeBlock>
                <code>{`yeet init --install-vm-tools root@<machine-host>`}</code>
              </CodeBlock>
              <P className={s.note}>Unattended setup:</P>
              <CodeBlock>
                <code>{`yeet init --install-docker --install-vm-tools --ts-client-secret=<secret> root@<machine-host>`}</code>
              </CodeBlock>
              <P className={s.note}>
                The SSH target is the <strong>machine host</strong>. After
                install, yeet talks to the <strong>catch host</strong> (tsnet
                hostname).
              </P>
              <P className={s.note}>
                Next, run the{" "}
                <Link href="/docs/getting-started/first-run-validation">
                  first-run validation playbook
                </Link>{" "}
                to smoke-test the payload types your host supports.
              </P>
            </section>
          </div>
        </SectionWrapper>
      </main>
    </NavFooterLayout>
  );
}
