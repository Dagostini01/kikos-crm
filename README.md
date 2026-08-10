# Kikos CRM

Solução do [desafio técnico Fullstack — Kikos Fitness](docs/DESCRIPTION.md): CRM em monorepo para gestão de leads e negócios de um time de vendas.

## Demo online

| Peça | URL |
| --- | --- |
| Frontend | https://kikos-crm-web.vercel.app |
| API | https://kikos-crm.onrender.com |
| Health | https://kikos-crm.onrender.com/health |
| Docs da API | https://kikos-crm.onrender.com/reference |

### Conta de demonstração (ADMIN)

| Campo | Valor |
| --- | --- |
| E-mail | `admin@admin.com.br` |
| Senha | `admin123456` |

No plano free do Render a API **hiberna** após ~15 min sem tráfego. Se o login falhar na primeira tentativa, abra o [health](https://kikos-crm.onrender.com/health), espere ~20–30s e tente de novo.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Monorepo | pnpm workspaces |
| API | Fastify + Prisma + PostgreSQL (`apps/api`) |
| Web | React 19 + Vite + TypeScript + React Router + shadcn/ui + Tailwind CSS v4 (`apps/web`) |
| Auth | JWT (access) + refresh token opaco |
| IA | OpenAI (`gpt-4o-mini`) — resumo + próximo passo no detalhe do negócio |
| Deploy | Neon (DB) + Render (API) + Vercel (web) |

Referência visual: prints em `img/screens/` e [Figma do desafio](https://www.figma.com/design/torONxnd1LUOplv6f9ccgA/Kiko---CRM) (não pixel-perfect).

---

## Requisitos do desafio × entrega

Comparativo com as **funcionalidades obrigatórias** de `docs/DESCRIPTION.md`:

| Solicitado | Status | Como foi atendido |
| --- | --- | --- |
| Monorepo (front + back) | Entregue | `apps/api` + `apps/web` no mesmo repositório |
| Login / logout | Entregue | Registro, login, logout, sessão com refresh automático no client |
| Criar lead | Entregue | Cadastro e listagem de leads (nome + e-mail) |
| Criar negócio | Entregue | Deal vinculado a lead + vendedor + valor (`valueInCents`) |
| Status do negócio (funil) | Entregue | `OPEN → QUALIFICATION → PROPOSAL → CLOSED` |
| Marcar ganho / perdido | Entregue | Ações explícitas no detalhe e no board (`/won`, `/lost`, reopen) |
| Atrelar a um vendedor | Entregue | Todo deal exige `sellerId`; CRUD de sellers (criar = ADMIN) |
| Comentários | Entregue | Comentários no **detalhe do negócio** (UI). API também suporta comentários em lead |
| Board (kanban) | Entregue | Colunas por status; transição por **botões** (não drag-and-drop) + detalhes / ganho / perdido |
| README (como rodar + decisões) | Entregue | Este arquivo |
| Hospedar a aplicação (bônus) | Entregue | Links na seção [Demo online](#demo-online) |
| Funcionalidade de IA (bônus) | Entregue | No detalhe do negócio: resumo dos comentários + sugestão de próximo passo (`POST /deals/:id/ai/insights`) |
| Testes automatizados (diferencial) | Parcial | Suite de testes na API (`pnpm test`); sem E2E no web |

### Escopo consciente / adaptações

- UI alinhada aos prints/Figma, sem pixel-perfect.
- Kanban com botões de transição (aceito pelo enunciado: “arrastar e soltar, **ou outra ação de UI**”).
- Comentários na UI focados no negócio; endpoint de comentários em lead existe na API.
- Lead no schema: nome + e-mail (sem inventar empresa/telefone fora do contrato).

### Assistente IA (bônus)

No detalhe de um negócio há o card **Assistente IA**:

1. A API monta o contexto (título, status, valor, lead, vendedor, comentários).
2. Chama a OpenAI (`OPENAI_API_KEY`, modelo `OPENAI_MODEL` / padrão `gpt-4o-mini`).
3. Devolve JSON com `summary` e `nextStep`.

A chave fica **somente no backend**. Sem a variável, o endpoint responde `503`.

Para ativar localmente, no `apps/api/.env`:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

Em produção, configure `OPENAI_API_KEY` no Render e faça redeploy da API.

> A assinatura do ChatGPT (Plus/Pro) **não** substitui a API key de [platform.openai.com](https://platform.openai.com/api-keys).

---

## Como rodar localmente

### Requisitos

- Node.js 22.19
- pnpm 11.20
- Docker Desktop com Docker Compose

### Setup

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
| Docs | http://localhost:3333/reference |
| Web | http://localhost:5173 |

```powershell
Invoke-RestMethod http://localhost:3333/health
```

`apps/api/.env` não é versionado. Modelo: `apps/api/.env.example`.  
Web (opcional): `apps/web/.env` com `VITE_API_URL=/api` (proxy do Vite em dev).

### Primeiro acesso local

1. http://localhost:5173/register — crie a conta.
2. O **primeiro usuário** do banco vira `ADMIN`; os seguintes, `MEMBER`.
3. Use Dashboard, Leads, Negócios e Vendedores.

### Comandos úteis

- `pnpm dev:api` / `pnpm dev:web`
- `pnpm build` / `pnpm build:web` / `pnpm start`
- `pnpm lint` / `pnpm typecheck` / `pnpm test`
- `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:migrate:deploy` / `pnpm db:seed` / `pnpm db:studio`

### Dados de demonstração

Com a `DATABASE_URL` apontando para o banco desejado (local ou Neon):

```powershell
pnpm db:seed
```

O seed é idempotente nos leads/vendedores demo e recria os negócios/comentários. Inclui:

- 3 vendedores, 6 leads, 6 negócios (Novo / Em andamento / Ganho / Perdido)
- Comentários ricos para testar o Assistente IA (ex.: FitLife e IronBox)
- Mantém o admin `admin@admin.com.br` / `admin123456`

### Banco local (Docker)

PostgreSQL na porta `5432`, volume `postgres_data`.

```powershell
docker compose ps
docker compose logs postgres
docker compose down
```

`docker compose down -v` apaga os dados locais.

---

## Decisões técnicas

### Arquitetura

- **API em camadas:** HTTP controllers → use-cases → repositories (Prisma). Regras no use-case; Prisma não vaza para o HTTP.
- **Web por features:** `Page → hook → api client → HttpClient → API` (Auth como módulo canônico).
- **Contrato da API manda:** o client não inventa campos; OpenAPI/Prisma são a fonte da verdade.

### Autenticação e papéis

- JWT access + refresh rotacionado.
- Refresh automático no `HttpClient` em `401`.
- Roles `ADMIN` / `MEMBER`. Criar vendedor é `ADMIN`-only.
- Role não é escolhida no formulário: primeiro usuário do sistema = `ADMIN`.

### Domínio

- Lead: nome + e-mail; listagem enriquecida com vendedor/status/última interação via relações.
- Deal: status de funil + valor em centavos; transições só por endpoints dedicados.
- Soft delete em leads/deals/sellers.
- IA no detalhe do deal: resumo + próximo passo via OpenAI (chave só no servidor).

### Frontend

- shadcn/ui + Tailwind v4.
- Rotas protegidas / públicas.
- Dashboard com totais e pipeline por status.
- Filtros de leads (status/vendedor) no client.

### Deploy (já publicado)

| Peça | Serviço |
| --- | --- |
| Postgres | Neon |
| API | Render (`render.yaml`) |
| Web | Vercel (`vercel.json` / Root `apps/web`) |

Variáveis relevantes da API em produção: `DATABASE_URL`, `JWT_SECRET` (≥32), `CORS_ORIGIN` (URL do front), `HOST=0.0.0.0`, `NODE_ENV=production`, `OPENAI_API_KEY` (opcional, bônus de IA), `OPENAI_MODEL` (opcional).  
Web: `VITE_API_URL` apontando para a API pública.

Detalhes de arquitetura: `docs/BACKEND_ARCHITECTURE.md` e `docs/FRONTEND_ARCHITECTURE.md`.

---

## Estrutura

```text
apps/
  api/          backend Fastify + Prisma
  web/          frontend React + Vite
docs/
  DESCRIPTION.md              enunciado do desafio
  BACKEND_ARCHITECTURE.md
  FRONTEND_ARCHITECTURE.md
img/screens/    referência visual das telas
docker-compose.yml
pnpm-workspace.yaml
render.yaml
vercel.json
```
