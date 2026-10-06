export interface Genero {
  id: number;
  nome: string;
}

export interface FilmeResumo {
  id: number;
  titulo: string;
  ano: number | null;
  posterUrl: string | null;
  generos: string[];
}

export interface Filme extends FilmeResumo {
  notaTmdb: number;
}

export interface MembroElenco {
  nome: string;
  personagem: string;
}

export interface FilmeDetalhe extends Filme {
  posterGrandeUrl: string | null;
  duracaoMin: number | null;
  sinopse: string;
  direcao: string[];
  elenco: MembroElenco[];
}

export interface Pagina<T> {
  itens: T[];
  pagina: number;
  totalPaginas: number;
  totalResultados: number;
}

export interface Favorito {
  filme: FilmeResumo;
  favoritadoEm: string;
}

export interface Avaliacao {
  filmeId: number;
  nota: number;
  comentario: string;
  atualizadaEm: string;
}

export interface NexoEventos {
  'nexo:favoritos-alterados': { filmeId: number; favoritado: boolean };
  'nexo:avaliacao-alterada': { filmeId: number };
  'nexo:favorito-falhou': { filmeId: number; titulo: string };
}

export type NomeEvento = keyof NexoEventos;