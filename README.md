# Kikos CRM

Monorepo pnpm do desafio Kikos Fitness: CRM com autenticação, leads, negócios (funil), vendedores e comentários.

Stack:

- **API:** Fastify + Prisma + PostgreSQL (`apps/api`)
- **Web:** React 19 + Vite + TypeScript + React Router + shadcn/ui + Tailwind CSS v4 (`apps/web`)

## Requisitos

- Node.js 22.19
- pnpm 11.20
- Docker Desktop com Docker Compose

## Como rodar

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

| Serviço | URL |
| --- | --- |
| API | http://localhost:3333 |
| Docs da API | http://localhost:3333/reference |
| Web | http://localhost:5173 |

Health check:

```powershell
Invoke-RestMethod http://localhost:3333/health
```

O arquivo `apps/api/.env` contém somente valores locais e não é versionado. Atualize
`apps/api/.env.example` sempre que uma variável obrigatória for adicionada.

Opcional no web: `apps/web/.env` com `VITE_API_URL=http://localhost:3333` (padrão).

### Primeiro acesso

1. Abra http://localhost:5173/register e crie a conta.
2. O **primeiro usuário** do banco vira `ADMIN`; os seguintes, `MEMBER`.
3. Faça login e use o CRM (Dashboard, Leads, Negócios, Vendedores).

## Comandos

- `pnpm dev` / `pnpm dev:api`: inicia a API com reload.
- `pnpm dev:web`: inicia o frontend Vite.
- `pnpm build`: build da API.
- `pnpm build:web`: build do frontend.
- `pnpm start`: executa a API em produção.
- `pnpm lint`: ESLint (api + web).
- `pnpm typecheck`: typecheck (api + web).
- `pnpm test`: testes da API.
- `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:migrate:deploy` / `pnpm db:studio`: Prisma.

## Deploy gratuito (Neon + Render + Vercel)

Combo sem cartão para demo:

| Peça | Onde | Plano |
| --- | --- | --- |
| Postgres | [Neon](https://neon.tech) | Free |
| API | [Render](https://render.com) | Free Web Service |
| Web | [Vercel](https://vercel.com) | Hobby |

Ordem: banco → API → web.

### 1. Neon

1. Crie um projeto e copie a `DATABASE_URL`.
2. Aplique as migrations (com a URL no ambiente):

```powershell
$env:DATABASE_URL="postgresql://..."
pnpm db:migrate:deploy
```

### 2. Render (API)

1. New → Blueprint → use o `render.yaml` da raiz, **ou** Web Service apontando para este repo.
2. Build / start (já no blueprint):

```text
Build: pnpm install && pnpm db:generate && pnpm --filter @kikos/api build
Start: pnpm --filter @kikos/api start
```

3. Env vars obrigatórias:

| Variável | Exemplo |
| --- | --- |
| `DATABASE_URL` | connection string do Neon |
| `JWT_SECRET` | string aleatória com ≥ 32 caracteres |
| `CORS_ORIGIN` | `https://seu-app.vercel.app` (várias: separadas por vírgula) |
| `NODE_ENV` | `production` |
| `HOST` | `0.0.0.0` |

`PORT` é injetado pelo Render; a API já lê `process.env.PORT`.

4. Confirme: `GET https://sua-api.onrender.com/health`.

No plano free a API **hiberna** após ~15 min sem tráfego; o 1º request pode demorar ~20–30s. Pingue `/health` antes de uma demo.

### 3. Vercel (web)

1. Import do GitHub (root do monorepo). O `vercel.json` na raiz já define install/build/output e rewrite SPA.
2. Env var de Production/Preview:

```text
VITE_API_URL=https://sua-api.onrender.com
```

3. Deploy. Abra a URL `*.vercel.app`, registre o primeiro usuário (vira `ADMIN`) e teste o fluxo.

Se o Root Directory do projeto for `apps/web`:
- Install: `cd ../.. && pnpm install`
- Build: `pnpm build`
- Output: `dist`
- Inclua arquivos fora do root (workspace pnpm)
- Não precisa de `DATABASE_URL` no projeto web

## Decisões técnicas

### Arquitetura

- **Backend em camadas:** controllers HTTP → use-cases → repositories (Prisma). Domínio e regras ficam nos use-cases; o Prisma não vaza para a camada HTTP.
- **Frontend por features:** `Page → hook → api client → HttpClient → API`. Auth é o módulo canônico; Leads/Deals/Sellers/Comments/Dashboard seguem o mesmo padrão.
- **Contrato da API manda:** o frontend não inventa campos. Prints em `img/screens/` guiam a UI; o schema Prisma/OpenAPI define o que existe de fato.

### Autenticação e autorização

- JWT access + refresh token opaco (persistido e rotacionado).
- Refresh automático no `HttpClient` do web em `401`.
- Roles: `ADMIN` / `MEMBER`. Criação de vendedor é `ADMIN`-only (API e UI).
- Role não é escolhida no registro: o primeiro usuário do sistema é `ADMIN`.

### Domínio

- **Lead** é a entidade central (nome + e-mail). Listagem enriquece com vendedor, status e última interação a partir do negócio/comentário mais recente (relações Prisma), sem campos inventados no schema.
- **Deal** tem status `OPEN | QUALIFICATION | PROPOSAL | CLOSED` e valor em **centavos** (`valueInCents`).
- Transições de status são **explícitas** via endpoints (`/qualification`, `/proposal`, `/won`, `/lost`, `/reopen`) — o kanban no web usa botões, não drag-and-drop.
- **Comentários** no escopo entregue ficam no detalhe do negócio (`POST/GET /deals/:id/comments`). A API também aceita comentários em leads.
- Soft delete em leads/deals/sellers; listagens padrão ocultam removidos.

### Frontend / UX

- UI com **shadcn/ui + Tailwind v4**, alinhada aos prints sem pixel-perfect.
- Rotas protegidas (`ProtectedRoute`) e públicas (`PublicOnlyRoute`).
- Dashboard com totais e pipeline por status, derivados da listagem de deals.
- Filtros de leads (status/vendedor) no client sobre a lista enriquecida da API.

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
  api/          backend Fastify + Prisma
  web/          frontend React + Vite
docs/
  DESCRIPTION.md
  BACKEND_ARCHITECTURE.md
  FRONTEND_ARCHITECTURE.md
img/screens/    referência visual das telas
docker-compose.yml
pnpm-workspace.yaml
```

Documentação detalhada: `docs/BACKEND_ARCHITECTURE.md` e `docs/FRONTEND_ARCHITECTURE.md`.
