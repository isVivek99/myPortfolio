import { defineConfig, passthroughImageService } from "astro/config";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import { rehypePrettyCode } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import fs from "node:fs";
import path from "node:path";

/**
 * Vite plugin for handling raw font files without using fs
 * Uses Vite's built-in features to handle file imports
 */
function rawFonts(extensions) {
  return {
    name: "vite-plugin-raw-fonts",
    enforce: "pre", // Run before other plugins
    resolveId(id, importer) {
      if (extensions.some((ext) => id.includes(ext))) {
        // Resolve relative paths properly
        if (id.startsWith(".")) {
          const resolvedPath = path.resolve(path.dirname(importer), id);
          return resolvedPath;
        }
        return id;
      }
    },
    load(id) {
      if (extensions.some((ext) => id.includes(ext))) {
        try {
          const buffer = fs.readFileSync(id);
          // Return as a simple Uint8Array that can be used directly
          return `export default new Uint8Array([${Array.from(buffer).join(",")}]);`;
        } catch (error) {
          console.error("Error loading font:", error.message);
          throw error;
        }
      }
    },
  };
}

const SITE = "https://viveklokhande.com";

/**
 * Blog posts and talks are rendered on request (output: "server"), so the sitemap
 * integration can't discover them. List them here from the source files, with each
 * post's publishedAt as lastmod, so Google and Bing get every post.
 */
function onDemandPages() {
  const blogDir = path.resolve("src/content/blogs");
  const posts = fs
    .readdirSync(blogDir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const fm = fs.readFileSync(path.join(blogDir, f), "utf8").match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
      const slug = fm.match(/^slug:\s*["']?([^"'\n]+?)["']?\s*$/m)?.[1] ?? f.replace(/\.mdx?$/, "");
      const date = fm.match(/^publishedAt:\s*["']?([^"'\n]+?)["']?\s*$/m)?.[1];
      return { url: `${SITE}/blogs/${slug}`, lastmod: date ? new Date(date).toISOString() : undefined };
    });
  const talksSrc = fs.readFileSync(path.resolve("src/utils/talksData.ts"), "utf8");
  const talks = [...talksSrc.matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((m) => ({ url: `${SITE}/talks/${m[1]}` }));
  return [...posts, ...talks];
}
const extraPages = onDemandPages();

export default defineConfig({
  site: SITE,
  output: "server",

  redirects: {
    "/blogs/astro-og-image-for-seo": "/blogs/astro-og-image-cloudflare-workers",
  },

  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },

  // Markdown configuration
  markdown: {
    shikiConfig: {
      allowUnsafeSrc: true,
    },
  },

  // Image handling
  image: {
    service: passthroughImageService("passthrough"),
  },

  // Integrations
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    icon(),
    mdx({
      syntaxHighlight: false,
      rehypePlugins: [
        // Adds ids to headings
        rehypeSlug,
        [
          // Code block enhancement with syntax highlighting, line numbers, etc.
          rehypePrettyCode,
          {
            theme: "github-dark",
          },
        ],
      ],
    }),
    sitemap({
      customPages: extraPages.map((p) => p.url),
      serialize(item) {
        const lastmod = extraPages.find((p) => p.url === item.url)?.lastmod;
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],

  // Vite configuration
  vite: {
    plugins: [rawFonts([".ttf"])],
    assetsInclude: ["**/*.wasm"], // Treat WASM files as assets (but not TTF files)
    ssr: {
      external: ["buffer", "path", "fs", "os", "crypto", "async_hooks"].map(
        (i) => `node:${i}`,
      ),
    },
    // Ensure TTF files are not treated as assets
    assetsExclude: ["**/*.ttf"],
  },

  // Deployment adapter
  adapter: cloudflare(),
});
