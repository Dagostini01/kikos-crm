import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
    },
  },
  test: {
    include: ['src/**/*.{spec,test}.ts', 'test/**/*.{spec,test}.ts'],
    env: {
      JWT_SECRET: 'test-only-secret-key-with-32chars!!',
      JWT_ACCESS_EXPIRES_IN: '15m',
      JWT_REFRESH_EXPIRES_IN: '7d',
    },
  },
});
