# Static site export

The main GSEB Next.js app is configured for static HTML export with `output: 'export'` in `next.config.ts`. This does not affect `premium-experience/` (a separate Vite prototype).

## Build

```bash
npm install
npm run build
```

The output folder is `out/` (not `.next/`). Upload the **contents of `out/`** to Netlify Drop, or use a static host with build command `npm run build` and publish directory `out`.

For Netlify, set base directory to repository root, build command to `npm run build`, and publish directory to `out`. A Node.js runtime is not needed for serving the exported site.

## Compatibility

- Client-side search, question navigation, quizzes, language toggle, and browser-local progress should still function on static hosting.
- Local storage does not sync between devices.
- Dynamic API routes, server actions, and authenticated server sessions cannot run in a static export without an independent backend.
- `images.unoptimized` avoids the Next.js image optimization server.
- `trailingSlash: true` yields directory-style HTML paths to suit static hosts.

## Verification required

`npm run build` must succeed and generate `out/index.html`. Preview with a local static web server, not by opening HTML from Finder. Check Gujarati text, KaTeX, MCQ interaction, local storage, and deep-link refreshes before release.

This branch is intentionally separate from `main` for review and testing.
