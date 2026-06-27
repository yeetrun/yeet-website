import PreviewBanner from "@/components/preview-banner";
import classNames from "classnames";
import Head from "next/head";
import s from "./RootLayout.module.css";

export interface PageMeta {
  title: string;
  description: string;
  path?: string;
}

export interface RootLayoutProps {
  meta: PageMeta;
  children?: React.ReactNode;
  className?: string;
}

export default function RootLayout({
  meta: { title, description, path },
  className,
  children,
}: RootLayoutProps) {
  const canonicalUrl = path ? resolveAbsoluteUrl(path) : null;
  const socialImageUrl = resolveAbsoluteUrl("/social-share-card.svg");

  return (
    <>
      <div className={classNames(s.rootLayout, className)}>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

          <meta property="og:title" content={title} />
          <meta property="og:type" content="website" />
          {canonicalUrl ? (
            <meta property="og:url" content={canonicalUrl} />
          ) : null}
          <meta property="og:site_name" content="yeet" />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={socialImageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="alternate icon" href="/favicon.svg" />
          <meta name="twitter:image" content={socialImageUrl} />
          <meta name="darkreader-lock" />
        </Head>
        <PreviewBanner />
        {children}
      </div>
    </>
  );
}

const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://yeetrun.com"
).replace(/\/+$/, "");

function resolveAbsoluteUrl(path: string): string {
  if (!path || path === "/") {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
