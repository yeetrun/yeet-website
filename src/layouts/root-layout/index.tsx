import { bodyFont, displayFont, monoFont } from "@/components/text";
import PreviewBanner from "@/components/preview-banner";
import classNames from "classnames";
import Head from "next/head";
import s from "./RootLayout.module.css";

export interface PageMeta {
  title: string;
  description: string;
}

export interface RootLayoutProps {
  meta: PageMeta;
  children?: React.ReactNode;
  className?: string;
}

export default function RootLayout({
  meta: { title, description },
  className,
  children,
}: RootLayoutProps) {
  return (
    <>
      <div
        className={classNames(
          s.rootLayout,
          bodyFont.variable,
          displayFont.variable,
          monoFont.variable,
          className,
        )}
      >
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <meta property="og:title" content={title} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://yeetrun.com" />
          <meta property="og:site_name" content="yeet" />
          <meta property="og:description" content={description} />
          <meta property="og:image" content="/social-share-card.svg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="alternate icon" href="/favicon.svg" />
          <meta name="twitter:image" content="/social-share-card.svg" />
          <meta name="darkreader-lock" />
        </Head>
        <PreviewBanner />
        {children}
      </div>
    </>
  );
}
