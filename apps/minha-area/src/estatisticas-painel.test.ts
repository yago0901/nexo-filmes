import { describe, expect, it } from 'vitest';
import { criarAvaliacao, criarFavorito } from './auxiliares-de-teste';
import {
  calcularEstatisticas,
  calcularNotaMedia,
  encontrarGeneroMaisFrequente,
} from './estatisticas-painel';

function criarAvaliacoes(...notas: number[]) {
  return notas.map((nota, indice) => criarAvaliacao(indice + 1, nota));
}

function criarFavoritosComGeneros(...generosPorFilme: string[][]) {
  return generosPorFilme.map((generos, indice) =>
    criarFavorito(indice + 1, `Filme ${indice + 1}`, '2026-10-01T10:00:00.000Z', generos),
  );
}

const CASOS_DE_MEDIA: [number[], number][] = [
  [[8], 8],
  [[0.5], 0.5],
  [[10], 10],
  [[8, 9], 8.5],
  [[8, 8.5], 8.3],
  [[9.5, 10], 9.8],
  [[7, 8, 8], 7.7],
  [[10, 10, 9.5], 9.8],
  [[0.5, 0.5, 1], 0.7],
];

describe('calcularNotaMedia', () => {
  it('devolve null quando não há avaliações', () => {
    expect(calcularNotaMedia([])).toBeNull();
  });

  it.each(CASOS_DE_MEDIA)('a média de %j é %s', (notas, esperada) => {
    expect(calcularNotaMedia(criarAvaliacoes(...notas))).toBe(esperada);
  });
});

describe('encontrarGeneroMaisFrequente', () => {
  it('devolve null quando não há favoritos', () => {
    expect(encontrarGeneroMaisFrequente([])).toBeNull();
  });

  it('devolve null quando nenhum filme tem gênero', () => {
    expect(encontrarGeneroMaisFrequente(criarFavoritosComGeneros([], []))).toBeNull();
  });

  it('devolve o gênero que aparece em mais filmes', () => {
    const favoritos = criarFavoritosComGeneros(['Drama', 'Ação'], ['Drama'], ['Comédia']);

    expect(encontrarGeneroMaisFrequente(favoritos)).toBe('Drama');
  });

  it('desempata pela ordem alfabética, qualquer que seja a ordem dos filmes', () => {
    expect(encontrarGeneroMaisFrequente(criarFavoritosComGeneros(['Drama'], ['Ação']))).toBe(
      'Ação',
    );
    expect(encontrarGeneroMaisFrequente(criarFavoritosComGeneros(['Ação'], ['Drama']))).toBe(
      'Ação',
    );
  });

  it('desempata entre vários gêneros pelo primeiro em ordem alfabética', () => {
    const favoritos = criarFavoritosComGeneros(['Terror'], ['Aventura'], ['Comédia']);

    expect(encontrarGeneroMaisFrequente(favoritos)).toBe('Aventura');
  });

  it('conta um gênero repetido no mesmo filme uma única vez', () => {
    const favoritos = criarFavoritosComGeneros(['Drama', 'Drama'], ['Ação']);

    expect(encontrarGeneroMaisFrequente(favoritos)).toBe('Ação');
  });
});

describe('calcularEstatisticas', () => {
  it('reúne todos os indicadores', () => {
    const favoritos = criarFavoritosComGeneros(['Drama', 'Ação'], ['Ação'], ['Comédia']);
    const avaliacoes = criarAvaliacoes(8, 8.5);

    expect(calcularEstatisticas(favoritos, avaliacoes)).toEqual({
      totalFavoritos: 3,
      totalAvaliados: 2,
      notaMedia: 8.3,
      generoMaisFrequente: 'Ação',
    });
  });

  it('devolve zeros e valores ausentes quando não há dados', () => {
    expect(calcularEstatisticas([], [])).toEqual({
      totalFavoritos: 0,
      totalAvaliados: 0,
      notaMedia: null,
      generoMaisFrequente: null,
    });
  });
});