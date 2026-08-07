# Kikos CRM

Monorepo pnpm do Kikos CRM. A API usa Fastify, TypeScript, PostgreSQL e Prisma.

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
pnpm dev
```

A API fica disponível em `http://localhost:3333`. Para verificar aplicação e banco:

```powershell
Invoke-RestMethod http://localhost:3333/health
```

O arquivo `apps/api/.env` contém somente valores locais e não é versionado. Atualize
`apps/api/.env.example` sempre que uma variável obrigatória for adicionada.

## Comandos

- `pnpm dev`: inicia a API com reload.
- `pnpm build`: gera a saída de produção em `apps/api/dist`.
- `pnpm start`: executa a saída de produção.
- `pnpm lint`: valida o código com ESLint.
- `pnpm format`: formata a API com Prettier.
- `pnpm typecheck`: verifica os tipos sem gerar arquivos.
- `pnpm test`: executa os testes com Vitest.
- `pnpm db:generate`: gera o Prisma Client.
- `pnpm db:migrate`: aplica migrations em desenvolvimento.
- `pnpm db:studio`: abre o Prisma Studio.

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
  api/
    prisma/       schema e migrations
    src/          código da aplicação
    test/         testes
docker-compose.yml
pnpm-workspace.yaml
```
