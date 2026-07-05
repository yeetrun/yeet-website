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
          "Install yeet on your workstation, install catch on a Linux host, and confirm the host is ready before deploying real services.",
        path: "/install",
      }}
    >
      <main className={s.installPage}>
        <SectionWrapper>
          <header className={s.header}>
            <H1>Install yeet</H1>
              <P className={s.subtitle} weight="regular">
                Install the CLI where you work. Then use SSH once to install catch
                on a Linux host. After that, yeet talks to the catch tsnet
                hostname. Your workstation still needs network reachability to
                that address.
              </P>
            <div className={s.actions}>
              <ButtonLink
                href="/docs/getting-started/quick-start"
                text="Quick Start"
                size="large"
              />
              <ButtonLink
                href="/docs/getting-started/installation"
                text="Installation Guide"
                size="large"
                theme="neutral"
              />
              <ButtonLink
                href="/docs/getting-started/first-run-validation"
                text="Validate Host"
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
              <P>Install the current release on your workstation:</P>
              <CodeBlock>
                <code>{`curl -fsSL https://yeetrun.com/install.sh | sh`}</code>
              </CodeBlock>
              <P className={s.note}>
                Use nightly when you need a fix that has not been tagged yet:
              </P>
              <CodeBlock>
                <code>{`curl -fsSL https://yeetrun.com/install.sh | sh -s -- --nightly`}</code>
              </CodeBlock>
              <P className={s.note}>
                For upgrade commands and install options, use the{" "}
                <Link href="/docs/getting-started/installation">
                  installation guide
                </Link>
                .
              </P>
            </section>

            <section className={s.card}>
              <H2>Bootstrap a host</H2>
              <P>
                Prepare the Tailscale tag policy first. Then install catch on a
                remote Linux host over SSH. Interactive setup asks for the
                Tailscale OAuth client secret and asks before installing missing
                Debian or Ubuntu packages.
              </P>
              <CodeBlock>
                <code>{`yeet init root@<machine-host>`}</code>
              </CodeBlock>
              <P className={s.note}>
                If Docker or VM tools are missing on a supported host,
                interactive setup asks before installing them.
              </P>
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
                to prove the host can run the payload types you plan to use.
              </P>
            </section>
          </div>
        </SectionWrapper>
      </main>
    </NavFooterLayout>
  );
}
