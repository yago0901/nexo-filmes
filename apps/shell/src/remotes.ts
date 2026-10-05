import { loadRemote, registerRemotes } from '@module-federation/enhanced/runtime';
import type { ComponentType } from 'react';

const urls: Record<string, string> = {
  catalogo: import.meta.env.PUBLIC_CATALOGO_URL ?? 'http://localhost:3001',
  filme: import.meta.env.PUBLIC_FILME_URL ?? 'http://localhost:3002',
  minhaArea: import.meta.env.PUBLIC_MINHA_AREA_URL ?? 'http://localhost:3003',
};

registerRemotes(
  Object.entries(urls).map(([name, url]) => ({
    name,
    entry: `${url}/mf-manifest.json`,
  })),
);

export function carregarRemote(id: string) {
  return async (): Promise<{ default: ComponentType }> => {
    const modulo = await loadRemote<{ default: ComponentType }>(id);
    if (!modulo) throw new Error(`Não foi possível carregar o remote ${id}`);
    return modulo;
  };
}