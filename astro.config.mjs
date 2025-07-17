import { defineConfig, passthroughImageService } from "astro/config";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import { rehypePrettyCode } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import sitemap from '@astrojs/sitemap';
import cloudflare from "@astrojs/cloudflare";
import fs from 'fs';

// https://astro.build/config
//sitemap:https://docs.astro.build/en/guides/integrations-guide/sitemap/
export default defineConfig({
    site: 'https://viveklokhande.com',
  output: "server",
  markdown: {
    shikiConfig: {
      allowUnsafeSrc: true,
    },
  },

  image: {
    service: passthroughImageService("passthrough"),
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    icon(),
    mdx({
      syntaxHighlight: false,
      rehypePlugins: [
        /**
         * Adds ids to headings
         */
        rehypeSlug,
        [
          /**
           * Enhances code blocks with syntax highlighting, line numbers,
           * titles, and allows highlighting specific lines and words
           */

          rehypePrettyCode,
          {
            theme: "github-dark",
          },
        ],
      ],
    }),
    sitemap()
  ],
 vite: {
    plugins: [rawFonts(['.ttf'])],
    optimizeDeps: {
      exclude: ['@resvg/resvg-js']
    }
  },
  adapter: cloudflare(),
});

function rawFonts(ext) {
  return {
    name: 'vite-plugin-raw-fonts',
    transform(_, id) {
      if (ext.some(e => id.endsWith(e))) {
        const buffer = fs.readFileSync(id);
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null
        };
      }
    }
  };
}
