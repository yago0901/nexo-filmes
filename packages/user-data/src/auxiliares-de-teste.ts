import type { Avaliacao, Favorito, FilmeResumo } from '@nexo/shared-types';
import type { Armazenamento } from './armazenamento';

export function criarArmazenamentoEmMemoria(): Armazenamento {
  let favoritos: Favorito[] = [];
  let avaliacoes: Avaliacao[] = [];
  return {
    lerFavoritos: () => favoritos,
    gravarFavoritos: (novos) => {
      favoritos = novos;
    },
    lerAvaliacoes: () => avaliacoes,
    gravarAvaliacoes: (novas) => {
      avaliacoes = novas;
    },
  };
}

export function criarFilme(id: number): FilmeResumo {
  return { id, titulo: `Filme ${id}`, ano: 2020, posterUrl: null, generos: ['Drama'] };
}

export function criarFavorito(id: number, favoritadoEm = '2026-10-01T10:00:00.000Z'): Favorito {
  return { filme: criarFilme(id), favoritadoEm };
}

export function criarAvaliacao(
  filmeId: number,
  nota = 8,
  atualizadaEm = '2026-10-01T10:00:00.000Z',
): Avaliacao {
  return { filmeId, nota, comentario: '', atualizadaEm };
}