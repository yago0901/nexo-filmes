import { beforeEach, describe, expect, it } from 'vitest';
import type { Avaliacao, Favorito } from '@nexo/shared-types';
import { armazenamentoLocal } from './armazenamento';

const favorito: Favorito = {
  filme: { id: 1, titulo: 'Clube da Luta', ano: 1999, posterUrl: null, generos: ['Drama'] },
  favoritadoEm: '2026-10-01T10:00:00.000Z',
};

const avaliacao: Avaliacao = {
  filmeId: 1,
  nota: 8.5,
  comentario: 'Muito bom',
  atualizadaEm: '2026-10-02T10:00:00.000Z',
};

describe('armazenamentoLocal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('favoritos', () => {
    it('devolve lista vazia quando não há nada salvo', () => {
      expect(armazenamentoLocal.lerFavoritos()).toEqual([]);
    });

    it('grava e lê favoritos', () => {
      armazenamentoLocal.gravarFavoritos([favorito]);
      expect(armazenamentoLocal.lerFavoritos()).toEqual([favorito]);
    });

    it('devolve lista vazia quando o JSON está corrompido', () => {
      localStorage.setItem('nexo:favoritos', '{não é json');
      expect(armazenamentoLocal.lerFavoritos()).toEqual([]);
    });

    it('devolve lista vazia quando o conteúdo não é um array', () => {
      localStorage.setItem('nexo:favoritos', JSON.stringify({ foo: 'bar' }));
      expect(armazenamentoLocal.lerFavoritos()).toEqual([]);
    });

    it('usa a chave nexo:favoritos', () => {
      armazenamentoLocal.gravarFavoritos([favorito]);
      expect(localStorage.getItem('nexo:favoritos')).not.toBeNull();
    });
  });

  describe('avaliações', () => {
    it('devolve lista vazia quando não há nada salvo', () => {
      expect(armazenamentoLocal.lerAvaliacoes()).toEqual([]);
    });

    it('grava e lê avaliações', () => {
      armazenamentoLocal.gravarAvaliacoes([avaliacao]);
      expect(armazenamentoLocal.lerAvaliacoes()).toEqual([avaliacao]);
    });

    it('devolve lista vazia quando o JSON está corrompido', () => {
      localStorage.setItem('nexo:avaliacoes', 'xpto');
      expect(armazenamentoLocal.lerAvaliacoes()).toEqual([]);
    });

    it('usa a chave nexo:avaliacoes', () => {
      armazenamentoLocal.gravarAvaliacoes([avaliacao]);
      expect(localStorage.getItem('nexo:avaliacoes')).not.toBeNull();
    });
  });
});