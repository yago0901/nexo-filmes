import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/configuracao-de-testes.ts'],
    env: {
      PUBLIC_REPO_DELAY: 'false',
      PUBLIC_REPO_FAIL: 'false',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/estado-url.ts',
        'src/useValorComDebounce.ts',
        'src/dados.ts',
        'src/BarraDeFiltros.tsx',
        'src/Paginacao.tsx',
      ],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/main.tsx',
        'src/bootstrap.tsx',
        'src/index.tsx',
        'src/configuracao-de-testes.ts',
        'src/auxiliares-de-teste.ts',
      ],
      thresholds: { lines: 70, functions: 70, branches: 70, statements: 70 },
    },
  },
});