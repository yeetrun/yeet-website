import s from "./404Page.module.css";
import NavFooterLayout from "@/layouts/nav-footer-layout";
import { loadDocsNavTreeData } from "@/lib/fetch-nav";
import { DOCS_DIRECTORY } from "./docs/[...path]";
import { NavTreeNode } from "@/components/nav-tree";
import { H2, P } from "@/components/text";
import { ButtonLink } from "@/components/link";
import Image from "next/image";

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
        description: "That yeet page is not here. Use the docs or return home.",
      }}
    >
      <main className={s.notFoundPage}>
        <div className={s.card}>
          <div className={s.logo} aria-hidden={true}>
            <span className={s.logoMark}>
              <Image
                className={s.logoMarkGlyph}
                src="/yeet-mark.svg"
                alt=""
                width={34}
                height={34}
              />
            </span>
            <span className={s.logoText}>yeet</span>
          </div>
          <H2>That page is not here.</H2>
          <P>
            Use the docs navigation or go back home. If the link should work,
            check the URL.
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
