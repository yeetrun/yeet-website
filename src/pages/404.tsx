import s from "./404Page.module.css";
import NavFooterLayout from "@/layouts/nav-footer-layout";
import { loadDocsNavTreeData } from "@/lib/fetch-nav";
import { DOCS_DIRECTORY } from "./docs/[...path]";
import { NavTreeNode } from "@/components/nav-tree";
import { H2, P } from "@/components/text";
import { ButtonLink } from "@/components/link";

export async function getStaticProps() {
  return {
    props: {
      docsNavTree: await loadDocsNavTreeData(DOCS_DIRECTORY, ""),
    },
  };
}

interface NotFoundProps {
  docsNavTree: NavTreeNode[];
}

export default function NotFound({ docsNavTree }: NotFoundProps) {
  return (
    <NavFooterLayout
      docsNavTree={docsNavTree}
      meta={{
        title: "Page not found | yeet",
        description:
          "We couldn’t find that page. Jump into the docs or head back home.",
      }}
    >
      <main className={s.notFoundPage}>
        <div className={s.card}>
          <div className={s.mark} aria-hidden={true} />
          <H2>This page could not be found.</H2>
          <P>
            Try the docs navigation or hop back to the homepage. If you think
            this link should exist, double-check the URL.
          </P>
          <div className={s.actions}>
            <ButtonLink href="/docs" text="Docs" size="large" />
            <ButtonLink href="/" text="Home" size="large" theme="neutral" />
          </div>
        </div>
      </main>
    </NavFooterLayout>
  );
}
