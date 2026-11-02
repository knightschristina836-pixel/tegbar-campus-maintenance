# Tegbar

Tegbar is a campus maintenance and complaint management system for Hawassa
University Institute of Technology (IoT) Campus. The repository has two
independent applications:

- [backend/](./backend/README.md) — Express, TypeScript, PostgreSQL, and Jest.
- [frontend/](./frontend/README.md) — Next.js App Router, React, TypeScript,
  and Tailwind CSS.

Each application has its own `package.json`, lockfile, dependencies, and
environment configuration. Install and run them separately:

```sh
cd backend
npm install
cp .env.example .env
npm run dev
```

In another terminal:

```sh
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The backend defaults to port `4000`, and the frontend defaults to port `3000`.
Set up PostgreSQL and apply the backend migration as described in
[backend/README.md](./backend/README.md).
