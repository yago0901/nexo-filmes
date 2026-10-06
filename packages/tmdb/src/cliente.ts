import type { Filme, FilmeDetalhe, Genero, Pagina } from '@nexo/shared-types';
import { ErroLimiteRequisicoes, ErroTmdb } from './erros';
import {
  criarNomesDeGeneros,
  mapearDetalhe,
  mapearGeneros,
  mapearPagina,
} from './mapeadores';
import type {
  FilmeDetalheTmdb,
  RespostaGenerosTmdb,
  RespostaPaginaTmdb,
} from './tipos-tmdb';

const URL_BASE_TMDB = 'https://api.themoviedb.org/3';
const IDIOMA = 'pt-BR';

export type Fetcher = (
  url: string,
  inicio: { headers: Record<string, string> },
) => Promise<Response>;

export interface OpcoesClienteTmdb {
  token: string;
  fetcher?: Fetcher;
  urlBase?: string;
}

export interface ClienteTmdb {
  listarGeneros(): Promise<Genero[]>;
  listarFilmes(parametros: { pagina: number; generoId?: number }): Promise<Pagina<Filme>>;
  buscarFilmes(parametros: { termo: string; pagina: number }): Promise<Pagina<Filme>>;
  obterDetalhe(id: number): Promise<FilmeDetalhe>;
}

type ParametrosRequisicao = Record<string, string | number | undefined>;

export function criarClienteTmdb({
  token,
  fetcher = (url, inicio) => fetch(url, inicio),
  urlBase = URL_BASE_TMDB,
}: OpcoesClienteTmdb): ClienteTmdb {
  let generosEmCache: Promise<Genero[]> | null = null;

  async function requisitar<T>(caminho: string, parametros: ParametrosRequisicao = {}): Promise<T> {
    const url = new URL(`${urlBase}${caminho}`);
    url.searchParams.set('language', IDIOMA);
    Object.entries(parametros).forEach(([chave, valor]) => {
      if (valor !== undefined) url.searchParams.set(chave, String(valor));
    });

    let resposta: Response;
    try {
      resposta = await fetcher(url.toString(), {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
    } catch {
      throw new ErroTmdb('Não foi possível conectar à TMDB', 0);
    }

    if (resposta.status === 429) throw new ErroLimiteRequisicoes();
    if (!resposta.ok) {
      throw new ErroTmdb(`A TMDB respondeu com o status ${resposta.status}`, resposta.status);
    }
    return (await resposta.json()) as T;
  }

  function listarGeneros(): Promise<Genero[]> {
    if (!generosEmCache) {
      generosEmCache = requisitar<RespostaGenerosTmdb>('/genre/movie/list')
        .then(mapearGeneros)
        .catch((erro: unknown) => {
          generosEmCache = null;
          throw erro;
        });
    }
    return generosEmCache;
  }

  async function obterNomesDeGeneros() {
    return criarNomesDeGeneros(await listarGeneros());
  }

  async function listarFilmes({ pagina, generoId }: { pagina: number; generoId?: number }) {
    const [resposta, nomes] = await Promise.all([
      requisitar<RespostaPaginaTmdb>('/discover/movie', {
        page: pagina,
        with_genres: generoId,
      }),
      obterNomesDeGeneros(),
    ]);
    return mapearPagina(resposta, nomes);
  }

  async function buscarFilmes({ termo, pagina }: { termo: string; pagina: number }) {
    const [resposta, nomes] = await Promise.all([
      requisitar<RespostaPaginaTmdb>('/search/movie', { query: termo, page: pagina }),
      obterNomesDeGeneros(),
    ]);
    return mapearPagina(resposta, nomes);
  }

  async function obterDetalhe(id: number) {
    const resposta = await requisitar<FilmeDetalheTmdb>(`/movie/${id}`, {
      append_to_response: 'credits',
    });
    return mapearDetalhe(resposta);
  }

  return { listarGeneros, listarFilmes, buscarFilmes, obterDetalhe };
}