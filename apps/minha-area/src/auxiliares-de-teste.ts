import type { Avaliacao, Favorito } from '@nexo/shared-types';

export function criarFavorito(
  id: number,
  titulo = `Filme ${id}`,
  favoritadoEm = '2026-10-01T10:00:00.000Z',
): Favorito {
  return {
    filme: { id, titulo, ano: 2020, posterUrl: null, generos: ['Drama'] },
    favoritadoEm,
  };
}

export function criarAvaliacao(filmeId: number, nota: number): Avaliacao {
  return { filmeId, nota, comentario: '', atualizadaEm: '2026-10-02T10:00:00.000Z' };
}