# GSEB Learning Hub

Early functional prototype for **GSEB Class 12 Mathematics** with Gujarati/English language toggle, worked examples rendered with KaTeX, MCQs with explanations, and device-local progress tracking.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Current limitations

- This is an initial prototype, **not** a complete GSEB mathematics solution library.
- Included questions are original demonstrations; chapter numbers are illustrative and must be aligned with the current GSEB syllabus before launch.
- No Supabase, teacher accounts, payments, server-side persistence, live rankings or exam paper downloads yet.
- Local progress is browser-specific and can be cleared.
- Verify mathematical and Gujarati editorial content before using commercially.

## Next steps

1. Confirm latest authorized GSEB chapter list and textbook question mapping.
2. Add properly licensed/independently written bilingual question and solution content.
3. Implement Supabase authentication, centre membership, role-based access and row-level security.
4. Add privacy-preserving analytics, practice schedules and teacher dashboard.
5. Implement billing, real-device testing and production deployment.
