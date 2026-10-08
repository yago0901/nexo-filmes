import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/configuracao-de-testes.ts'],
    env: {
      PUBLIC_REPO_DELAY: 'false',
      PUBLIC_REPO_FAIL: 'false',
    },
  },
});