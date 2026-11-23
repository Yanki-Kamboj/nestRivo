PROJECT: NESTRIVO, a MERN accommodation booking platform.
- Stack: React + Vite + Tailwind + Framer Motion + TanStack Query + React Hook Form + Zod (client/);
  Node + Express + MongoDB + Mongoose + JWT (server/). JavaScript only. No TypeScript, no Next.js.
- Full spec: docs/NESTRIVO_SPEC.md. Read only the sections relevant to the current phase.
- Never trust frontend prices, roles, or user IDs. Validate everything on the backend.
- Never commit secrets. Use .env and keep .env.example updated.
- Preserve existing working code. Do not duplicate models, routes, or utilities.
- Consistent API response: { success, message, data }.
- Original branding: navy #172B35, ivory #F8F6F1, terracotta #C9795D, sage #A6B5A0,
  charcoal #252B2D. DM Serif Display (headings) + Manrope (body). Not Airbnb-like.
- Every page needs loading, empty, and error states. Responsive on mobile.
- After each phase: run lint, build and tests, fix failures, update docs/PROGRESS.md.
- Do NOT start the next phase until I ask.
- Never claim something works unless you ran it.