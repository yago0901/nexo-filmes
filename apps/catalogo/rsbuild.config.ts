import { resolve } from 'node:path';
import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

const { publicVars } = loadEnv({ cwd: resolve(process.cwd(), '../..') });

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'catalogo',
      exposes: { './Routes': './src/Routes.tsx' },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react-router-dom': { singleton: true },
      },
    }),
  ],
  source: {
    define: publicVars,
  },
  server: {
    port: 3001,
    strictPort: true,
  },
});
