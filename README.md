1. __Project Structure__: This is an Astro project with TypeScript

2. __Key folders__:

   - `assets/` - Contains blog images and covers
   - `components/` - Astro components for UI
   - `content/` - Blog content and configuration
   - `icons/` - SVG icons and images
   - `layout/` - Layout components
   - `pages/` - Astro pages (routing)
   - `scripts/` - TypeScript scripts
   - `types/` - TypeScript type definitions
   - `utils/` - Utility functions

3. __Key files__:

   - `const.ts` - Contains a classMap array
   - `content.config.ts` - Defines blog collection schema using Zod
   - `env.d.ts` - Astro environment types


__Blog Post Frontmatter Requirements__:

- `title`: Post title (string)
- `subheading`: Post subtitle (string)
- `cover`: Cover image (processed by Astro)
- `publishedAt`: Publication date (date)
- `readingTimeInMins`: Estimated reading time (positive integer)
- `tags`: Array of tag strings

### `env.d.ts`

Astro environment type definitions - provides TypeScript support for Astro-specific features.

## Development Workflow

### Adding a New Blog Post

__Create the content file__:

   ```bash
   touch src/content/blogs/my-new-post.md
   ```

# Portfolio Project - Source Code Instructions

This document provides comprehensive instructions for working with the `src/` directory of this Astro-based portfolio website.

## Project Overview

This is an Astro-powered portfolio website with an integrated blog system, built with TypeScript and featuring a modern component-based architecture.

## Folder Structure

### 📁 `assets/`
Contains static assets, primarily blog-related images:
- `blogs/` - Blog post images organized by article slug
- `cover/` - Blog cover images (SVG format)

**Usage**: Store blog images in respective folders named after the blog slug for better organization.

### 📁 `components/`
Reusable Astro components for the UI:

#### Main Components:
- `ButtonPrimary.astro` - Primary button component
- `ButtonSecondary.astro` - Secondary button component
- `Card.astro` - Generic card component
- `Footer.astro` - Site footer
- `ListItem.astro` - List item component
- `Navbar.astro` - Desktop navigation
- `NavbarMobile.astro` - Mobile navigation
- `Tags.astro` - Tag display component
- `TechStackMain.astro` - Technology stack showcase
- `Tooltip.astro` - Tooltip component

#### Blog Components (`blogs/`):
- `BlogCard.astro` - Blog post card for listings
- `TOC.astro` - Table of contents for blog posts

**Usage**: Import and use these components in pages or other components as needed.

### 📁 `content/`
Content management using Astro's content collections:

#### Blog Content (`blogs/`):
- `*.md` and `*.mdx` files - Blog posts in Markdown/MDX format
- `cover-*.svg` - Cover images for blog posts

**Adding a New Blog Post**:
1. Create a new `.md` or `.mdx` file in `src/content/blogs/`
2. Add required frontmatter (see schema in `content.config.ts`)
3. Place associated images in `src/assets/blogs/[blog-slug]/`

### 📁 `icons/`
SVG icons and image assets:
- Technology logos (React, Astro, Node.js, etc.)
- Social media icons
- Company logos
- Profile images

**Usage**: Import SVG files directly in components or reference in image tags.

### 📁 `layout/`
Layout components:
- `BaseLayout.astro` - Main layout wrapper for all pages

**Usage**: Wrap page content with layout components for consistent structure.

### 📁 `pages/`
Astro pages (file-based routing):

#### Main Pages:
- `index.astro` - Homepage
- `blogs.astro` - Blog listing page
- `404.astro` - Error page

#### Dynamic Routes:
- `blogs/[slug].astro` - Individual blog post pages
- `blogs/tags/[slug].astro` - Tag-based blog filtering

**Usage**: Add new `.astro` files here to create new routes.

### 📁 `scripts/`
TypeScript scripts and utilities:
- `home/letterAnimation.ts` - Animation logic for homepage

**Usage**: Add reusable JavaScript/TypeScript logic here.

### 📁 `types/`
TypeScript type definitions:
- `letterData.ts` - Types for letter animation data
- `postsData.ts` - Types for blog post data

**Usage**: Define and export TypeScript interfaces and types here.

### 📁 `utils/`
Utility functions:
- `contentCollecion.ts` - Content collection helpers
- `UTCDateStringToReadable.ts` - Date formatting utilities

**Usage**: Add reusable utility functions here.

## Key Configuration Files

### `const.ts`
Contains the `classMap` array with CSS class names:
```typescript
export const classMap = ["one", "two", "three", ...];
````

__Usage__: Used for dynamic CSS class assignment, likely for animations or styling variations.

### `content.config.ts`

Defines the blog collection schema using Zod validation:

```typescript
const blogs = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subheading: z.string(),
      cover: image(),
      publishedAt: z.coerce.date(),
      readingTimeInMins: z.number().int().min(1),
      tags: z.array(z.string()),
    }),
});
```

__Blog Post Frontmatter Requirements__:

- `title`: Post title (string)
- `subheading`: Post subtitle (string)
- `cover`: Cover image (processed by Astro)
- `publishedAt`: Publication date (date)
- `readingTimeInMins`: Estimated reading time (positive integer)
- `tags`: Array of tag strings

### `env.d.ts`

Astro environment type definitions - provides TypeScript support for Astro-specific features.

## Development Workflow

### Adding a New Blog Post

1. __Create the content file__:

   ```bash
   touch src/content/blogs/my-new-post.md
   ```

2. __Add frontmatter__:

   ---
   title: "My New Blog Post"
   subheading: "A brief description of the post"
   cover: "./cover-1.svg"
   publishedAt: "2024-01-15"
   readingTimeInMins: 5
   tags: ["javascript", "web-development"]
   ---

3. __Add images__ (if needed):

   - Create folder: `src/assets/blogs/my-new-post/`
   - Add images: `img-1.png`, `img-2.jpg`, etc.

4. __Reference images in content__:

   ```markdown
   ![Description](../../assets/blogs/my-new-post/img-1.png)
   ```

### Adding New Components

1. **Create component file

```
```


### Sharp Image Processing Issue

When deploying to Netlify, you may encounter issues with blog images not displaying correctly. This is because Sharp needs to be rebuilt on Netlify's environment to properly handle image optimization.

**Solution:** Add the following configuration to your project:

1. In `wrangler.toml`:

```toml
[build]
command = "pnpm run build"
[build.environment]
NODE_VERSION = "20.3.0"
```
```

## Local Development

1. Clone the repo
2. Install dependencies
   ```bash
   pnpm install
   ```
3. Start development server
   ```bash
   pnpm dev
   ```
4. Build for production
   ```bash
   pnpm build
   ```

## Design

Check out the Figma design [here](https://www.figma.com/file/aX8EzakpEYntYfIz89CYfR/Portfolio?type=design&node-id=3%3A336&mode=design&t=Fbk8PWsA9y857Xki-1)

## Contributing

Feel free to create any GitHub issue if you find a bug we can try to solve together.
