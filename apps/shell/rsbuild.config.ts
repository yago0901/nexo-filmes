import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'shell',
      remotes: {
        catalogo: `catalogo@${process.env.CATALOGO_URL ?? 'http://localhost:3001'}/mf-manifest.json`,
        filme: `filme@${process.env.FILME_URL ?? 'http://localhost:3002'}/mf-manifest.json`,
        minhaArea: `minhaArea@${process.env.MINHA_AREA_URL ?? 'http://localhost:3003'}/mf-manifest.json`,
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        'react-router-dom': { singleton: true },
      },
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
});