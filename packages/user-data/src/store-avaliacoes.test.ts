import { describe, expect, it, vi } from 'vitest';
import { criarArmazenamentoEmMemoria, criarAvaliacao } from './auxiliares-de-teste';
import { CONFIGURACAO_DESLIGADA } from './configuracao';
import { listarAvaliacoesDoEstado, obterAvaliacaoDoEstado } from './estado-avaliacoes';
import { escutarEvento } from './eventos';
import { criarRepositorioUsuario, ErroEscritaSimulado } from './repositorio';
import type { RepositorioUsuario } from './repositorio';
import { criarStoreAvaliacoes } from './store-avaliacoes';

const CONFIGURACAO_COM_FALHA = { ...CONFIGURACAO_DESLIGADA, falhaAtiva: true };

describe('store de avaliações', () => {
  it('carrega as avaliações salvas', async () => {
    const armazenamento = criarArmazenamentoEmMemoria();
    armazenamento.gravarAvaliacoes([criarAvaliacao(550, 9)]);
    const store = criarStoreAvaliacoes(
      criarRepositorioUsuario(armazenamento, CONFIGURACAO_DESLIGADA),
    );

    await store.carregar();

    expect(store.obterEstado().status).toBe('pronto');
    expect(obterAvaliacaoDoEstado(store.obterEstado(), 550)?.nota).toBe(9);
  });

  it('marca erro quando o carregamento falha e se recupera na nova tentativa', async () => {
    const listarAvaliacoes = vi
      .fn<RepositorioUsuario['listarAvaliacoes']>()
      .mockRejectedValueOnce(new Error('falha'))
      .mockResolvedValueOnce([criarAvaliacao(550, 7)]);
    const repositorio = {
      ...criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_DESLIGADA),
      listarAvaliacoes,
    };
    const store = criarStoreAvaliacoes(repositorio);

    await store.carregar();
    expect(store.obterEstado().status).toBe('erro');

    await store.carregar();
    expect(store.obterEstado().status).toBe('pronto');
    expect(obterAvaliacaoDoEstado(store.obterEstado(), 550)?.nota).toBe(7);
  });

  it('salva, atualiza o estado e emite o evento', async () => {
    const store = criarStoreAvaliacoes(
      criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_DESLIGADA),
    );
    const filmesAlterados: number[] = [];
    const parar = escutarEvento('nexo:avaliacao-alterada', ({ filmeId }) => {
      filmesAlterados.push(filmeId);
    });

    const avaliacao = await store.salvar({ filmeId: 550, nota: 8.5, comentario: 'Muito bom' });
    parar();

    expect(avaliacao).toMatchObject({ filmeId: 550, nota: 8.5, comentario: 'Muito bom' });
    expect(obterAvaliacaoDoEstado(store.obterEstado(), 550)?.nota).toBe(8.5);
    expect(filmesAlterados).toEqual([550]);
  });

  it('salvar de novo substitui a avaliação anterior', async () => {
    const store = criarStoreAvaliacoes(
      criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_DESLIGADA),
    );

    await store.salvar({ filmeId: 550, nota: 3, comentario: 'ok' });
    await store.salvar({ filmeId: 550, nota: 9.5, comentario: 'ótimo' });

    const avaliacoes = listarAvaliacoesDoEstado(store.obterEstado());
    expect(avaliacoes).toHaveLength(1);
    expect(avaliacoes[0]).toMatchObject({ nota: 9.5, comentario: 'ótimo' });
  });

  it('propaga a falha, não altera o estado e não emite evento', async () => {
    const store = criarStoreAvaliacoes(
      criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_COM_FALHA),
    );
    const ouvinteDeEvento = vi.fn();
    const parar = escutarEvento('nexo:avaliacao-alterada', ouvinteDeEvento);

    await expect(
      store.salvar({ filmeId: 113, nota: 5, comentario: '' }),
    ).rejects.toBeInstanceOf(ErroEscritaSimulado);
    parar();

    expect(obterAvaliacaoDoEstado(store.obterEstado(), 113)).toBeUndefined();
    expect(ouvinteDeEvento).not.toHaveBeenCalled();
  });

  it('avisa os assinantes e para depois de cancelar', async () => {
    const store = criarStoreAvaliacoes(
      criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_DESLIGADA),
    );
    const ouvinte = vi.fn();
    const cancelar = store.assinar(ouvinte);

    await store.salvar({ filmeId: 550, nota: 8, comentario: '' });
    expect(ouvinte).toHaveBeenCalledTimes(1);

    cancelar();
    await store.salvar({ filmeId: 603, nota: 8, comentario: '' });
    expect(ouvinte).toHaveBeenCalledTimes(1);
  });
});