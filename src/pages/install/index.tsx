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
                For source builds and dev setup, see the{" "}
                <Link href="/docs/development">Development docs</Link>.
              </P>
            </section>

            <section className={s.card}>
              <H2>Bootstrap a host</H2>
              <P>Install catch on a remote Linux host via SSH.</P>
              <CodeBlock>
                <code>{`yeet init root@<host>`}</code>
              </CodeBlock>
              <P className={s.note}>
                The SSH target is the <strong>machine host</strong>. After
                install, yeet talks to the <strong>catch host</strong> (tsnet
                hostname).
              </P>
            </section>
          </div>
        </SectionWrapper>
      </main>
    </NavFooterLayout>
  );
}
