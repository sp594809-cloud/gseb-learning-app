# GANIT Premium Experience (Prototype)

Isolated mobile-first frontend prototype for the GSEB Gujarati Mathematics learning app.

## Features included

- **Design System** — Indigo + Saffron + Emerald palette, Noto Sans Gujarati typography
- **Student Home Screen** — Personalized greeting, Continue Learning CTA, XP, streak, daily challenge, achievements
- **Interactive Chapter Journey** — 6 chapter worlds (Connections, Angles, Matrix Lab, Logic Grid, Calculus, Motion & Change)
- **Bottom Navigation** — 5-tab mobile navigation
- **Mock Data** — Student profile, chapters, 20 original achievements

## How to run this prototype (Vite)

```bash
cd premium-experience
# Use the Vite package.json if you want a standalone run
cp package.vite.json package.json
npm install
npm run dev
```

## Integration with main Next.js app

- Do **not** overwrite the existing `app/` directory.
- Copy or import components from `premium-experience/src/` into the Next.js app as needed.
- Replace `src/data/mockData.ts` with real data from the textbook inventory / backend.
- See `DESIGN_IMPLEMENTATION_STATUS.md` for full status and next steps.

## Important

- Mathematical correctness is handled by the separate engine.
- Never claim an answer is verified unless the real checker confirms it.
- XP and achievements are optional and must never affect academic marks.
