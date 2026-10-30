# GANIT Interactive Mathematics Lab — Progress Report

**Branch target**: `feature/ganit-maths-lab` (or main until branch permissions available)  
**Date**: 2026-10-30  
**Repository**: https://github.com/sp594809-cloud/gseb-learning-app

## What is delivered

### Phase 1 — Relations and Functions Lab (WORKING)

**Location**: `app/lab/relations/page.tsx` + `lib/math/relations.ts`

Features implemented and mathematically verified:

- Create / edit finite sets A and B
- Add / remove ordered pairs via clickable matrix
- Live arrow-diagram visualization (SVG)
- **Reflexivity** — exhaustive check of all (a,a); empty set handled vacuously
- **Symmetry** — every (a,b) implies (b,a)
- **Transitivity** — every chain (a,b)+(b,c) implies (a,c)
- **Equivalence** detection + equivalence-class partition
- Missing-pair feedback in Gujarati so students know what to add
- Function mode: one-one, onto, bijective classification
- Image, domain, codomain display
- Example presets (equivalence, not-reflexive, not-symmetric, not-transitive, bijection)
- Reset button
- Gujarati explanations of each property
- Mobile-first layout matching GANIT design tokens (Indigo / Saffron / Emerald)

### Lab homepage

**Location**: `app/lab/page.tsx`

- Lists all six planned labs
- Phase 1 marked ready; others “coming soon”
- Links into the interactive Relations lab

### Automated tests

**Location**: `__tests__/math/relations.test.ts`

Covers empty sets, missing pairs, partial vs full equivalence, non-functions, composition.

Run:
```bash
npx tsx __tests__/math/relations.test.ts
```

## Not yet implemented (next commits)

| Phase | Status |
|-------|--------|
| 2 Inverse Trig Lab | Planned |
| 3 Matrix Lab | Planned |
| 4 Determinants Lab | Planned |
| 5 Continuity & Differentiability | Planned |
| 6 Applications of Derivatives | Planned |

## How to run locally

```bash
git clone https://github.com/sp594809-cloud/gseb-learning-app.git
cd gseb-learning-app
npm install
npm run dev
```

Then open:
- http://localhost:3000/lab          → Lab homepage
- http://localhost:3000/lab/relations → Interactive Relations & Functions Lab

## Design notes

- Uses existing KaTeX dependency already in the project
- No personal data collection
- Works without sign-in
- Respects the premium color system already defined in `premium-experience/`
- Does not modify VS Plastic ERP or overwrite the existing lesson/quiz system

## Mathematical integrity statement

All relation and function classifiers perform exhaustive finite checks.  
No probabilistic or approximate classification is used for discrete properties.  
Edge cases (empty sets, incomplete domains, non-functions) are handled explicitly and covered by tests.
