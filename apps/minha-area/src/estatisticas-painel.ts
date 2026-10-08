import type { Avaliacao, Favorito } from '@nexo/shared-types';

export interface EstatisticasPainel {
  totalFavoritos: number;
  totalAvaliados: number;
  notaMedia: number | null;
  generoMaisFrequente: string | null;
}

export function calcularNotaMedia(avaliacoes: readonly Avaliacao[]): number | null {
  if (avaliacoes.length === 0) return null;
  const somaEmMeiosPontos = avaliacoes.reduce(
    (soma, { nota }) => soma + Math.round(nota * 2),
    0,
  );
  return Math.round((somaEmMeiosPontos * 5) / avaliacoes.length) / 10;
}

function contarGeneros(favoritos: readonly Favorito[]): Map<string, number> {
  const contagem = new Map<string, number>();
  favoritos.forEach(({ filme }) => {
    new Set(filme.generos).forEach((genero) => {
      contagem.set(genero, (contagem.get(genero) ?? 0) + 1);
    });
  });
  return contagem;
}

export function encontrarGeneroMaisFrequente(favoritos: readonly Favorito[]): string | null {
  const ordenados = [...contarGeneros(favoritos).entries()].sort(
    ([generoA, quantidadeA], [generoB, quantidadeB]) =>
      quantidadeB - quantidadeA || generoA.localeCompare(generoB, 'pt-BR'),
  );
  return ordenados[0]?.[0] ?? null;
}

export function calcularEstatisticas(
  favoritos: readonly Favorito[],
  avaliacoes: readonly Avaliacao[],
): EstatisticasPainel {
  return {
    totalFavoritos: favoritos.length,
    totalAvaliados: avaliacoes.length,
    notaMedia: calcularNotaMedia(avaliacoes),
    generoMaisFrequente: encontrarGeneroMaisFrequente(favoritos),
  };
}