import { criarClienteTmdb } from './cliente';

declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_TMDB_TOKEN?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export const clienteTmdb = criarClienteTmdb({
  token: import.meta.env.PUBLIC_TMDB_TOKEN ?? '',
});