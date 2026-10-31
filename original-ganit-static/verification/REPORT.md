# Migration verification — 30 October 2026

## Provenance and exact preservation

Sites API identified published version 2, source commit `0ce37537f8a14716be358c7619b945e656a09b70`, deployment `appgdep_6ae311fbbccc81919300d906a02ac174`. All 204 application files were extracted with `git show <published-commit>:dist/<file>` from the actual Sites source checkout. The deployment's saved archive contains these 204 application files plus its hosting manifest. The ChatGPT hosting manifest is not needed by Render and was not copied as application code.

SHA-256 comparisons pass for **every source file and every production output file**. This includes all 196 book images, all 110 solution entries, all 12 original practice MCQs, app logic, Unicode mathematics, SVG graphics, CSS, font selection, icon, manifest and service worker. No application file was rewritten. The build is only a verified copy, so there is no framework transformation or backend substitution.

## Automated checks

`npm run build && npm test`: all 5 tests pass.

1. Source and production output match the published SHA-256 manifest.
2. Six chapter definitions and 110 unique original solution IDs preserved (61/49/0/0/0/0 newly authored entries).
3. All 196 source page images exist and are nonempty.
4. Browser scripts parse; static data loading, localStorage, hash routes and original interactions remain intact.
5. HTML and PWA assets resolve locally; no external font dependency was introduced.

## Browser functional checks

Performed against the built static files through an HTTP static preview, using Chrome:

- Homepage loads with all six chapter cards, original SVG illustration and 110-solution count.
- Chapter routes 1–6 load with the correct original titles and counts.
- **All 110 direct solution hash routes** load a question heading and nonempty worked steps, including `#solution/tb1-Example-1`.
- Chapter 2 search for `sin` returns 23 entries; restricting to exercise 2.1 returns 4.
- Next-step reveal advances visible working; reveal-all shows the final answer.
- Inverse-trig formula and Gujarati text display on `tb2-22-1`.
- Saving a question and marking it understood survive a full page reload; saved-question list contains the saved entry.
- Practice answer B for the inverse of `3x−5` returns correct feedback; Next question opens the following MCQ.
- Graph explorer renders all 8 available modes; tangent slider changes displayed formula from `2.0x − 1.00` to `2.2x − 1.21`.
- Original textbook page 196 loads as a 1196×1622 image; page-jump navigates to page 38.
- Mobile testing uses a 390×844 iframe viewport (375px layout width after scrollbar). No body overflow: body and content widths both 375px. Mobile navigation opens the chapter list and Chapter 2's 49 questions.
- No application-origin JavaScript error was observed in the inspected log entries. Browser-extension metadata errors are unrelated to the app.

Print code is preserved byte-for-byte; an OS printer dialog was not exercised. Mobile checks are responsive viewport checks, not a physical iPhone test. System Gujarati font selection is unchanged; exact glyph rasterisation can vary across operating systems, as in the original.

## Screenshot comparison

`original-*.jpg` were captured while serving the original published source checkout. `static-*.jpg` were captured while serving the separate production build at the same viewport. Screenshots cover desktop home, a revealed notebook solution, graph explorer and mobile home. See `screenshot-comparison.json` for raw pixel-difference bounds.

The notebook solution and mobile-home images are pixel-identical. Home and graph screenshots visually match in layout, text and graphics; raw image differences include the cloud browser's mouse pointer/blue pointer overlay at different positions. Source and output hashes are identical regardless of these capture overlays.

## Verification limit

The actual chatgpt.site URL presents its private ChatGPT sign-in gate to this browser. Therefore authenticated live-page screenshots were not taken. The comparison baseline is the recovered source revision tied to the successful published deployment by the Sites API, not a claimed live authenticated browser comparison.

No live website was deployed, replaced or reconfigured during this migration. No existing repository project was changed. ChatGPT hosting authentication is outside the static application and cannot be copied as static source. Progress is origin-local; it is not transferred between domains by this export.
