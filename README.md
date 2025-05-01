# Portfolio Website Built with Astro

This is my personal portfolio website built using Astro, showcasing projects and blog posts.

## Features

- Responsive design
- Blog functionality with Markdown support
- Project showcase
- Contact form

## Important Note for Deployment

### Sharp Image Processing Issue

When deploying to Netlify, you may encounter issues with blog images not displaying correctly. This is because Sharp needs to be rebuilt on Netlify's environment to properly handle image optimization.

**Solution:** Add the following configuration to your project:

1. In `netlify.toml`:

```toml
[build]
command = "pnpm run build"
publish = "dist"
included_files = [
  "node_modules/sharp/**/*"
]

[build.environment]
SHARP_IGNORE_GLOBAL_LIBVIPS = "1"
```

2. In `package.json`:

```json
"pnpm": {
  "onlyBuiltDependencies": [
    "sharp" // Required because Sharp contains native code that needs compilation for the current platform
  ]
}
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
