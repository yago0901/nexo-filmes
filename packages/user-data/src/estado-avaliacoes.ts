import type { Avaliacao } from '@nexo/shared-types';

export type StatusAvaliacoes = 'inicial' | 'carregando' | 'pronto' | 'erro';

export interface EstadoAvaliacoes {
  status: StatusAvaliacoes;
  avaliacoesPorFilme: Readonly<Record<number, Avaliacao>>;
}

export const ESTADO_INICIAL_AVALIACOES: EstadoAvaliacoes = {
  status: 'inicial',
  avaliacoesPorFilme: {},
};

export function comStatusAvaliacoes(
  estado: EstadoAvaliacoes,
  status: StatusAvaliacoes,
): EstadoAvaliacoes {
  return { ...estado, status };
}

export function definirAvaliacoesCarregadas(
  estado: EstadoAvaliacoes,
  avaliacoes: Avaliacao[],
): EstadoAvaliacoes {
  const avaliacoesPorFilme = Object.fromEntries(
    avaliacoes.map((avaliacao): [number, Avaliacao] => [avaliacao.filmeId, avaliacao]),
  );
  return { ...estado, status: 'pronto', avaliacoesPorFilme };
}

export function comAvaliacaoSalva(
  estado: EstadoAvaliacoes,
  avaliacao: Avaliacao,
): EstadoAvaliacoes {
  return {
    ...estado,
    avaliacoesPorFilme: { ...estado.avaliacoesPorFilme, [avaliacao.filmeId]: avaliacao },
  };
}

export function obterAvaliacaoDoEstado(
  estado: EstadoAvaliacoes,
  filmeId: number,
): Avaliacao | undefined {
  return estado.avaliacoesPorFilme[filmeId];
}

export function listarAvaliacoesDoEstado(estado: EstadoAvaliacoes): Avaliacao[] {
  return Object.values(estado.avaliacoesPorFilme).sort((a, b) =>
    b.atualizadaEm.localeCompare(a.atualizadaEm),
  );
}