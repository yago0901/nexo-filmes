const URL_BASE_IMAGENS = 'https://image.tmdb.org/t/p';

export type TamanhoPoster = 'w342' | 'w500';

export function urlPoster(caminho: string | null, tamanho: TamanhoPoster): string | null {
  return caminho ? `${URL_BASE_IMAGENS}/${tamanho}${caminho}` : null;
}