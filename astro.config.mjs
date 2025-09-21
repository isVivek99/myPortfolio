import { defineConfig, passthroughImageService } from "astro/config";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import { rehypePrettyCode } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import sitemap from '@astrojs/sitemap';
import cloudflare from "@astrojs/cloudflare";
import fs from 'node:fs'
import path from 'node:path'


/**
 * Vite plugin for handling raw font files without using fs
 * Uses Vite's built-in features to handle file imports
 */
function rawFonts(extensions) {
  return {
    name: 'vite-plugin-raw-fonts',
    enforce: 'pre', // Run before other plugins
    resolveId(id, importer) {
      if (extensions.some(ext => id.includes(ext))) {
        // Resolve relative paths properly
        if (id.startsWith('.')) {
          const resolvedPath = path.resolve(path.dirname(importer), id);
          return resolvedPath;
        }
        return id;
      }
    },
    load(id) {
      if (extensions.some(ext => id.includes(ext))) {
        try {
          const buffer = fs.readFileSync(id);
          // Return as a simple Uint8Array that can be used directly
          return `export default new Uint8Array([${Array.from(buffer).join(',')}]);`;
        } catch (error) {
          console.error('Error loading font:', error.message);
          throw error;
        }
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

  ],
  
  // Vite configuration
  vite: {
    plugins: [rawFonts(['.ttf'])],
    assetsInclude: ['**/*.wasm'], // Treat WASM files as assets (but not TTF files)
    ssr: {
      external: ["buffer", "path", "fs", "os", "crypto", "async_hooks"].map((i) => `node:${i}`),
    },
    // Ensure TTF files are not treated as assets
    assetsExclude: ['**/*.ttf'],
  },
  
  // Deployment adapter
  adapter: cloudflare(),
});