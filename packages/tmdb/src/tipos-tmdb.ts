export interface GeneroTmdb {
  id: number;
  name: string;
}

export interface RespostaGenerosTmdb {
  genres: GeneroTmdb[];
}

export interface FilmeListaTmdb {
  id: number;
  title: string;
  release_date?: string;
  vote_average: number;
  genre_ids: number[];
  poster_path: string | null;
}

export interface RespostaPaginaTmdb {
  page: number;
  results: FilmeListaTmdb[];
  total_pages: number;
  total_results: number;
}

export interface MembroElencoTmdb {
  name: string;
  character: string;
  order: number;
}

export interface MembroEquipeTmdb {
  name: string;
  job: string;
}

export interface FilmeDetalheTmdb {
  id: number;
  title: string;
  release_date?: string;
  runtime: number | null;
  genres: GeneroTmdb[];
  vote_average: number;
  overview: string;
  poster_path: string | null;
  credits: {
    cast: MembroElencoTmdb[];
    crew: MembroEquipeTmdb[];
  };
}