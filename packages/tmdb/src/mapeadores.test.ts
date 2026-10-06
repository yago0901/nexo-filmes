import { describe, expect, it } from 'vitest';
import {
  criarDetalheTmdb,
  criarFilmeListaTmdb,
  criarRespostaPaginaTmdb,
  GENEROS_TMDB,
} from './auxiliares-de-teste';
import {
  criarNomesDeGeneros,
  mapearDetalhe,
  mapearFilmeDaLista,
  mapearGeneros,
  mapearPagina,
} from './mapeadores';

const nomes = criarNomesDeGeneros(mapearGeneros({ genres: GENEROS_TMDB }));

describe('mapearFilmeDaLista', () => {
  it('converte o filme da TMDB para o tipo do domínio', () => {
    expect(mapearFilmeDaLista(criarFilmeListaTmdb(), nomes)).toEqual({
      id: 550,
      titulo: 'Clube da Luta',
      ano: 1999,
      posterUrl: 'https://image.tmdb.org/t/p/w342/poster.jpg',
      generos: ['Drama', 'Ação'],
      notaTmdb: 8.4,
    });
  });

  it('usa null para filme sem data e sem pôster', () => {
    const filme = mapearFilmeDaLista(
      criarFilmeListaTmdb({ release_date: '', poster_path: null }),
      nomes,
    );

    expect(filme.ano).toBeNull();
    expect(filme.posterUrl).toBeNull();
  });

  it('ignora gêneros que não estão na lista', () => {
    const filme = mapearFilmeDaLista(criarFilmeListaTmdb({ genre_ids: [18, 999] }), nomes);

    expect(filme.generos).toEqual(['Drama']);
  });
});

describe('mapearPagina', () => {
  it('converte a paginação para o tipo do domínio', () => {
    const pagina = mapearPagina(
      criarRespostaPaginaTmdb({ page: 2, total_pages: 7, total_results: 140 }),
      nomes,
    );

    expect(pagina).toMatchObject({ pagina: 2, totalPaginas: 7, totalResultados: 140 });
    expect(pagina.itens).toHaveLength(1);
  });

  it('limita o total de páginas a 500, o máximo que a TMDB permite', () => {
    const pagina = mapearPagina(criarRespostaPaginaTmdb({ total_pages: 40000 }), nomes);

    expect(pagina.totalPaginas).toBe(500);
  });
});

describe('mapearDetalhe', () => {
  it('converte o detalhe com direção e elenco ordenado', () => {
    const detalhe = mapearDetalhe(criarDetalheTmdb());

    expect(detalhe).toMatchObject({
      id: 550,
      duracaoMin: 139,
      generos: ['Drama'],
      direcao: ['David Fincher'],
      posterGrandeUrl: 'https://image.tmdb.org/t/p/w500/poster.jpg',
    });
    expect(detalhe.elenco).toEqual([
      { nome: 'Edward Norton', personagem: 'Narrador' },
      { nome: 'Brad Pitt', personagem: 'Tyler Durden' },
    ]);
  });

  it('usa null quando a duração é zero ou ausente', () => {
    expect(mapearDetalhe(criarDetalheTmdb({ runtime: 0 })).duracaoMin).toBeNull();
    expect(mapearDetalhe(criarDetalheTmdb({ runtime: null })).duracaoMin).toBeNull();
  });

  it('limita o elenco a 10 pessoas', () => {
    const cast = Array.from({ length: 25 }, (_, indice) => ({
      name: `Ator ${indice}`,
      character: `Papel ${indice}`,
      order: indice,
    }));

    const detalhe = mapearDetalhe(criarDetalheTmdb({ credits: { cast, crew: [] } }));

    expect(detalhe.elenco).toHaveLength(10);
  });
});