# @kikos/web

Frontend React + Vite do Kikos CRM.

UI: **shadcn/ui** + Tailwind v4. Primitivos em `src/components/ui/`; composições em `src/shared/ui/`.

## Desenvolvimento

Com a API em `http://localhost:3333`:

```powershell
pnpm --filter @kikos/web dev
```

Ou na raiz: `pnpm dev:web`.

O Vite faz proxy de `/api` → API local. Configure `VITE_API_URL` em `.env` (veja `.env.example`).

## shadcn

```powershell
pnpm dlx shadcn@latest add <component> -c apps/web
```

## Scripts

- `pnpm dev` — Vite
- `pnpm typecheck` — TypeScript
- `pnpm lint` — Oxlint
- `pnpm build` — build de produção
