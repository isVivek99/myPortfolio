# viveklokhande.com

Astro site, deployed to Cloudflare automatically when `main` is pushed. Blog posts are in `src/content/blogs/`, and their images in `src/assets/blogs/<slug>/`.

## Blog posts: always load the skill first

Before writing, editing, reviewing, proofreading or fixing any blog post, including its frontmatter, cover or images, invoke the `skipthesub-blog-post` skill (`.claude/skills/skipthesub-blog-post/SKILL.md`) and follow it. This applies even to small edits and to drafts from the yt-to-blog job. Don't rely on memory of the rules; load the skill each time.

Never push blog work to `main` yourself. Work on a `blog/<slug>` branch; the user merges it.
