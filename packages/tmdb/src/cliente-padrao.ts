import { criarClienteTmdb } from './cliente';

export const clienteTmdb = criarClienteTmdb({
  token: import.meta.env.PUBLIC_TMDB_TOKEN ?? '',
});