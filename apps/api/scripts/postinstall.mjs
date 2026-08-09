import { execSync } from 'node:child_process'

// `prisma generate` reads prisma.config.ts, which requires DATABASE_URL.
// Web-only CI (e.g. Vercel) installs the workspace without a real DB URL.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://postgres:postgres@127.0.0.1:5432/postgres'
}

execSync('prisma generate', {
  stdio: 'inherit',
  env: process.env,
})
