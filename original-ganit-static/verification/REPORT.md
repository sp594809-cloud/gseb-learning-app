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

At the initial local verification stage, no live website had been deployed, replaced or reconfigured. No existing repository project was changed. ChatGPT hosting authentication is outside the static application and cannot be copied as static source. Progress is origin-local; it is not transferred between domains by this export.


## Public Render verification — 31 October 2026

Dedicated preview: https://ganit-original-preview.onrender.com/#home

Deployed from branch `feature/ganit-original-static`. Public HTTP retrieval of every original asset returned 200 and the expected SHA-256: **204/204 matched**. See `render-asset-verification.json`. All 110 direct solution routes display a question heading and nonempty worked steps; see `render-routes.json`.

Public browser checks passed: homepage, all six chapter routes, notebook reveal-all, Gujarati formulas, bookmark/understood persistence after reload, Chapter 2 search (sin: 23, exercise 2.1 filter: 4), tangent slider (2.2x − 1.21), absolute-value graph, correct practice feedback, textbook page 196 (1196×1622), and mobile chapter navigation. A 390×844 iframe loading the actual public Render site has body width/scrollWidth 375/375. This is responsive viewport verification, not physical-device testing.

`render-home.jpg`, `render-solution.jpg`, and `render-mobile.jpg` capture the deployed site. They retain the recovered original layout, notebook design, Gujarati text, controls and graphics. Dates and browser-local progress naturally differ between captures. No application visual differences requiring fixes were identified. The live ChatGPT sign-in gate still prevents an authenticated original-domain comparison; the baseline remains the deployment-linked source and original screenshots described above.


## First content increment

Commit `a39366af2f5ba08e9e49914f9b12b6670b453ad9` deployed live as `dep-dbinhdjncjis73cqk3mg`. Only Exercise 3.1 questions 2–3 were added, after visual comparison with uploaded textbook PDF page 51 and independent enumeration of all positive ordered factor pairs. Public homepage shows 112 entries. Both direct routes render all nine working steps and final answers in the unchanged notebook design. Public content.json is byte-identical to the new build: SHA-256 `b8a8796ad37ebe6c07a531046fd08c47294071a84c16230c0c67df630cbb6d17`. The original 110 records are deep-equal to the baseline, and all 203 other output files remain identical. Six tests pass. `render-chapter3-batch1.jpg` captures the deployed increment.

This does not complete Chapter 3 or later chapters. Draft inventory review status is explicit in CONTENT_STATUS.json. The original homepage's practice percentage displayed 1% after one correct answer; this pre-existing issue is recorded for the later student-feature milestone, not silently changed during migration.
