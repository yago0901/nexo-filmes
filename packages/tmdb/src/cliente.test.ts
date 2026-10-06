import { describe, expect, it } from 'vitest';
import {
  criarDetalheTmdb,
  criarFetcherDeRotas,
  criarRespostaPaginaTmdb,
  GENEROS_TMDB,
  responderJson,
} from './auxiliares-de-teste';
import { criarClienteTmdb } from './cliente';
import { ErroLimiteRequisicoes, ErroTmdb } from './erros';

type FetcherDeTeste = ReturnType<typeof criarFetcherDeRotas>;

function criarRotasPadrao() {
  return {
    '/genre/movie/list': () => responderJson({ genres: GENEROS_TMDB }),
    '/discover/movie': () => responderJson(criarRespostaPaginaTmdb()),
    '/search/movie': () => responderJson(criarRespostaPaginaTmdb()),
    '/movie/550': () => responderJson(criarDetalheTmdb()),
  };
}

function obterChamadas(fetcher: FetcherDeTeste, caminho: string) {
  return fetcher.mock.calls
    .filter(([url]) => new URL(url).pathname.endsWith(caminho))
    .map(([url, inicio]) => ({ url: new URL(url), inicio }));
}

describe('cliente TMDB', () => {
  it('lista filmes enviando token, idioma e página', async () => {
    const fetcher = criarFetcherDeRotas(criarRotasPadrao());
    const cliente = criarClienteTmdb({ token: 'abc', fetcher });

    const pagina = await cliente.listarFilmes({ pagina: 2 });

    const [chamada] = obterChamadas(fetcher, '/discover/movie');
    expect(chamada?.url.searchParams.get('page')).toBe('2');
    expect(chamada?.url.searchParams.get('language')).toBe('pt-BR');
    expect(chamada?.inicio.headers.Authorization).toBe('Bearer abc');
    expect(pagina.itens[0]?.generos).toEqual(['Drama', 'Ação']);
  });

  it('envia with_genres somente quando há gênero', async () => {
    const fetcher = criarFetcherDeRotas(criarRotasPadrao());
    const cliente = criarClienteTmdb({ token: 'abc', fetcher });

    await cliente.listarFilmes({ pagina: 1 });
    await cliente.listarFilmes({ pagina: 1, generoId: 28 });

    const [semGenero, comGenero] = obterChamadas(fetcher, '/discover/movie');
    expect(semGenero?.url.searchParams.has('with_genres')).toBe(false);
    expect(comGenero?.url.searchParams.get('with_genres')).toBe('28');
  });

  it('busca por título em /search/movie sem enviar gênero', async () => {
    const fetcher = criarFetcherDeRotas(criarRotasPadrao());
    const cliente = criarClienteTmdb({ token: 'abc', fetcher });

    await cliente.buscarFilmes({ termo: 'matrix', pagina: 1 });

    const [chamada] = obterChamadas(fetcher, '/search/movie');
    expect(chamada?.url.searchParams.get('query')).toBe('matrix');
    expect(chamada?.url.searchParams.has('with_genres')).toBe(false);
  });

  it('chama a lista de gêneros uma única vez', async () => {
    const fetcher = criarFetcherDeRotas(criarRotasPadrao());
    const cliente = criarClienteTmdb({ token: 'abc', fetcher });

    await cliente.listarFilmes({ pagina: 1 });
    await cliente.listarFilmes({ pagina: 2 });
    await cliente.buscarFilmes({ termo: 'matrix', pagina: 1 });

    expect(obterChamadas(fetcher, '/genre/movie/list')).toHaveLength(1);
  });

  it('tenta buscar os gêneros de novo depois de uma falha', async () => {
    let tentativas = 0;
    const fetcher = criarFetcherDeRotas({
      ...criarRotasPadrao(),
      '/genre/movie/list': () => {
        tentativas += 1;
        return tentativas === 1
          ? responderJson({}, 500)
          : responderJson({ genres: GENEROS_TMDB });
      },
    });
    const cliente = criarClienteTmdb({ token: 'abc', fetcher });

    await expect(cliente.listarGeneros()).rejects.toBeInstanceOf(ErroTmdb);
    await expect(cliente.listarGeneros()).resolves.toHaveLength(3);
  });

  it('pede o detalhe com os créditos', async () => {
    const fetcher = criarFetcherDeRotas(criarRotasPadrao());
    const cliente = criarClienteTmdb({ token: 'abc', fetcher });

    const detalhe = await cliente.obterDetalhe(550);

    const [chamada] = obterChamadas(fetcher, '/movie/550');
    expect(chamada?.url.searchParams.get('append_to_response')).toBe('credits');
    expect(detalhe.direcao).toEqual(['David Fincher']);
  });

  it('lança ErroLimiteRequisicoes quando a TMDB responde 429', async () => {
    const fetcher = criarFetcherDeRotas({
      ...criarRotasPadrao(),
      '/movie/550': () => responderJson({}, 429),
    });
    const cliente = criarClienteTmdb({ token: 'abc', fetcher });

    await expect(cliente.obterDetalhe(550)).rejects.toBeInstanceOf(ErroLimiteRequisicoes);
  });

  it('lança ErroTmdb com o status quando a resposta não é bem-sucedida', async () => {
    const fetcher = criarFetcherDeRotas({
      ...criarRotasPadrao(),
      '/movie/550': () => responderJson({}, 401),
    });
    const cliente = criarClienteTmdb({ token: 'abc', fetcher });

    await expect(cliente.obterDetalhe(550)).rejects.toMatchObject({ status: 401 });
  });

  it('lança ErroTmdb com status 0 quando não há conexão', async () => {
    const cliente = criarClienteTmdb({
      token: 'abc',
      fetcher: async () => {
        throw new TypeError('Failed to fetch');
      },
    });

    await expect(cliente.obterDetalhe(550)).rejects.toMatchObject({ status: 0 });
  });
});