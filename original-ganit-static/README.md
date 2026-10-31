# Original GANIT Gujarati Review — exact static export

Recovered from the actual Sites source repository, **not** the GSEB demo or `premium-experience`.

Original: https://ganit-gujarati-review.shivshaktiproduct186.chatgpt.site/#home
Published version: **2**
Original source commit: **0ce37537f8a14716be358c7619b945e656a09b70**

`source/` contains all **204 original files**, byte-for-byte, including the complete browser application, CSS, SVG graphics, manifest, service worker, content JSON and **196 textbook page images**. `verification/source-manifest.json` records SHA-256 for every original file. No runtime dependencies or source assets need to be fetched from ChatGPT after deployment.

## Build and test

Use Node 22 or newer, only during build/testing:

```sh
npm run build
npm test
```

The build checks source hashes, copies the exact original files into `dist/`, and verifies output hashes. No package installation is necessary. There is no production Node server, framework build, database, environment secret, or API dependency. The original site is authored in browser JavaScript; these readable files are its complete static source, not a screenshot/mockup or minified framework reconstruction.

## Render Static Site settings

- Repository: `sp594809-cloud/gseb-learning-app`
- Branch: `feature/ganit-original-static`
- Root directory: `original-ganit-static`
- Build command: `npm run build`
- Publish directory: `dist`
- Service type: **Static Site**, not Web Service
- Start command: **none**
- Environment variables: **none required**

Create a separate Static Site; do not change an existing live service. Hash navigation (`/#home`, `/#solution/tb1-Example-1`) needs no catch-all server rewrite because fragments are handled entirely by the browser. Host this project at the origin root, not under a URL subdirectory: original asset paths are root-relative.

## Exact preservation scope and source limitations

The published revision has six chapter navigation entries, **61 Chapter 1 solutions and 49 Chapter 2 solutions**. Chapters 3–6 provide original textbook access and their existing practice questions; newly authored solutions for them are not in the published revision. All source content is preserved, including the existing wording and any mathematical inaccuracies; this migration does not claim a new content audit or completed later chapters.

The original published notebook uses cream paper, coloured ruling and blue text. The requested white-paper/black-line update and further chapter drafts had not been published. They are deliberately excluded from this exact-copy branch. Mathematical notation, existing SVG graphs, system Gujarati fonts, animations, responsiveness and controls remain unchanged. The original does not depend on KaTeX; no new renderer is substituted.

Bookmarks, progress and practice are already stored in localStorage. They remain on each browser and origin. Existing saved progress from the ChatGPT domain does not automatically transfer to a new Render domain. The original guest-mode account control remains unchanged; account synchronisation is not implemented in the published static app.

ChatGPT's owner-only hosting sign-in gate is infrastructure outside the source files. It cannot be reproduced by a backend-free static export. A new Render site normally exposes its static files to visitors; configure access separately if required. This project does not change the original site's access or deployment.

No files outside this project directory are changed. The existing Next.js app and `premium-experience` are retained untouched.
