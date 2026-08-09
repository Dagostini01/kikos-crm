# Contexto e regras para desenvolvimento do Frontend

Você está trabalhando em um desafio técnico Fullstack para a Kikos Fitness.

Leia primeiro o `README.md`, `docs/DESCRIPTION.md`, `docs/BACKEND_ARCHITECTURE.md` e os prints em `img/screens/` antes de alterar qualquer arquivo.

O projeto é um **monorepo**. O backend em `apps/api` já está consolidado. O foco atual é o frontend em `apps/web`.

Não recrie o monorepo, não troque a stack sem necessidade e não invente regras de negócio no client que a API não suporte.

Antes de implementar qualquer tela:

1. Analise a estrutura atual do monorepo.
2. Analise `apps/web` (ou o scaffold existente).
3. Analise o contrato HTTP da API (Scalar em `/reference` ou controllers).
4. Analise o print correspondente em `img/screens/`.
5. Reutilize padrões e componentes já existentes.
6. Não instale bibliotecas sem necessidade (YAGNI).

---

# Princípio de verdade

- **Regras de negócio / contrato:** `apps/api` + `docs/BACKEND_ARCHITECTURE.md` + `docs/DESCRIPTION.md`.
- **Visual / UX:** prints em `img/screens/` (referência visual, não pixel-perfect).
- Onde o print mostrar campos ou status que a API **não** possui, a UI **adapta** — não inventa persistência no client.

## Mapeamento visual → API

| UI (prints) | API |
|---|---|
| Login e-mail/senha | `POST /auth/login` → tokens; logout `POST /auth/logout` |
| Google / Esqueceu senha | **não implementar** (fora do backend) |
| Lead: nome + e-mail | `POST/GET /leads` (campos extras do print ficam fora do payload) |
| Kanban Novo / Contato / … / Fechado | Colunas: `NEW`, `IN_PROGRESS`, `WON`, `LOST` (labels PT: Novo, Em andamento, Ganho, Perdido) |
| Criar negócio | `title`, `valueInCents`, `leadId`, `sellerId` → `POST /deals` (status inicial sempre `NEW`) |
| Marcar ganho/perdido | `PATCH /deals/:id/won` e `/lost` |
| Comentários no detalhe | `GET/POST /deals/:dealId/comments` |
| Sidebar Vendedores | `GET /sellers` (mutações só ADMIN) |
| Dashboard | redirect para `/negocios` nesta etapa |

---

# Objetivo

Criar um frontend com arquitetura clara, tipada e alinhada ao backend — não apenas “telas bonitas”.

O módulo **Auth** é a referência inicial do frontend (login, sessão, shell autenticado). Em seguida: Leads → Negócios (kanban) → Detalhe → Vendedores.

---

# Princípios arquiteturais

- SOLID (especialmente SRP e DIP)
- baixo acoplamento / alta coesão
- tipagem forte com TypeScript
- tratamento explícito de erros
- separação entre UI e acesso à API
- YAGNI

Uma camada NÃO deve assumir responsabilidade de outra.

Fluxo esperado:

```text
Page / UI Component
      ↓
Feature action (hook ou service de aplicação)
      ↓
API client (contrato do recurso)   ← análogo ao Repository do backend
      ↓
HttpClient (Bearer, refresh em 401, erros tipados)
      ↓
apps/api
```

Regras:

- Página **não** chama `fetch` direto.
- `HttpClient` **não** conhece regra de CRM.
- API clients **não** renderizam UI.
- Erros da API são traduzidos na feature; status HTTP não fica espalhado nos componentes.
- Tokens: access em memória + refresh em `localStorage`; renovação via `POST /auth/refresh` em `401`.

---

# Stack

- React + TypeScript + Vite
- React Router
- **shadcn/ui** + Tailwind CSS v4 (tema dark dos prints; primary ~`#FF4D00`)
- `fetch` tipado (sem React Query nesta etapa)
- Path alias `@/` → `src/`

UI:

- Primitivos shadcn em `src/components/ui/` (`Button`, `Input`, `Card`, …)
- Composições reutilizáveis em `src/shared/ui/` (`Field`, `Page`, `AppSidebar`) — recebem `children` / slots
- Preferir composição (`Card` → `CardHeader` → `CardContent`) em vez de CSS Modules novos

---

# Estrutura

```text
apps/web/
  src/
    app/                 # router, providers, App
    pages/               # LoginPage, LeadsPage, DealsPage, ...
    features/
      auth/              # api, session, hooks, LoginForm
      leads/
      deals/
      sellers/
    components/ui/       # primitivos shadcn (Button, Input, Card, …)
    shared/
      http/              # client, errors, types
      ui/                # composições (Field, Page, AppSidebar)
    lib/utils.ts         # cn()
    index.css            # Tailwind + tokens do tema
    main.tsx
```

## Organização por feature

Cada feature relevante fica em `src/features/<recurso>/` com:

```text
features/<recurso>/
  api/                 # client HTTP do recurso
  model/               # tipos do domínio de UI (quando necessário)
  hooks/               # ações de aplicação
  components/          # UI específica da feature
```

Páginas em `pages/` apenas compõem features e layout — sem regra de negócio.

---

# Módulo canônico: Auth

Ao implementar Auth, este módulo vira referência para as próximas features.

Checklist Auth:

```text
□ shared/http (client + erros)
□ features/auth/api
□ features/auth/session
□ features/auth/hooks
□ LoginForm + LoginPage (visual dos prints)
□ AppShell (sidebar + usuário de GET /auth/me)
□ rotas públicas vs protegidas
□ logout
□ typecheck
```

Checklist mínimo por feature nova:

```text
□ Tipos / contrato alinhados à API
□ api/<recurso>-api.ts
□ hook ou service de aplicação
□ components da feature
□ page + rota
□ estados de loading / erro / empty
□ typecheck
```

---

# Design system

- Tema via CSS variables do shadcn em `src/index.css` (`.dark` ativo no `index.html`)
- Primary laranja alinhado aos prints (`#FF4D00` ≈ `oklch(0.65 0.22 41)`)
- Novos componentes: `pnpm dlx shadcn@latest add <nome> -c apps/web`
- Composições de tela em `shared/ui` com `children` (não reinventar Button/Input)

Referência visual: `img/screens/*.png`.

---

# Rotas previstas

```text
/login                 pública
/register              pública (criar conta)
/                      protegida → redirect /negocios
/leads                 lista
/leads/novo            criar
/negocios              kanban
/negocios/novo         criar
/negocios/:id          detalhe + comentários + won/lost
/vendedores            lista
```

---

# Ordem de entrega

```text
Auth + AppShell
↓
Leads (listar + criar)
↓
Negócios kanban + criar
↓
Detalhe do negócio + comentários + won/lost
↓
Vendedores (lista)
```

Não implemente todas as telas de uma vez. Entregue fatias verticais funcionando ponta a ponta com a API.

---

# Anti-padrões

```ts
// ❌ fetch dentro de Page
// ❌ localStorage de access token sem estratégia de refresh
// ❌ campos do Figma enviados à API sem existir no contrato
// ❌ duplicar regra de transição de Deal no client
// ❌ instalar lib de UI/estado sem necessidade
```

---

# Qualidade

Antes de considerar uma fatia concluída:

```text
pnpm --filter @kikos/web typecheck
pnpm --filter @kikos/web lint   # quando existir
```

Subir API + web e validar o fluxo da fatia manualmente.

---

# Estado atual e próximos passos

## Já consolidado (backend)

- Health, Lead, Seller, Deal, Comments, Authentication

## Em andamento (frontend)

- Scaffold `apps/web`
- Auth (login/logout/me) + AppShell + rotas protegidas
- Leads (listar + criar)
- Documento de arquitetura frontend

## Próximas fatias

```text
Negócios (kanban)
↓
Detalhe + comentários
↓
Vendedores
```

Antes de cada fatia: alinhar tela (print) ↔ endpoints ↔ arquivos a criar; só então codar.
