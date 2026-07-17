@AGENTS.md

## Sibling repos

This is one of four repos that make up the Jobzshala GCC platform, checked out side by side under the parent `jobzshala-gcc/` directory (its root `package.json` has a `pnpm dev` script that runs all four concurrently): `jobzshala-gcc-backend` (the API this app talks to, at `v3` — candidate portal), `jobzshala-gcc-admin` (admin portal, CRA, talks to `v1`), and `jobzshala-gcc-employer` (employer portal, Next.js — scaffolded to match this repo's stack and `lib/`/`components/` layout, so check `jobzshala-gcc-employer/CLAUDE.md` when a pattern here needs a counterpart there, and vice versa). See `jobzshala-gcc-backend/CLAUDE.md` for the backend's module layout, auth design, and portal versioning (`v1` admin / `v2` employer / `v3` candidate).
