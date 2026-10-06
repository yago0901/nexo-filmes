import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import type { FilmeResumo } from '@nexo/shared-types';
import {
  contarFavoritos,
  estaFavoritado,
  estaSalvando,
  listarFavoritos,
} from './estado-favoritos';
import type { EstadoFavoritos } from './estado-favoritos';
import { obterStoreFavoritos } from './store-global';

function useEstadoFavoritos(): EstadoFavoritos {
  const store = obterStoreFavoritos();
  const estado = useSyncExternalStore(store.assinar, store.obterEstado);

  useEffect(() => {
    void store.carregar();
  }, [store]);

  return estado;
}

export function useFavoritos() {
  const estado = useEstadoFavoritos();
  const favoritos = useMemo(() => listarFavoritos(estado), [estado]);
  const recarregar = useCallback(() => obterStoreFavoritos().carregar(), []);

  return {
    status: estado.status,
    favoritos,
    total: contarFavoritos(estado),
    recarregar,
  };
}

export function useFavorito(filme: FilmeResumo) {
  const estado = useEstadoFavoritos();
  const alternar = useCallback(() => obterStoreFavoritos().alternarFavorito(filme), [filme]);

  return {
    pronto: estado.status === 'pronto',
    favoritado: estaFavoritado(estado, filme.id),
    salvando: estaSalvando(estado, filme.id),
    alternar,
  };
}