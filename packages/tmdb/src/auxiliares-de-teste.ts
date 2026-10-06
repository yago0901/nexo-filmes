import { vi } from 'vitest';
import type { Fetcher } from './cliente';
import type {
  FilmeDetalheTmdb,
  FilmeListaTmdb,
  GeneroTmdb,
  RespostaPaginaTmdb,
} from './tipos-tmdb';

export const GENEROS_TMDB: GeneroTmdb[] = [
  { id: 28, name: 'Ação' },
  { id: 18, name: 'Drama' },
  { id: 35, name: 'Comédia' },
];

export function criarFilmeListaTmdb(sobrescritas: Partial<FilmeListaTmdb> = {}): FilmeListaTmdb {
  return {
    id: 550,
    title: 'Clube da Luta',
    release_date: '1999-10-15',
    vote_average: 8.438,
    genre_ids: [18, 28],
    poster_path: '/poster.jpg',
    ...sobrescritas,
  };
}

export function criarRespostaPaginaTmdb(
  sobrescritas: Partial<RespostaPaginaTmdb> = {},
): RespostaPaginaTmdb {
  return {
    page: 1,
    results: [criarFilmeListaTmdb()],
    total_pages: 3,
    total_results: 55,
    ...sobrescritas,
  };
}

export function criarDetalheTmdb(sobrescritas: Partial<FilmeDetalheTmdb> = {}): FilmeDetalheTmdb {
  return {
    id: 550,
    title: 'Clube da Luta',
    release_date: '1999-10-15',
    runtime: 139,
    genres: [{ id: 18, name: 'Drama' }],
    vote_average: 8.4,
    overview: 'Um homem insone encontra um vendedor de sabão.',
    poster_path: '/poster.jpg',
    credits: {
      cast: [
        { name: 'Brad Pitt', character: 'Tyler Durden', order: 1 },
        { name: 'Edward Norton', character: 'Narrador', order: 0 },
      ],
      crew: [
        { name: 'David Fincher', job: 'Director' },
        { name: 'Jim Uhls', job: 'Screenplay' },
      ],
    },
    ...sobrescritas,
  };
}

export function responderJson(corpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function criarFetcherDeRotas(rotas: Record<string, () => Response>) {
  return vi.fn<Fetcher>(async (url) => {
    const caminho = new URL(url).pathname.replace(/^\/3/, '');
    const responder = rotas[caminho];
    if (!responder) throw new Error(`Rota inesperada: ${caminho}`);
    return responder();
  });
}