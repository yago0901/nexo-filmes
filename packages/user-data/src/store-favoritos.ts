import type { Favorito, FilmeResumo } from '@nexo/shared-types';
import {
  adicionarFavorito,
  comStatus,
  definirCarregados,
  desmarcarPendente,
  ESTADO_INICIAL,
  estaFavoritado,
  estaSalvando,
  marcarPendente,
  removerFavorito,
  restaurarFavorito,
} from './estado-favoritos';
import type { EstadoFavoritos } from './estado-favoritos';
import { emitirEvento } from './eventos';
import type { RepositorioUsuario } from './repositorio';

export interface StoreFavoritos {
  obterEstado(): EstadoFavoritos;
  assinar(ouvinte: () => void): () => void;
  carregar(): Promise<void>;
  alternarFavorito(filme: FilmeResumo): Promise<void>;
}

function criarFavorito(filme: FilmeResumo): Favorito {
  return { filme, favoritadoEm: new Date().toISOString() };
}

export function criarStoreFavoritos(repositorio: RepositorioUsuario): StoreFavoritos {
  let estado = ESTADO_INICIAL;
  let carregamento: Promise<void> | null = null;
  const ouvintes = new Set<() => void>();

  function atualizar(proximo: EstadoFavoritos): void {
    estado = proximo;
    ouvintes.forEach((ouvinte) => ouvinte());
  }

  function carregar(): Promise<void> {
    if (carregamento) return carregamento;
    atualizar(comStatus(estado, 'carregando'));
    carregamento = repositorio.listarFavoritos().then(
      (favoritos) => {
        atualizar(definirCarregados(estado, favoritos));
      },
      () => {
        carregamento = null;
        atualizar(comStatus(estado, 'erro'));
      },
    );
    return carregamento;
  }

  async function alternarFavorito(filme: FilmeResumo): Promise<void> {
    await carregar();
    if (estado.status !== 'pronto' || estaSalvando(estado, filme.id)) return;

    const favoritar = !estaFavoritado(estado, filme.id);
    const anterior = estado.favoritosPorId[filme.id];
    const otimista = favoritar
      ? adicionarFavorito(estado, criarFavorito(filme))
      : removerFavorito(estado, filme.id);

    atualizar(marcarPendente(otimista, filme.id));
    emitirEvento('nexo:favoritos-alterados', { filmeId: filme.id, favoritado: favoritar });

    try {
      await repositorio.definirFavorito(filme, favoritar);
      atualizar(desmarcarPendente(estado, filme.id));
    } catch {
      atualizar(desmarcarPendente(restaurarFavorito(estado, filme.id, anterior), filme.id));
      emitirEvento('nexo:favoritos-alterados', {
        filmeId: filme.id,
        favoritado: anterior !== undefined,
      });
      emitirEvento('nexo:favorito-falhou', { filmeId: filme.id, titulo: filme.titulo });
    }
  }

  return {
    obterEstado: () => estado,
    assinar(ouvinte) {
      ouvintes.add(ouvinte);
      return () => {
        ouvintes.delete(ouvinte);
      };
    },
    carregar,
    alternarFavorito,
  };
}