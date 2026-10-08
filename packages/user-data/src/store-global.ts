import { repositorioUsuario } from './repositorio-padrao';
import { criarStoreAvaliacoes } from './store-avaliacoes';
import type { StoreAvaliacoes } from './store-avaliacoes';
import { criarStoreFavoritos } from './store-favoritos';
import type { StoreFavoritos } from './store-favoritos';

type GlobalComStores = typeof globalThis & {
  __nexoStoreFavoritos?: StoreFavoritos;
  __nexoStoreAvaliacoes?: StoreAvaliacoes;
};

export function obterStoreFavoritos(): StoreFavoritos {
  const alvo = globalThis as GlobalComStores;
  const existente = alvo.__nexoStoreFavoritos;
  if (existente) return existente;
  const criado = criarStoreFavoritos(repositorioUsuario);
  alvo.__nexoStoreFavoritos = criado;
  return criado;
}

export function obterStoreAvaliacoes(): StoreAvaliacoes {
  const alvo = globalThis as GlobalComStores;
  const existente = alvo.__nexoStoreAvaliacoes;
  if (existente) return existente;
  const criado = criarStoreAvaliacoes(repositorioUsuario);
  alvo.__nexoStoreAvaliacoes = criado;
  return criado;
}