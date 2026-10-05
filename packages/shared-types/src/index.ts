export interface Genero { id: number; nome: string }

export interface Filme {
  id: number;
  titulo: string;
  ano: number | null;
  notaTmdb: number;
  generos: string[];
  posterUrl: string | null;
}

export interface NexoEventos {
  'nexo:favoritos-alterados': { filmeId: number; favoritado: boolean };
}