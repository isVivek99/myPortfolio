---
name: skipthesub-blog-post
description: Required for every blog post on viveklokhande.com. Load before writing, editing, reviewing, proofreading or fixing anything in src/content/blogs/ (posts, frontmatter, covers, images), including drafts from the yt-to-blog job and any feedback on a post's preface, headings, readability, cover, images or video embed.
---

# Blog posts on viveklokhande.com

These rules come from the user's own review of the first post built from a SkipTheSub video (`ai-bubble-china-coreweave-anthropic`, November 2026). Every point here was a mistake that had to be fixed, so treat them as requirements. That post is the reference: when unsure, match it.

**What applies to which post:**
- **Every post:** sections 2, 3, 4, 7 and 8 (content, structure, readability, frontmatter, the checks before handing over).
- **Video-based posts only:** sections 1, 5 and 6 (sources, cover and video, body images).
- **Your own tech or personal posts:** keep the post's existing cover style, usually an SVG in `src/content/featured_svgs/`. Where a rule mentions the video, apply its intent; for example, the short answer in the preface is the post's main takeaway.

The pipeline: the post goes live on viveklokhande.com first, under Vivek's own name. Then the user imports the URL at `medium.com/p/import` into the **SkipTheSub** Medium publication, which sets the canonical link back to the site. Never publish anywhere yourself.

## 1. Sources

- **Voiceover text** (what ElevenLabs read): this is what was actually said. Follow its wording. Usually `FULL-elevenlabs.txt` or `VOICEOVER*.txt|md` in the video's folder under `~/Desktop/content/vivek/skipthesub YT/`.
- **`SCRIPT.md`**: use it for the source links (listed at the bottom) and for context.
- **Upload notes and credits:** `output/youtube-upload.md` or `DESCRIPTION.md`, and `CREDITS.md`.
- **Skip all production notes:** `[ON SCREEN: …]` lines, hook scores, draft notes, timing labels, and audio tags such as `[excited]` or `[sarcastic]`.
- **Use only facts from these sources.** Don't add numbers, claims or quotes. Keep every number linked to its source.

## 2. Content rules

- **No jokes or gags,** even when the voiceover has one ("raffle ticket", "group chat", "the robots are fine"). No hype or exaggeration. A plain factual explanation is fine, such as what "guppy-level death" means.
- **Check every comparison and calculation yourself.** Mistake to avoid: "430 billion is locked in. That's enough for 32 billion months of a $20 plan." The 32 billion was worked out from $637B, not $430B. Name the figure: "the full $637 billion would pay for…".
- **Dates are absolute and written in words.** Write "in October 2026" or "on October 25", never "this month", "this week", "today", "recently" or "on Monday" alone, and never `2026-10-29`. Posts go live weeks after the video.

## 3. Structure

Open with a real **preface** before the first heading:
1. One sentence of context.
2. A bullet list of the 2–4 main stories or findings, each with its **key number in bold**.
3. **The short answer** to the video's question, in bold, plus one sentence on what the post covers.
4. Any "as of" date or disclaimer last, in _italics_.

Reference preface:

> In October 2026, three pieces of news made a lot of people ask whether the AI bubble had finally burst:
> - **China's AI stocks lost about $480 billion** in under four months.
> - …
>
> If you pay for an AI subscription, the short answer is that **none of this has raised your bill yet**. Below, I go through each story…
>
> _All figures are as of October 29, 2026, when I published the video. Nothing here is financial advice._

**The title** should be short, about 65 characters at most. Put the question or claim first, then the subject, and move the numbers into the subheading.
- Good: "Has the AI Bubble Burst? China, CoreWeave and Anthropic Explained", with the subheading "China's AI stocks lost $480 billion, CoreWeave's lenders got nervous and Anthropic showed an $80.7 billion loss. Here's whether any of it reaches your AI bill."
- Bad: "Has the AI Bubble Burst? China's $480B Crash, CoreWeave's Debt and Anthropic's IPO Filing" (90 characters; it wrapped into three uneven lines).
- The post page balances title line breaks with `text-balance`; keep that class on the `h1` only. The subheading `h2` uses `text-pretty`, which keeps the full width and only stops a lone word on the last line. Both are in `src/pages/blogs/[slug].astro`.

**Headings** use Title Case and state the section's main point, ideally with its key fact, so the headings alone tell the story:
- Good: "China's AI Stocks Lost $480 Billion in Four Months", "Will Any of This Raise Your AI Bill?"
- Bad: "China: a stock bubble that popped", "America: the problem is debt", "Anthropic's IPO filing" (a label plus a colon, or a bare topic).

**Section order at the end:** the conclusion, then `## Watch the Full Video` (one sentence, the embed, a link to the channel), then `## Credits` last, if the video used other people's clips or photos.

Length: about 900–1,300 words, in first person as Vivek, with short paragraphs.

## 4. Readability

- **Bold** what a skimming reader needs: key numbers, the main companies or products on first mention, and the conclusion. Bold a phrase, never a whole sentence, at most 2–3 per section.
- **Write numbers as figures,** such as "$480 billion", "40 percent" or "$2 per million input tokens", even though the voiceover spells them out.
- **Every sentence must stand on its own** for someone who never saw the video. Mistakes to avoid: "That's the 480 billion dollars", "Its stock fell…" right after a sentence about something else, and "2 dollars in and 10 out, against 4 and 20".
- **Explain each term the first time it appears,** such as S-1, bond yield, neocloud, STAR 50, or input/output tokens.
- **Name products in full,** for example "Claude Opus 5.5", not "Opus".

## 5. Cover and video

- **The cover is the video's YouTube thumbnail** (`src/assets/blogs/<slug>/cover.jpg`), shown in full, uncropped, under the title, the way Thomas Frank's blog does it. The post page and `BlogCard.astro` handle photo covers. SVG covers keep the old gradient banner.
- **Rejected cover styles:** don't use them again.
  - the thumbnail cropped into the thin gradient banner
  - the thumbnail as a small card on the banner
  - a white card with the SkipTheSub logo and a short title
- **The video embed goes in "Watch the Full Video" at the end,** not at the top, because the thumbnail already shows there. Use a 16:9 embed, never a fixed height:

```html
<iframe style="width: 100%; aspect-ratio: 16 / 9; height: auto;" src="https://www.youtube.com/embed/<VIDEO_ID>" title="<video title>" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```

## 6. Body images

- **Use only Vivek's own graphics,** such as stat cards, diagrams and charts: 2–3 per post, each next to the section it supports. Never use third-party footage (news clips, other YouTubers' videos, anything with a "▶ Channel · YouTube" credit chip), photos of real people, or the thumbnail.
- **Use only fully built slides.** A frame grabbed mid-animation can be missing a card. The first post had "The compute bill" with only 2 of its 3 cards. Take frames from the end of a scene, just before the cut. The scene timings are in the video's `yt/build/scenes.mjs`. Look at every image before using it, and check for empty slots or missing captions.
- **Write descriptive alt text,** and include every number shown on the slide.

## 7. Frontmatter and file names

```yaml
title: "<clear title naming the subject>"
subheading: "<one sentence>"
slug: "<3–6 words from the post title, e.g. ai-bubble-china-coreweave-anthropic>"   # not the YouTube title
publishedAt: <YYYY-MM-DD>
readingTimeInMins: <words / 200, rounded up>
cover: ../../assets/blogs/<slug>/cover.jpg
coverAlt: "<describe the thumbnail>"
tags: ["AI"]
description: "<under 160 characters>"
keywords: ["<4–6 search phrases>"]
```

The post goes in `src/content/blogs/<slug>.mdx` and its images in `src/assets/blogs/<slug>/`. Use an existing tag, such as "AI" for video posts. The filter buttons on `/blogs` are a hard-coded list in `src/components/Tags.astro`, so a brand-new tag must be added there too, or readers can't filter by it. MDX rules: escape a literal `<` and `{` in prose, and don't add import lines.

## 8. Before calling it done

1. **Proofread the whole post as a first-time reader** who never saw the video. Check that:
   - the preface gives the answer up front
   - every sentence stands alone
   - every number is a figure that matches its source
   - every term is explained
   - the headings alone tell the story
   - there are no jokes and no relative dates
2. **Run `pnpm astro build`** and make sure it passes.
3. **Look at it rendered** with `pnpm astro dev`, then open it with `open -a "Brave Browser" <url>`. Check:
   - the top of the page: title, then the full thumbnail
   - each body image
   - the 16:9 video at the end
   - the `/blogs` list card
4. **Only then hand it over.** Work on a `blog/<slug>` branch and never push to `main`; the user merges it, and that deploys the site.

The yt-to-blog job (`~/Desktop/self/yt-to-blog/`, README there) automates drafts and reads this skill. Its writing instructions are in `prompt.md` there. If you change a rule here, update that file too.
