import { afterEach, describe, expect, it, vi } from 'vitest';
import { criarArmazenamentoEmMemoria, criarFilme } from './auxiliares-de-teste';
import { CONFIGURACAO_DESLIGADA } from './configuracao';
import { criarRepositorioUsuario, ErroEscritaSimulado } from './repositorio';

const CONFIGURACAO_COM_FALHA = { ...CONFIGURACAO_DESLIGADA, falhaAtiva: true };

afterEach(() => {
  vi.useRealTimers();
});

describe('favoritos', () => {
  it('favorita um filme e o lista', async () => {
    const repositorio = criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_DESLIGADA);

    await repositorio.definirFavorito(criarFilme(550), true);

    const favoritos = await repositorio.listarFavoritos();
    expect(favoritos.map((favorito) => favorito.filme.id)).toEqual([550]);
  });

  it('desfavorita removendo o filme da lista', async () => {
    const repositorio = criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_DESLIGADA);
    await repositorio.definirFavorito(criarFilme(550), true);

    await repositorio.definirFavorito(criarFilme(550), false);

    expect(await repositorio.listarFavoritos()).toEqual([]);
  });

  it('não duplica ao favoritar duas vezes o mesmo filme', async () => {
    const repositorio = criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_DESLIGADA);

    await repositorio.definirFavorito(criarFilme(550), true);
    await repositorio.definirFavorito(criarFilme(550), true);

    expect(await repositorio.listarFavoritos()).toHaveLength(1);
  });

  it('falha ao escrever em filme cujo id termina em 13 e não grava nada', async () => {
    const repositorio = criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_COM_FALHA);

    await expect(repositorio.definirFavorito(criarFilme(513), true)).rejects.toBeInstanceOf(
      ErroEscritaSimulado,
    );
    expect(await repositorio.listarFavoritos()).toEqual([]);
  });

  it('falha também ao desfavoritar um filme cujo id termina em 13', async () => {
    const repositorio = criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_COM_FALHA);

    await expect(repositorio.definirFavorito(criarFilme(13), false)).rejects.toBeInstanceOf(
      ErroEscritaSimulado,
    );
  });

  it('permite escrever no id 13 quando a falha está desligada', async () => {
    const repositorio = criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_DESLIGADA);

    await repositorio.definirFavorito(criarFilme(13), true);

    expect(await repositorio.listarFavoritos()).toHaveLength(1);
  });

  it('não falha ao ler, mesmo com a falha ligada', async () => {
    const repositorio = criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_COM_FALHA);

    await expect(repositorio.listarFavoritos()).resolves.toEqual([]);
  });
});

describe('avaliações', () => {
  it('salvar de novo substitui a avaliação anterior', async () => {
    const repositorio = criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_DESLIGADA);

    await repositorio.salvarAvaliacao({ filmeId: 550, nota: 3, comentario: 'ok' });
    await repositorio.salvarAvaliacao({ filmeId: 550, nota: 9.5, comentario: 'ótimo' });

    const avaliacoes = await repositorio.listarAvaliacoes();
    expect(avaliacoes).toHaveLength(1);
    expect(avaliacoes[0]).toMatchObject({ filmeId: 550, nota: 9.5, comentario: 'ótimo' });
  });

  it('mantém uma avaliação por filme', async () => {
    const repositorio = criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_DESLIGADA);

    await repositorio.salvarAvaliacao({ filmeId: 550, nota: 8, comentario: '' });
    await repositorio.salvarAvaliacao({ filmeId: 603, nota: 7, comentario: '' });

    expect(await repositorio.listarAvaliacoes()).toHaveLength(2);
  });

  it('falha ao avaliar filme cujo id termina em 13', async () => {
    const repositorio = criarRepositorioUsuario(criarArmazenamentoEmMemoria(), CONFIGURACAO_COM_FALHA);

    await expect(
      repositorio.salvarAvaliacao({ filmeId: 113, nota: 5, comentario: '' }),
    ).rejects.toBeInstanceOf(ErroEscritaSimulado);
  });
});

describe('atraso', () => {
  it('espera entre 300 ms e 1500 ms quando o atraso está ativo', async () => {
    vi.useFakeTimers();
    const repositorio = criarRepositorioUsuario(criarArmazenamentoEmMemoria(), {
      ...CONFIGURACAO_DESLIGADA,
      atrasoAtivo: true,
    });
    let resolvido = false;

    const promessa = repositorio.listarFavoritos().then(() => {
      resolvido = true;
    });
    await vi.advanceTimersByTimeAsync(299);
    expect(resolvido).toBe(false);

    await vi.advanceTimersByTimeAsync(1201);
    await promessa;
    expect(resolvido).toBe(true);
  });
});