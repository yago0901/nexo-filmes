import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
      pluginReact(),
      pluginModuleFederation({
        name: 'filme',
        exposes: { './Routes': './src/Routes.tsx' },
        shared: {
          react: { singleton: true, requiredVersion: '^19.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
          'react-router-dom': { singleton: true },
        },
      }),
    ],
  server: {
    port: 3002,
    strictPort: true,
  },
});
