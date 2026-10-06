import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { clienteTmdb } from '@nexo/tmdb';
import type { FiltrosCatalogo } from './estado-url';

export function useGeneros() {
  return useQuery({
    queryKey: ['generos'],
    queryFn: () => clienteTmdb.listarGeneros(),
    staleTime: Infinity,
  });
}

export function useFilmes(filtros: FiltrosCatalogo) {
  return useQuery({
    queryKey: ['filmes', filtros],
    queryFn: () =>
      filtros.termo
        ? clienteTmdb.buscarFilmes({ termo: filtros.termo, pagina: filtros.pagina })
        : clienteTmdb.listarFilmes({
            pagina: filtros.pagina,
            generoId: filtros.generoId ?? undefined,
          }),
    placeholderData: keepPreviousData,
  });
}