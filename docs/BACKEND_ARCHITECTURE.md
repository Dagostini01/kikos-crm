# Contexto e regras para desenvolvimento da API

Você está trabalhando em um desafio técnico Fullstack para a Kikos Fitness.

Leia primeiro o `README.md` existente na raiz do projeto e analise toda a estrutura atual antes de alterar qualquer arquivo.

O projeto é um **monorepo**, contendo frontend e backend. Neste momento, nosso foco será **exclusivamente o backend**.

O esqueleto inicial da API já está configurado e existe um endpoint de `health`.

Não recrie o projeto, não substitua configurações existentes e não altere tecnologias sem necessidade.

Antes de implementar qualquer funcionalidade:

1. Analise a estrutura atual do monorepo.
2. Analise o `package.json` da raiz e da API.
3. Analise o `tsconfig`.
4. Analise a configuração do servidor HTTP.
5. Analise o endpoint de health existente.
6. Analise o Prisma Schema, caso já exista.
7. Analise as dependências já instaladas.
8. Reutilize os padrões existentes sempre que fizer sentido.
9. Não instale bibliotecas sem necessidade.
10. Não implemente frontend neste momento.

---

# Objetivo inicial

Vamos começar pela entidade **Lead**.

Escolhemos Lead porque ela pode ser implementada antes de Deal, Seller, Comments e autenticação e servirá como **referência arquitetural para todos os próximos módulos da API**.

O primeiro módulo precisa ser muito bem estruturado, pois os próximos endpoints deverão seguir exatamente o mesmo padrão.

Não quero apenas "fazer funcionar".

Quero criar um padrão arquitetural claro, desacoplado, testável e reutilizável.

---

# Princípios arquiteturais

A aplicação deverá seguir separação clara de responsabilidades.

A arquitetura deve respeitar princípios de:

- SOLID
- Dependency Inversion
- Single Responsibility
- baixo acoplamento
- alta coesão
- Dependency Injection
- tipagem forte com TypeScript
- tratamento explícito de erros
- testabilidade
- separação entre regra de negócio e infraestrutura

Uma camada NÃO deve assumir responsabilidade de outra.

Fluxo esperado:

HTTP Request
↓
Controller
↓
Use Case
↓
Repository Interface
↓
Repository Implementation
↓
Database

O Controller NÃO deve acessar Prisma diretamente.

O Use Case NÃO deve conhecer Fastify.

O Use Case NÃO deve conhecer HTTP.

O Use Case NÃO deve conhecer códigos HTTP como 200, 201, 404 ou 409.

O Use Case NÃO deve depender diretamente de `PrismaLeadRepository`.

Ele deve depender da abstração/interface do repositório.

O Prisma Repository será apenas uma implementação dessa interface.

---

# Estrutura

Antes de criar arquivos, analise a estrutura existente e adapte os caminhos abaixo ao padrão atual do projeto.

Não crie pastas duplicadas se já existir uma estrutura equivalente.

A organização conceitual desejada é semelhante a:

```text
src/
├── use-cases/
│   ├── errors/
│   │   └── resource-not-found-error.ts
│   └── leads/
│       ├── errors/
│       │   └── lead-already-exists-error.ts
│       ├── factories/
│       ├── create-lead.ts
│       ├── create-lead.spec.ts
│       ├── get-lead.ts
│       ├── get-lead.spec.ts
│       ├── list-leads.ts
│       ├── list-leads.spec.ts
│       ├── update-lead.ts
│       ├── update-lead.spec.ts
│       ├── delete-lead.ts
│       └── delete-lead.spec.ts
│
├── repositories/
│   ├── in-memory/
│   ├── prisma/
│   └── leads-repository.ts
│
├── http/
│   ├── error-handler.ts
│   └── controllers/
│       ├── health/
│       │   ├── health.ts
│       │   ├── health.schema.ts
│       │   └── routes.ts
│       └── leads/
│           ├── create.ts
│           ├── create.schema.ts
│           ├── get.ts
│           ├── get.schema.ts
│           ├── list.ts
│           ├── list.schema.ts
│           ├── update.ts
│           ├── update.schema.ts
│           ├── delete.ts
│           ├── delete.schema.ts
│           └── routes.ts
│
└── ...

test/
├── helpers/
│   └── test-leads-repository.ts
├── health.test.ts
└── leads.test.ts
```

Utilize nomes em **kebab-case para arquivos e diretórios**, salvo se o projeto atual já possuir uma convenção diferente claramente estabelecida.

Classes e tipos devem utilizar PascalCase.

Variáveis e funções devem utilizar camelCase.

---

# 1. Repository Contract

Primeiro crie o contrato do repositório de Lead.

Exemplo conceitual:

```text
repositories/
└── leads-repository.ts
```

Esse arquivo representa uma **abstração**, e não uma implementação de banco de dados.

Ele deve declarar apenas as operações necessárias para os casos de uso.

Por exemplo, conforme forem necessárias:

```ts
create(...)
findById(...)
findByEmail(...)
findMany(...)
update(...)
delete(...)
```

IMPORTANTE:

Não adicione métodos ao contrato apenas porque "podem ser úteis no futuro".

Adicione uma operação quando existir um caso de uso que realmente precise dela.

O contrato não pode depender de Fastify, HTTP ou Controller.

Analise o Prisma Schema existente para utilizar os tipos adequados sem criar acoplamento desnecessário.

---

# 2. In-Memory Repository

Crie uma implementação em memória:

```text
repositories/
└── in-memory/
    └── in-memory-leads-repository.ts
```

Ela deve implementar o mesmo contrato utilizado pelo Prisma Repository.

Seu objetivo principal será permitir testes unitários rápidos sem depender de banco de dados real.

Exemplo conceitual:

```ts
export class InMemoryLeadsRepository implements LeadsRepository {
  public items = []

  // implementações
}
```

Ela deverá armazenar os registros em memória e reproduzir o comportamento necessário para os testes.

Não use Prisma Client nos testes unitários.

Não conecte ao banco.

Não faça mocks desnecessários do Prisma.

---

# 3. Prisma Repository

Crie posteriormente a implementação real:

```text
repositories/
└── prisma/
    └── prisma-leads-repository.ts
```

Ela deverá implementar exatamente o mesmo contrato:

```ts
export class PrismaLeadsRepository implements LeadsRepository {
  // ...
}
```

Sua responsabilidade é exclusivamente traduzir as operações definidas pelo contrato para operações no Prisma.

Exemplo:

```text
interface LeadsRepository
       ↑
       │ implements
       │
       ├── InMemoryLeadsRepository
       │
       └── PrismaLeadsRepository
```

Isso é fundamental.

O Use Case conhece:

```text
LeadsRepository
```

e NÃO:

```text
PrismaLeadsRepository
```

Assim conseguimos trocar a infraestrutura sem alterar a regra de negócio.

---

# 4. Use Cases

A regra de negócio ficará em `use-cases/<recurso>/`.

Comece pelo:

```text
use-cases/leads/create-lead.ts
```

Crie uma classe semelhante conceitualmente a:

```ts
export class CreateLeadUseCase {
  constructor(
    private leadsRepository: LeadsRepository,
  ) {}

  async execute(...) {
    // regra de negócio
  }
}
```

O repositório deve ser recebido no `constructor`.

NÃO faça isto dentro do Use Case:

```ts
const prisma = new PrismaClient()
```

NÃO faça:

```ts
const repository = new PrismaLeadsRepository()
```

Isso destruiria a inversão de dependência que queremos criar.

---

# CreateLead

Antes de implementar o DTO, verifique os campos definidos no Prisma Schema atual.

Não invente campos se eles já estiverem definidos no domínio.

O fluxo conceitual deverá ser:

```text
CreateLeadUseCase.execute()
        ↓
verifica regras de negócio
        ↓
LeadsRepository.findByEmail()
        ↓
caso permitido
        ↓
LeadsRepository.create()
        ↓
retorna Lead
```

Se email for uma propriedade obrigatória/única do domínio atual, o `CreateLeadUseCase` deve impedir duplicidade.

Não coloque essa regra no Controller.

---

# 5. Errors

Erros específicos de um recurso devem ficar co-localizados em
`use-cases/<recurso>/errors/`. Erros compartilhados entre recursos devem ficar
em `use-cases/errors/`.

```text
use-cases/
├── errors/
│   └── resource-not-found-error.ts
└── leads/
    └── errors/
        └── lead-already-exists-error.ts
```

Não quero código espalhado fazendo:

```ts
throw new Error('Lead already exists')
```

Crie classes próprias.

Exemplo conceitual:

```ts
export class LeadAlreadyExistsError extends Error {
  constructor() {
    super('Lead already exists.')

    this.name = 'LeadAlreadyExistsError'
  }
}
```

Quando necessário, siga o mesmo padrão para outros erros:

```text
LeadAlreadyExistsError
ResourceNotFoundError
DealAlreadyClosedError
InvalidDealStatusTransitionError
etc.
```

Não crie todos agora.

Crie somente os necessários para o caso de uso atual.

Os erros pertencem à regra de negócio.

O Controller posteriormente será responsável por transformar esses erros em respostas HTTP adequadas.

---

# 6. Testes unitários

Cada Use Case deve possuir seu respectivo arquivo `.spec.ts`.

Por exemplo:

```text
use-cases/leads/create-lead.ts
use-cases/leads/create-lead.spec.ts
```

Utilize **Vitest**, que é o padrão escolhido para este projeto.

Os testes de Use Case devem utilizar:

```text
InMemoryLeadsRepository
```

e nunca Prisma.

Estrutura conceitual:

```ts
describe('Create Lead Use Case', () => {
  let leadsRepository: InMemoryLeadsRepository
  let sut: CreateLeadUseCase

  beforeEach(() => {
    leadsRepository = new InMemoryLeadsRepository()
    sut = new CreateLeadUseCase(leadsRepository)
  })

  it('should be able to create a lead', async () => {
    // Arrange
    // Act
    // Assert
  })
})
```

Utilize preferencialmente o conceito:

```text
Arrange
Act
Assert
```

Não é obrigatório adicionar comentários `// Arrange`, `// Act`, `// Assert` se o código já estiver claro.

Para CreateLead, teste no mínimo:

- deve ser possível criar um Lead;
- o Lead deve realmente ter sido salvo no repositório em memória;
- se email for único no domínio, não deve ser possível cadastrar dois Leads com o mesmo email;
- o erro retornado deve ser o erro de domínio específico esperado.

Os testes devem validar comportamento, não detalhes internos irrelevantes da implementação.

---

# 7. Factories

Dentro de `use-cases/<recurso>/factories/`, crie factories responsáveis por
montar os Use Cases utilizados na camada HTTP.

Exemplo:

```text
make-create-lead-use-case.ts
```

Conceitualmente:

```ts
export function makeCreateLeadUseCase() {
  const leadsRepository = new PrismaLeadsRepository()
  const createLeadUseCase = new CreateLeadUseCase(leadsRepository)

  return createLeadUseCase
}
```

Essa será a composition root daquele caso de uso.

O Controller utilizará a factory.

Ele NÃO deverá instanciar diretamente Prisma ou repository.

---

# 8. HTTP

Depois que:

- Repository Contract
- InMemory Repository
- Use Case
- Errors
- Unit Tests
- Prisma Repository
- Factory

estiverem funcionando, implemente a camada HTTP.

Estrutura:

```text
http/
├── error-handler.ts
└── controllers/
    ├── health/
    │   ├── health.ts
    │   ├── health.schema.ts
    │   └── routes.ts
    └── leads/
        ├── create.ts
        ├── create.schema.ts
        ├── get.ts
        ├── get.schema.ts
        ├── list.ts
        ├── list.schema.ts
        ├── update.ts
        ├── update.schema.ts
        ├── delete.ts
        ├── delete.schema.ts
        └── routes.ts
```

Cada recurso HTTP (por exemplo `leads`, `health`, futuramente `sellers`, `deals`) deve possuir sua própria pasta dentro de `controllers/`.

Dentro dessa pasta, **todo endpoint** deve seguir o mesmo padrão de arquivos:

| Arquivo | Responsabilidade |
|---------|------------------|
| `<action>.ts` | Controller / handler HTTP |
| `<action>.schema.ts` | Schema OpenAPI/Scalar da rota |
| `routes.ts` | Registro das rotas do recurso |

Exemplos de actions: `create`, `get`, `list`, `update`, `delete`.

Para a action `delete`, o **arquivo** continua `delete.ts`, mas o **handler exportado** deve se chamar `remove`, porque `delete` é palavra reservada em JavaScript.

```ts
// delete.ts
export async function remove(request, reply) { ... }

// routes.ts
app.delete('/leads/:id', { schema: deleteLeadSchema }, remove)
```

Não utilize uma pasta global `http/routes/` separada dos controllers.

O Controller terá poucas responsabilidades:

1. receber dados da requisição;
2. validar dados com Zod;
3. chamar o Use Case;
4. interpretar o resultado;
5. retornar resposta HTTP.

---

# 9. Zod

Utilize **Zod** para validação dos dados recebidos via HTTP.

A validação HTTP de runtime pertence ao Controller.

Exemplo conceitual:

```ts
const createLeadBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
})
```

Porém, NÃO copie esses campos automaticamente.

Primeiro verifique o domínio e o Prisma Schema atual.

Depois:

```ts
const body = createLeadBodySchema.parse(request.body)
```

O Controller passa os dados validados para:

```ts
createLeadUseCase.execute(...)
```

Não coloque regra de negócio no schema do Zod.

Zod valida formato/entrada.

Use Case valida regra de negócio.

Importante: o schema Zod **não** é o mesmo arquivo do schema OpenAPI.

- Zod → validação tipada no Controller (`create.ts`)
- OpenAPI → documentação/validação declarativa da rota (`create.schema.ts`)

---

# 10. Controllers

O Controller deve permanecer extremamente simples.

Os handlers devem ter nomes curtos e descritivos da action (`create`, `get`, `list`, `update`, `delete`), e não nomes longos como `createLeadController`.

Conceitualmente:

```ts
export async function create(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = createLeadBodySchema.parse(request.body)

  const createLeadUseCase = makeCreateLeadUseCase()

  try {
    const result = await createLeadUseCase.execute(body)

    return reply.status(201).send(result)
  } catch (error) {
    // tradução de erro de domínio para HTTP
  }
}
```

Não copie esse código cegamente.

Adapte aos padrões e tipos existentes da aplicação.

Não coloque consultas Prisma no Controller.

Não coloque regra de negócio no Controller.

---

# 11. Tratamento de erros HTTP

Devemos diferenciar:

```text
Erro HTTP
```

de:

```text
Erro de domínio
```

Por exemplo:

```text
LeadAlreadyExistsError
```

é um erro de domínio.

O Use Case lança esse erro.

A camada HTTP decide que ele corresponde, por exemplo, a:

```text
409 Conflict
```

O Use Case NÃO deve conhecer o status 409.

Da mesma forma:

```text
ResourceNotFoundError
```

corresponde a:

```text
404 Not Found
```

Essa tradução pertence à camada HTTP.

Reutilize `ResourceNotFoundError` nos próximos módulos (Seller, Deal, Comments, etc.) sempre que o recurso buscado não existir. Não crie um erro `XxxNotFoundError` por entidade, salvo necessidade de domínio realmente distinta.

O tratamento global de erros HTTP (por exemplo `ZodError` e erros de validação do Fastify) deve ficar em `http/error-handler.ts`, registrado no `app.ts` via `app.setErrorHandler(errorHandler)`.

---

# 12. Rotas

As rotas devem ficar **co-localizadas** com os Controllers do recurso.

Exemplo conceitual para um recurso completo:

```text
http/controllers/leads/
├── create.ts
├── create.schema.ts
├── get.ts
├── get.schema.ts
├── list.ts
├── list.schema.ts
├── update.ts
├── update.schema.ts
├── delete.ts
├── delete.schema.ts
└── routes.ts
```

O arquivo `routes.ts` de cada recurso é responsável **apenas** por registrar as rotas daquele módulo.

Ele deve permanecer limpo: importar handlers, importar schemas OpenAPI e registrar com `.post`, `.get`, etc.

A definição de rota não deve conter regra de negócio.

Tampouco deve conter o JSON Schema OpenAPI inline.

Exemplo:

```ts
import type { FastifyInstance } from 'fastify'

import { create } from './create.js'
import { createLeadSchema } from './create.schema.js'
import { get } from './get.js'
import { getLeadSchema } from './get.schema.js'
import { list } from './list.js'
import { listLeadsSchema } from './list.schema.js'

export async function leadsRoutes(app: FastifyInstance) {
  app.post('/leads', { schema: createLeadSchema }, create)
  app.get('/leads', { schema: listLeadsSchema }, list)
  app.get('/leads/:id', { schema: getLeadSchema }, get)
  app.put('/leads/:id', { schema: updateLeadSchema }, update)
  app.delete('/leads/:id', { schema: deleteLeadSchema }, remove)
}
```

No `app.ts`, o bootstrap da aplicação deve permanecer limpo.

Ele apenas registra plugins e módulos de rotas com `.register`:

```ts
await app.register(healthRoutes, { database })
await app.register(leadsRoutes)
```

Não defina handlers de endpoints diretamente dentro de `app.ts`.

Mantenha a configuração HTTP organizada.

---

# 13. Schemas OpenAPI / Scalar

O projeto utiliza **Scalar** para documentação da API, com OpenAPI gerado via `@fastify/swagger`.

Para cada endpoint, crie um arquivo `<action>.schema.ts` ao lado do controller.

Exemplo:

```text
create.ts
create.schema.ts
```

Esse arquivo exporta o schema OpenAPI da rota, por exemplo:

```ts
export const createLeadSchema = {
  tags: ['Leads'],
  summary: 'Create a lead',
  body: {
    // ...
  },
  response: {
    // ...
  },
} as const
```

Regras:

1. Todo endpoint documentado deve ter seu `<action>.schema.ts`.
2. O `routes.ts` apenas referencia esse schema: `{ schema: createLeadSchema }`.
3. Não polua `routes.ts` com JSON Schema inline.
4. Não coloque schema OpenAPI dentro do Use Case.
5. Não misture Zod e OpenAPI no mesmo arquivo, salvo necessidade excepcional justificada.
6. Não adicione Swagger UI.

Quando criarmos novos endpoints, mantenha a documentação compatível com a configuração atual de OpenAPI/Scalar do projeto.

Antes de alterar qualquer configuração global relacionada à documentação, analise primeiro como Scalar/OpenAPI já está configurado no código.

---

# 14. Path aliases (`@/`)

O projeto utiliza o alias `@/` apontando para `apps/api/src`.

Configuração relevante:

- `tsconfig.json` → `paths: { "@/*": ["./src/*"] }`
- `vitest.config.ts` → `resolve.alias`
- `build` → `tsc` + `tsc-alias` (reescreve `@/` no `dist` para caminhos relativos)

Regra de uso:

- imports entre pastas diferentes de `src/` → preferir `@/...`
- imports entre arquivos da **mesma pasta** → manter relativo `./...`
- sempre manter a extensão `.js` nos imports ESM

Exemplos:

```ts
import { makeCreateLeadUseCase } from '@/use-cases/leads/factories/make-create-lead-use-case.js'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js'
import { create } from './create.js'
```

Ao criar novos módulos (Seller, Deal, etc.), use o mesmo padrão de alias.

---

# 15. Estratégia de testes

Existem **dois tipos** de testes, em pastas diferentes:

| Tipo | Onde | Ferramenta | Dependência |
|------|------|------------|-------------|
| Unitário (Use Case) | `src/use-cases/<recurso>/*.spec.ts` | Vitest + InMemory Repository | Sem HTTP, sem Prisma |
| HTTP (rotas) | `test/*.test.ts` | Vitest + `app.inject()` | Sem banco real; factories mockadas com InMemory |

Regras:

1. Todo Use Case novo deve ter seu `.spec.ts` **ao lado** do arquivo do use case.
2. Todo recurso HTTP exposto deve ter testes de rota em `test/<recurso>.test.ts`.
3. Testes de rota **não** devem depender do Postgres.
4. Nos testes HTTP, mocke as factories para usar o repositório em memória (veja `test/leads.test.ts` e `test/helpers/`).
5. Não mova os `.spec.ts` dos use cases para `test/` — a colocalização é intencional.

Checklist de testes para cada novo módulo:

```text
□ Use Case + .spec.ts (InMemory)
□ Factory
□ Controller + schema + route
□ test/<recurso>.test.ts cobrindo status HTTP principais (2xx, 4xx)
```

---

# CRUD de Lead

O módulo **Lead** já está completo e é a **referência arquitetural** do projeto.

Sequência implementada:

```text
CreateLead  → POST   /leads
GetLead     → GET    /leads/:id
ListLeads   → GET    /leads
UpdateLead  → PUT    /leads/:id
DeleteLead  → DELETE /leads/:id
```

Cada comportamento é um Use Case independente.

NÃO crie algo como:

```ts
class LeadService {
  create()
  find()
  update()
  delete()
}
```

Prefira casos de uso específicos:

```text
CreateLeadUseCase
GetLeadUseCase
ListLeadsUseCase
UpdateLeadUseCase
DeleteLeadUseCase
```

Isso deixa cada classe com uma responsabilidade clara.

Cada Use Case relevante possui seu próprio `.spec.ts`.

Na camada HTTP, cada Use Case exposto possui:

```text
http/controllers/<recurso>/<action>.ts
http/controllers/<recurso>/<action>.schema.ts
```

e é registrado em:

```text
http/controllers/<recurso>/routes.ts
```

Ao implementar Seller, Deal, Comments ou Authentication, **copie o padrão de Lead**, não reinvente a estrutura.
---

# Não implementar tudo de uma vez

IMPORTANTE:

Não saia criando todos os módulos do sistema automaticamente.

**Lead** já é o módulo de referência consolidado.

A implementação dos próximos módulos deve acontecer incrementalmente, um domínio por vez.

Ordem recomendada:

```text
Seller
↓
Deal
↓
Comments
↓
Authentication
```

Deal terá regras de negócio mais complexas, porque deverá:

- estar associado a um Lead;
- estar associado a um Seller;
- possuir status;
- permitir transição de status;
- poder ser marcado como ganho;
- poder ser marcado como perdido.

Por isso Seller vem antes de Deal.

## Ciclo de status de Deal

```text
NEW → IN_PROGRESS
  └──────────────→ WON
  └──────────────→ LOST
IN_PROGRESS ─────→ WON
IN_PROGRESS ─────→ LOST
```

- Todo Deal é criado com status `NEW`.
- `PATCH /deals/:id/status` realiza a transição para `IN_PROGRESS`.
- `PATCH /deals/:id/won` e `PATCH /deals/:id/lost` encerram explicitamente o Deal.
- `WON` e `LOST` são estados finais: Deals encerrados não podem ser editados ou transicionados.
- Transições inválidas devem lançar `InvalidDealStatusTransitionError`.
- Operações em Deals encerrados devem lançar `DealAlreadyClosedError`.

## Comentários por recurso

- Cada comentário pertence a exatamente um Lead ou a um Deal.
- O contrato de criação deve impedir ambos os alvos simultaneamente.
- A migration adiciona uma restrição `CHECK` para proteger essa invariável no PostgreSQL.
- Criação e listagem usam rotas aninhadas em `/leads/:leadId/comments` e `/deals/:dealId/comments`.
- Leitura, edição e exclusão individuais usam `/comments/:id`.
- Conteúdo vazio após `trim` deve lançar `InvalidCommentContentError`.
- Comentários podem ser adicionados a Deals encerrados para manter o histórico.

## Authentication

- Model `User` separado (`name`, `email` único, `passwordHash`). `Seller` permanece entidade de negócio, sem vínculo obrigatório nesta etapa.
- Access token: JWT Bearer (`Authorization: Bearer <token>`), curto, assinado com `JWT_SECRET`.
- Refresh token: opaco, persistido apenas como hash (`RefreshToken.tokenHash`); resposta devolve o valor em claro uma vez.
- Rotas:
  - `POST /auth/register` → `201` com `{ user, accessToken, refreshToken }`
  - `POST /auth/login` → `200` com o mesmo shape
  - `POST /auth/refresh` → `200` com novo par (rotação: revoga o refresh anterior)
  - `POST /auth/logout` → `204` (revoga o refresh; idempotente)
  - `GET /auth/me` → `200` com `{ user }` (Bearer obrigatório)
- Erros: `InvalidCredentialsError` / `InvalidRefreshTokenError` → `401`; `UserAlreadyExistsError` → `409`; senha inválida → `400`.
- Rotas protegidas: `/leads`, `/sellers`, `/deals`, `/comments` e `GET /auth/me`.
- Rotas públicas: `/health` e demais `/auth/*` (exceto `/me`).
- Env: `JWT_SECRET`, `JWT_ACCESS_EXPIRES_IN` (default `15m`), `JWT_REFRESH_EXPIRES_IN` (default `7d`).

---

# YAGNI

Não implemente funcionalidades "para o futuro".

Não crie abstrações sem uma necessidade concreta.

Não crie:

- BaseRepository genérico;
- BaseController;
- BaseUseCase;
- abstrações excessivamente genéricas;
- helpers sem necessidade;
- classes apenas para aumentar a quantidade de camadas.

Queremos boa arquitetura, não overengineering.

---

# Tipagem

Evite:

```ts
any
```

Não utilize `any` para resolver problemas de TypeScript.

Não faça casts desnecessários:

```ts
as any
```

Não silencie erros de TypeScript.

Não utilize `@ts-ignore`.

Resolva corretamente os tipos.

Utilize inferência quando melhorar a legibilidade.

Use tipos explícitos quando fizerem parte de contratos importantes.

---

# Prisma

O Prisma é infraestrutura.

Evite deixar tipos específicos do Prisma vazarem para todas as camadas sem necessidade.

Analise caso a caso.

Não inicialize vários `PrismaClient`.

Se o projeto já possuir singleton/provider para Prisma, reutilize-o.

Não altere migrations existentes sem necessidade.

Antes de gerar migration, verifique o schema atual.

---

# Qualidade

Antes de considerar uma etapa concluída, execute os comandos disponíveis no projeto para:

```text
typecheck
lint
test
```

Use os scripts realmente existentes no `package.json`.

Não invente comandos.

Se houver erro:

1. investigue a causa;
2. corrija a causa;
3. não desabilite a regra apenas para fazer passar.

---

# Regra importante sobre alterações

NÃO faça grandes refatorações fora do escopo atual.

NÃO altere arquivos que não precisem ser alterados.

NÃO remova código existente sem justificar.

NÃO modifique configuração global apenas para resolver um problema local.

NÃO adicione dependência se o problema puder ser resolvido adequadamente com o que já existe.

Preserve o endpoint `/health`.

---

# Documentação da API

Siga a seção **13. Schemas OpenAPI / Scalar**.

Resumo obrigatório para todo endpoint:

- usar Scalar (não Swagger UI);
- criar `<action>.schema.ts` ao lado do controller;
- registrar no `routes.ts` com `{ schema: ... }`;
- não colocar JSON Schema OpenAPI inline em `routes.ts` ou `app.ts`.

---

# Padrão que os módulos futuros deverão seguir

Ao terminarmos Lead, este módulo será considerado nossa referência.

Quando posteriormente eu disser:

> "implemente Deal seguindo o padrão do projeto"

você deverá analisar Lead e reproduzir os mesmos princípios:

```text
Repository Contract
      ↑
      ├── InMemory Repository
      └── Prisma Repository

Controller
      ↓
Factory
      ↓
Use Case
      ↓
Repository Contract
```

com:

```text
Use Case
Use Case Spec
Errors
Factory
Controller          → http/controllers/<recurso>/<action>.ts
OpenAPI Schema      → http/controllers/<recurso>/<action>.schema.ts
Route registration  → http/controllers/<recurso>/routes.ts
App bootstrap       → app.register(<recurso>Routes)
Zod validation      → dentro do Controller
Repository
```

Checklist HTTP obrigatório para **cada** endpoint:

1. criar `<action>.ts` (controller);
2. criar `<action>.schema.ts` (OpenAPI/Scalar);
3. registrar em `routes.ts` com `{ schema: <action>Schema }`;
4. registrar o módulo no `app.ts` com `app.register(...)` se ainda não estiver registrado;
5. validar entrada com Zod no controller;
6. traduzir erros de domínio para HTTP no controller / error-handler;
7. não poluir `app.ts` nem `routes.ts` com handlers ou schemas inline;
8. usar imports `@/` entre pastas de `src/`;
9. criar `.spec.ts` do Use Case + teste HTTP em `test/` quando o recurso for exposto.

sempre respeitando a necessidade específica daquele domínio.

---

# Estado atual e próximos passos

## Já consolidado

- Health (`GET /health`)
- Lead CRUD completo (`POST/GET/PUT/DELETE /leads`)
- Seller CRUD completo (`POST/GET/PUT/DELETE /sellers`)
- Deal CRUD e ciclo de status (`NEW → IN_PROGRESS → WON/LOST`)
- Comments vinculados exclusivamente a Lead ou Deal
- Authentication (register/login/refresh/logout/me) com JWT + refresh e rotas CRM protegidas
- Path alias `@/`
- Testes unitários (use cases) + testes HTTP (`test/`)
- OpenAPI/Scalar

Lead, Seller, Deal, Comments e Authentication consolidam o padrão backend. Novos módulos devem seguir a mesma arquitetura.

## Próximo passo

```text
Frontend (monorepo) — login e fluxo CRM consumindo a API
```

Antes de implementar o frontend (ou qualquer módulo novo):

1. analise o Prisma Schema e proponha/ajuste o model se necessário;
2. apresente o planejamento (arquivos a criar/alterar, regras de negócio, rotas, testes);
3. só implemente após alinhamento.

Checklist mínimo por módulo novo:

```text
□ Model Prisma (+ migration, se necessário)
□ Repository contract
□ InMemory + Prisma repositories
□ Use Cases + .spec.ts
□ Errors de domínio (reutilizar ResourceNotFoundError quando couber)
□ Factories
□ Controllers + schemas OpenAPI + routes.ts
□ app.register(...)
□ test/<recurso>.test.ts
□ typecheck / lint / test
```

Árvore de referência (Lead):

```text
src/
├── use-cases/
│   ├── errors/
│   │   └── resource-not-found-error.ts
│   └── leads/
│       ├── errors/
│       │   └── lead-already-exists-error.ts
│       ├── factories/
│       │   ├── make-create-lead-use-case.ts
│       │   ├── make-get-lead-use-case.ts
│       │   ├── make-list-leads-use-case.ts
│       │   ├── make-update-lead-use-case.ts
│       │   └── make-delete-lead-use-case.ts
│       ├── create-lead.ts
│       ├── create-lead.spec.ts
│       ├── get-lead.ts
│       ├── get-lead.spec.ts
│       ├── list-leads.ts
│       ├── list-leads.spec.ts
│       ├── update-lead.ts
│       ├── update-lead.spec.ts
│       ├── delete-lead.ts
│       └── delete-lead.spec.ts
│
├── repositories/
│   ├── in-memory/
│   │   └── in-memory-leads-repository.ts
│   ├── prisma/
│   │   └── prisma-leads-repository.ts
│   └── leads-repository.ts
│
└── http/
    ├── error-handler.ts
    └── controllers/
        ├── health/
        └── leads/
            ├── create.ts / create.schema.ts
            ├── get.ts / get.schema.ts
            ├── list.ts / list.schema.ts
            ├── update.ts / update.schema.ts
            ├── delete.ts / delete.schema.ts
            └── routes.ts

test/
├── helpers/
│   └── test-leads-repository.ts
├── health.test.ts
└── leads.test.ts
```

Padrão HTTP obrigatório para **todos** os endpoints:

```text
<action>.ts + <action>.schema.ts + routes.ts
```

com registro no `app.ts` via `app.register(...)`.
