import { defineConfig, passthroughImageService } from "astro/config";
import { astroFont } from 'astro-font/integration'
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import { rehypePrettyCode } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import sitemap from '@astrojs/sitemap';
import cloudflare from "@astrojs/cloudflare";



/**
 * Vite plugin for handling raw font files without using fs
 * Uses Vite's built-in features to handle file imports
 */
function rawFonts(extensions) {
  return {
    name: 'vite-plugin-raw-fonts',
    transform(code, id) {
      if (extensions.some(ext => id.endsWith(ext))) {
        // Instead of reading the file with fs, use the content provided by Vite
        // This approach works both locally and in Cloudflare
        return {
          code: `export default ${JSON.stringify(Buffer.from(code))}`,
          map: null
        };
      }
    }
  };
}

export default defineConfig({
  site: 'https://viveklokhande.com',
  output: "server",
  
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
    sitemap(),
    astroFont()
  ],
  
  // Vite configuration
  vite: {
    plugins: [rawFonts(['.ttf'])],
    assetsInclude: ['**/*.wasm'], // Treat WASM files as assets
    ssr: {
      external: ["buffer", "path", "fs", "os", "crypto", "async_hooks"].map((i) => `node:${i}`),
    },
  },
  
  // Deployment adapter
  adapter: cloudflare(),
});