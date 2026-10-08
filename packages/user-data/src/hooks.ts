import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import type { FilmeResumo } from '@nexo/shared-types';
import {
  listarAvaliacoesDoEstado,
  obterAvaliacaoDoEstado,
} from './estado-avaliacoes';
import type { EstadoAvaliacoes } from './estado-avaliacoes';
import {
  contarFavoritos,
  estaFavoritado,
  estaSalvando,
  listarFavoritos,
} from './estado-favoritos';
import type { EstadoFavoritos } from './estado-favoritos';
import type { NovaAvaliacao } from './repositorio';
import { obterStoreAvaliacoes, obterStoreFavoritos } from './store-global';

export type DadosAvaliacao = Omit<NovaAvaliacao, 'filmeId'>;

function useEstadoFavoritos(): EstadoFavoritos {
  const store = obterStoreFavoritos();
  const estado = useSyncExternalStore(store.assinar, store.obterEstado);

  useEffect(() => {
    void store.carregar();
  }, [store]);

  return estado;
}

function useEstadoAvaliacoes(): EstadoAvaliacoes {
  const store = obterStoreAvaliacoes();
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

export function useAvaliacoes() {
  const estado = useEstadoAvaliacoes();
  const avaliacoes = useMemo(() => listarAvaliacoesDoEstado(estado), [estado]);
  const recarregar = useCallback(() => obterStoreAvaliacoes().carregar(), []);

  return {
    status: estado.status,
    avaliacoes,
    total: avaliacoes.length,
    recarregar,
  };
}

export function useAvaliacao(filmeId: number) {
  const estado = useEstadoAvaliacoes();
  const salvar = useCallback(
    (dados: DadosAvaliacao) => obterStoreAvaliacoes().salvar({ filmeId, ...dados }),
    [filmeId],
  );
  const recarregar = useCallback(() => obterStoreAvaliacoes().carregar(), []);

  return {
    status: estado.status,
    avaliacao: obterAvaliacaoDoEstado(estado, filmeId),
    salvar,
    recarregar,
  };
}