import { resolve } from 'node:path';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const { publicVars } = loadEnv({ cwd: resolve(process.cwd(), '../..') });

export default defineConfig({
  name: 'shell',
  dts: false,
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'shell',
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
    port: 3000,
    strictPort: true,
  },
});