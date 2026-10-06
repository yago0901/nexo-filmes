import type { Favorito } from '@nexo/shared-types';

export type StatusFavoritos = 'inicial' | 'carregando' | 'pronto' | 'erro';

export interface EstadoFavoritos {
  status: StatusFavoritos;
  favoritosPorId: Readonly<Record<number, Favorito>>;
  pendentes: readonly number[];
}

export const ESTADO_INICIAL: EstadoFavoritos = {
  status: 'inicial',
  favoritosPorId: {},
  pendentes: [],
};

export function comStatus(estado: EstadoFavoritos, status: StatusFavoritos): EstadoFavoritos {
  return { ...estado, status };
}

export function definirCarregados(
  estado: EstadoFavoritos,
  favoritos: Favorito[],
): EstadoFavoritos {
  const favoritosPorId = Object.fromEntries(
    favoritos.map((favorito): [number, Favorito] => [favorito.filme.id, favorito]),
  );
  return { ...estado, status: 'pronto', favoritosPorId };
}

export function adicionarFavorito(estado: EstadoFavoritos, favorito: Favorito): EstadoFavoritos {
  return {
    ...estado,
    favoritosPorId: { ...estado.favoritosPorId, [favorito.filme.id]: favorito },
  };
}

export function removerFavorito(estado: EstadoFavoritos, filmeId: number): EstadoFavoritos {
  const favoritosPorId = Object.fromEntries(
    Object.entries(estado.favoritosPorId).filter(([id]) => Number(id) !== filmeId),
  );
  return { ...estado, favoritosPorId };
}

export function restaurarFavorito(
  estado: EstadoFavoritos,
  filmeId: number,
  anterior: Favorito | undefined,
): EstadoFavoritos {
  return anterior ? adicionarFavorito(estado, anterior) : removerFavorito(estado, filmeId);
}

export function marcarPendente(estado: EstadoFavoritos, filmeId: number): EstadoFavoritos {
  return { ...estado, pendentes: [...estado.pendentes, filmeId] };
}

export function desmarcarPendente(estado: EstadoFavoritos, filmeId: number): EstadoFavoritos {
  return { ...estado, pendentes: estado.pendentes.filter((id) => id !== filmeId) };
}

export function estaFavoritado(estado: EstadoFavoritos, filmeId: number): boolean {
  return filmeId in estado.favoritosPorId;
}

export function estaSalvando(estado: EstadoFavoritos, filmeId: number): boolean {
  return estado.pendentes.includes(filmeId);
}

export function listarFavoritos(estado: EstadoFavoritos): Favorito[] {
  return Object.values(estado.favoritosPorId).sort((a, b) =>
    b.favoritadoEm.localeCompare(a.favoritadoEm),
  );
}

export function contarFavoritos(estado: EstadoFavoritos): number {
  return Object.keys(estado.favoritosPorId).length;
}