import type { Filme, FilmeDetalhe, Genero, Pagina } from '@nexo/shared-types';
import { urlPoster } from './imagens';
import type {
  FilmeDetalheTmdb,
  FilmeListaTmdb,
  RespostaGenerosTmdb,
  RespostaPaginaTmdb,
} from './tipos-tmdb';

const LIMITE_DE_PAGINAS_TMDB = 500;
const TAMANHO_ELENCO = 10;

export type NomesDeGeneros = ReadonlyMap<number, string>;

function extrairAno(data: string | undefined): number | null {
  if (!data) return null;
  const ano = Number(data.slice(0, 4));
  return Number.isInteger(ano) && ano > 0 ? ano : null;
}

function arredondarNota(nota: number): number {
  return Math.round(nota * 10) / 10;
}

export function mapearGeneros(resposta: RespostaGenerosTmdb): Genero[] {
  return resposta.genres.map(({ id, name }) => ({ id, nome: name }));
}

export function criarNomesDeGeneros(generos: Genero[]): NomesDeGeneros {
  return new Map(generos.map((genero): [number, string] => [genero.id, genero.nome]));
}

export function mapearFilmeDaLista(filme: FilmeListaTmdb, nomes: NomesDeGeneros): Filme {
  return {
    id: filme.id,
    titulo: filme.title,
    ano: extrairAno(filme.release_date),
    posterUrl: urlPoster(filme.poster_path, 'w342'),
    generos: filme.genre_ids.flatMap((id) => nomes.get(id) ?? []),
    notaTmdb: arredondarNota(filme.vote_average),
  };
}

export function mapearPagina(resposta: RespostaPaginaTmdb, nomes: NomesDeGeneros): Pagina<Filme> {
  return {
    itens: resposta.results.map((filme) => mapearFilmeDaLista(filme, nomes)),
    pagina: resposta.page,
    totalPaginas: Math.min(resposta.total_pages, LIMITE_DE_PAGINAS_TMDB),
    totalResultados: resposta.total_results,
  };
}

export function mapearDetalhe(filme: FilmeDetalheTmdb): FilmeDetalhe {
  return {
    id: filme.id,
    titulo: filme.title,
    ano: extrairAno(filme.release_date),
    posterUrl: urlPoster(filme.poster_path, 'w342'),
    posterGrandeUrl: urlPoster(filme.poster_path, 'w500'),
    notaTmdb: arredondarNota(filme.vote_average),
    generos: filme.genres.map((genero) => genero.name),
    duracaoMin: filme.runtime && filme.runtime > 0 ? filme.runtime : null,
    sinopse: filme.overview,
    direcao: filme.credits.crew
      .filter((membro) => membro.job === 'Director')
      .map((membro) => membro.name),
    elenco: [...filme.credits.cast]
      .sort((a, b) => a.order - b.order)
      .slice(0, TAMANHO_ELENCO)
      .map((membro) => ({ nome: membro.name, personagem: membro.character })),
  };
}