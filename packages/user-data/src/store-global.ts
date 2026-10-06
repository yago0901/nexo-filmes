import { repositorioUsuario } from './repositorio-padrao';
import { criarStoreFavoritos } from './store-favoritos';
import type { StoreFavoritos } from './store-favoritos';

type GlobalComStore = typeof globalThis & { __nexoStoreFavoritos?: StoreFavoritos };

export function obterStoreFavoritos(): StoreFavoritos {
  const alvo = globalThis as GlobalComStore;
  const existente = alvo.__nexoStoreFavoritos;
  if (existente) return existente;
  const criado = criarStoreFavoritos(repositorioUsuario);
  alvo.__nexoStoreFavoritos = criado;
  return criado;
}