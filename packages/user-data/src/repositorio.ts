import type { Avaliacao, Favorito, FilmeResumo } from '@nexo/shared-types';
import type { Armazenamento } from './armazenamento';
import type { ConfiguracaoRepositorio } from './configuracao';

export class ErroEscritaSimulado extends Error {
  readonly filmeId: number;

  constructor(filmeId: number) {
    super(`Falha simulada ao salvar o filme ${filmeId}`);
    this.name = 'ErroEscritaSimulado';
    this.filmeId = filmeId;
  }
}

export interface NovaAvaliacao {
  filmeId: number;
  nota: number;
  comentario: string;
}

export interface RepositorioUsuario {
  listarFavoritos(): Promise<Favorito[]>;
  definirFavorito(filme: FilmeResumo, favoritado: boolean): Promise<void>;
  listarAvaliacoes(): Promise<Avaliacao[]>;
  salvarAvaliacao(avaliacao: NovaAvaliacao): Promise<Avaliacao>;
}

function terminaEmTreze(filmeId: number): boolean {
  return filmeId % 100 === 13;
}

function esperar(ms: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

function sortearAtraso(minimo: number, maximo: number): number {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

export function criarRepositorioUsuario(
  armazenamento: Armazenamento,
  configuracao: ConfiguracaoRepositorio,
): RepositorioUsuario {
  async function simularLatencia(): Promise<void> {
    if (!configuracao.atrasoAtivo) return;
    await esperar(sortearAtraso(configuracao.atrasoMinimoMs, configuracao.atrasoMaximoMs));
  }

  function garantirEscritaPermitida(filmeId: number): void {
    if (configuracao.falhaAtiva && terminaEmTreze(filmeId)) {
      throw new ErroEscritaSimulado(filmeId);
    }
  }

  return {
    async listarFavoritos() {
      await simularLatencia();
      return armazenamento.lerFavoritos();
    },

    async definirFavorito(filme, favoritado) {
      await simularLatencia();
      garantirEscritaPermitida(filme.id);
      const favoritos = armazenamento.lerFavoritos();
      const restantes = favoritos.filter((favorito) => favorito.filme.id !== filme.id);
      if (!favoritado) {
        armazenamento.gravarFavoritos(restantes);
        return;
      }
      const existente = favoritos.find((favorito) => favorito.filme.id === filme.id);
      const favorito = existente ?? { filme, favoritadoEm: new Date().toISOString() };
      armazenamento.gravarFavoritos([...restantes, favorito]);
    },

    async listarAvaliacoes() {
      await simularLatencia();
      return armazenamento.lerAvaliacoes();
    },

    async salvarAvaliacao({ filmeId, nota, comentario }) {
      await simularLatencia();
      garantirEscritaPermitida(filmeId);
      const avaliacao: Avaliacao = {
        filmeId,
        nota,
        comentario,
        atualizadaEm: new Date().toISOString(),
      };
      const restantes = armazenamento
        .lerAvaliacoes()
        .filter((existente) => existente.filmeId !== filmeId);
      armazenamento.gravarAvaliacoes([...restantes, avaliacao]);
      return avaliacao;
    },
  };
}