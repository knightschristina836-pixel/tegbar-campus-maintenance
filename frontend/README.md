# Tegbar Frontend

Next.js App Router frontend for the Hawassa University Institute of Technology
campus maintenance platform.

## Setup

Requirements: Node.js 20 or newer.

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_API_URL` to the Express API base URL (default:
   `http://localhost:4000/api`).
3. Set `NEXT_PUBLIC_SOCKET_URL` to the Socket.IO server URL (default:
   `http://localhost:4000`).
4. Run `npm install`, then `npm run dev`.

## Scripts

- `npm run dev` — start the development server.
- `npm run build` — create a production build.
- `npm start` — serve the production build.
- `npm run lint` — run ESLint.
- `npm run typecheck` — run the TypeScript checker.

## Current increment

The application includes the shared responsive design system, login,
student registration, password-reset request, unauthorized page, role-aware
dashboard shell, Axios API client, typed service modules, and a Socket.IO
notification hook. Auth requests use the Express API; no demo credentials or
success-shaped mock responses are included.

Role workspaces are intentionally placeholders until the corresponding backend
endpoints are available. UI-side guards improve navigation but do not replace
authorization enforcement in the API.
