import type { Avaliacao } from '@nexo/shared-types';
import {
  comAvaliacaoSalva,
  comStatusAvaliacoes,
  definirAvaliacoesCarregadas,
  ESTADO_INICIAL_AVALIACOES,
} from './estado-avaliacoes';
import type { EstadoAvaliacoes } from './estado-avaliacoes';
import { emitirEvento } from './eventos';
import type { NovaAvaliacao, RepositorioUsuario } from './repositorio';

export interface StoreAvaliacoes {
  obterEstado(): EstadoAvaliacoes;
  assinar(ouvinte: () => void): () => void;
  carregar(): Promise<void>;
  salvar(avaliacao: NovaAvaliacao): Promise<Avaliacao>;
}

export function criarStoreAvaliacoes(repositorio: RepositorioUsuario): StoreAvaliacoes {
  let estado = ESTADO_INICIAL_AVALIACOES;
  let carregamento: Promise<void> | null = null;
  const ouvintes = new Set<() => void>();

  function atualizar(proximo: EstadoAvaliacoes): void {
    estado = proximo;
    ouvintes.forEach((ouvinte) => ouvinte());
  }

  function carregar(): Promise<void> {
    if (carregamento) return carregamento;
    atualizar(comStatusAvaliacoes(estado, 'carregando'));
    carregamento = repositorio.listarAvaliacoes().then(
      (avaliacoes) => {
        atualizar(definirAvaliacoesCarregadas(estado, avaliacoes));
      },
      () => {
        carregamento = null;
        atualizar(comStatusAvaliacoes(estado, 'erro'));
      },
    );
    return carregamento;
  }

  async function salvar(nova: NovaAvaliacao): Promise<Avaliacao> {
    const avaliacao = await repositorio.salvarAvaliacao(nova);
    atualizar(comAvaliacaoSalva(estado, avaliacao));
    emitirEvento('nexo:avaliacao-alterada', { filmeId: avaliacao.filmeId });
    return avaliacao;
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
    salvar,
  };
}