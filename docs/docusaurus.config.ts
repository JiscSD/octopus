import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Octopus",
  tagline:
    "Free, fast and fair: the global primary research record where researchers publish their work in full detail",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://docs.octopus.ac",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: "facebook", // Usually your GitHub org/user name.
  // projectName: "docusaurus", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/JiscSD/octopus/docs/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    metadata: [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@octopus_ac" },
    ],
    image: "img/octopus-og-image.jpg",
    navbar: {
      title: "Octopus",
      hideOnScroll: true,
      logo: {
        alt: "Octopus Logo",
        src: "img/android-chrome-192x192.png",
        width: 32,
        height: 32,
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "default",
          position: "left",
          label: "API",
        },
        {
          href: "https://github.com/JiscSD/octopus",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "API",
              to: "/docs/api",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Octopus",
              href: "https://octopus.ac",
            },
            {
              label: "GitHub",
              href: "https://github.com/JiscSD/Octopus",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/octopus_ac",
            },
          ],
        },
      ],
      // copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      copyright:
        'Built with <a target="_blank" href="https://docusaurus.io">Docusaurus</a>.',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
