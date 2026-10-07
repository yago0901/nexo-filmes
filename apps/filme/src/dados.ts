import { useQuery } from '@tanstack/react-query';
import { clienteTmdb } from '@nexo/tmdb';

export function useFilmeDetalhe(id: number) {
  return useQuery({
    queryKey: ['filme', id],
    queryFn: () => clienteTmdb.obterDetalhe(id),
  });
}