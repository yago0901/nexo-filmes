import type { Avaliacao, Favorito } from '@nexo/shared-types';

const CHAVE_FAVORITOS = 'nexo:favoritos';
const CHAVE_AVALIACOES = 'nexo:avaliacoes';

export interface Armazenamento {
  lerFavoritos(): Favorito[];
  gravarFavoritos(favoritos: Favorito[]): void;
  lerAvaliacoes(): Avaliacao[];
  gravarAvaliacoes(avaliacoes: Avaliacao[]): void;
}

function lerLista<T>(chave: string): T[] {
  try {
    const bruto = localStorage.getItem(chave);
    if (!bruto) return [];
    const dados: unknown = JSON.parse(bruto);
    return Array.isArray(dados) ? (dados as T[]) : [];
  } catch {
    return [];
  }
}

function gravarLista<T>(chave: string, lista: T[]): void {
  localStorage.setItem(chave, JSON.stringify(lista));
}

export const armazenamentoLocal: Armazenamento = {
  lerFavoritos: () => lerLista<Favorito>(CHAVE_FAVORITOS),
  gravarFavoritos: (favoritos) => gravarLista(CHAVE_FAVORITOS, favoritos),
  lerAvaliacoes: () => lerLista<Avaliacao>(CHAVE_AVALIACOES),
  gravarAvaliacoes: (avaliacoes) => gravarLista(CHAVE_AVALIACOES, avaliacoes),
};