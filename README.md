# Kikos CRM

Monorepo pnpm do Kikos CRM. API (Fastify + Prisma + PostgreSQL) e web (React + Vite).

## Requisitos

- Node.js 22.19
- pnpm 11.20
- Docker Desktop com Docker Compose

## Primeira execução

```powershell
pnpm install
Copy-Item apps/api/.env.example apps/api/.env
docker compose up -d --wait postgres
pnpm db:generate
pnpm db:migrate
```

Em terminais separados:

```powershell
pnpm dev:api
pnpm dev:web
```

- API: `http://localhost:3333` (docs em `/reference`)
- Web: `http://localhost:5173`

Para verificar a API:

```powershell
Invoke-RestMethod http://localhost:3333/health
```

O arquivo `apps/api/.env` contém somente valores locais e não é versionado. Atualize
`apps/api/.env.example` sempre que uma variável obrigatória for adicionada.

Opcional no web: `apps/web/.env` com `VITE_API_URL=http://localhost:3333` (padrão).

## Comandos

- `pnpm dev` / `pnpm dev:api`: inicia a API com reload.
- `pnpm dev:web`: inicia o frontend Vite.
- `pnpm build`: build da API.
- `pnpm build:web`: build do frontend.
- `pnpm start`: executa a API em produção.
- `pnpm lint`: ESLint (api + web).
- `pnpm typecheck`: typecheck (api + web).
- `pnpm test`: testes da API.
- `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:studio`: Prisma.

Arquitetura: `docs/BACKEND_ARCHITECTURE.md` e `docs/FRONTEND_ARCHITECTURE.md`.

## Banco local

O PostgreSQL usa a porta `5432` e persiste dados no volume `postgres_data`.

```powershell
docker compose ps
docker compose logs postgres
docker compose down
```

Use `docker compose down -v` apenas quando quiser apagar todos os dados locais.

## Estrutura

```text
apps/
  api/          backend Fastify
  web/          frontend React + Vite
docs/
img/screens/    referência visual das telas
docker-compose.yml
pnpm-workspace.yaml
```
