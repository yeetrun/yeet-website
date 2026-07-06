import Footer from "@/components/footer";
import { SimpleLink } from "@/components/link";
import { NavTreeNode } from "@/components/nav-tree";
import Navbar from "@/components/navbar";
import RootLayout, { RootLayoutProps } from "../root-layout";

const navLinks: Array<SimpleLink> = [
  {
    text: "Docs",
    href: "/docs",
  },
  {
    text: "GitHub",
    href: "https://github.com/yeetrun/yeet",
  },
];

type NavFooterLayoutProps = RootLayoutProps & {
  docsNavTree: NavTreeNode[];
};

export default function NavFooterLayout(props: NavFooterLayoutProps) {
  const currentYear = new Date().getFullYear();

  const { children, docsNavTree, ...otherProps } = props;
  return (
    <RootLayout {...otherProps}>
      <Navbar
        links={navLinks}
        docsNavTree={docsNavTree}
        cta={{
          href: "/docs/getting-started/quick-start",
          text: "Quick Start",
        }}
      />
      {children}
      <Footer
        links={[
          ...navLinks,
          {
            text: "Quick Start",
            href: "/docs/getting-started/quick-start",
          },
          {
            text: "Host Setup",
            href: "/docs/getting-started/host-setup",
          },
        ]}
        copyright={`© ${currentYear} AUTHORS`}
        copyrightHref="https://github.com/yeetrun/yeet/blob/main/AUTHORS"
      />
    </RootLayout>
  );
}
