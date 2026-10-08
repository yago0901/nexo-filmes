import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Favorito } from '@nexo/shared-types';
import { criarArmazenamentoEmMemoria, criarFilme } from './auxiliares-de-teste';
import { CONFIGURACAO_DESLIGADA } from './configuracao';
import {
  useAvaliacao,
  useAvaliacoes,
  useFavorito,
  useFavoritos,
} from './hooks';
import { criarRepositorioUsuario } from './repositorio';
import { criarStoreAvaliacoes } from './store-avaliacoes';
import { criarStoreFavoritos } from './store-favoritos';
import { reiniciarStoresGlobais } from './store-global';

function instalarStoresComFavoritos(favoritos: Favorito[] = []) {
  const armazenamento = criarArmazenamentoEmMemoria();
  armazenamento.gravarFavoritos(favoritos);
  const repositorio = criarRepositorioUsuario(armazenamento, CONFIGURACAO_DESLIGADA);
  const alvo = globalThis as Record<string, unknown>;
  alvo.__nexoStoreFavoritos = criarStoreFavoritos(repositorio);
  alvo.__nexoStoreAvaliacoes = criarStoreAvaliacoes(repositorio);
}

describe('useFavoritos', () => {
  beforeEach(() => {
    reiniciarStoresGlobais();
    localStorage.clear();
  });

  it('começa carregando e depois fica pronto', async () => {
    instalarStoresComFavoritos();
    const { result } = renderHook(() => useFavoritos());

    expect(result.current.status).toBe('carregando');

    await waitFor(() => expect(result.current.status).toBe('pronto'));
    expect(result.current.favoritos).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it('lista os favoritos já salvos', async () => {
    instalarStoresComFavoritos([
      {
        filme: { id: 550, titulo: 'Clube da Luta', ano: 1999, posterUrl: null, generos: ['Drama'] },
        favoritadoEm: '2026-10-01T10:00:00.000Z',
      },
    ]);
    const { result } = renderHook(() => useFavoritos());

    await waitFor(() => expect(result.current.status).toBe('pronto'));
    expect(result.current.total).toBe(1);
    expect(result.current.favoritos[0]?.filme.id).toBe(550);
  });
});

describe('useFavorito', () => {
  beforeEach(() => {
    reiniciarStoresGlobais();
    localStorage.clear();
  });

  it('começa não favoritado e alterna', async () => {
    instalarStoresComFavoritos();
    const { result } = renderHook(() => useFavorito(criarFilme(550)));

    await waitFor(() => expect(result.current.pronto).toBe(true));
    expect(result.current.favoritado).toBe(false);

    await act(async () => {
      await result.current.alternar();
    });

    expect(result.current.favoritado).toBe(true);
  });

  it('desfavorita quando já está favoritado', async () => {
    instalarStoresComFavoritos([
      {
        filme: { id: 550, titulo: 'Clube da Luta', ano: 1999, posterUrl: null, generos: ['Drama'] },
        favoritadoEm: '2026-10-01T10:00:00.000Z',
      },
    ]);
    const { result } = renderHook(() => useFavorito(criarFilme(550)));

    await waitFor(() => expect(result.current.pronto).toBe(true));
    expect(result.current.favoritado).toBe(true);

    await act(async () => {
      await result.current.alternar();
    });

    expect(result.current.favoritado).toBe(false);
  });
});

describe('useAvaliacoes', () => {
  beforeEach(() => {
    reiniciarStoresGlobais();
    localStorage.clear();
  });

  it('começa carregando e depois fica pronto', async () => {
    instalarStoresComFavoritos();
    const { result } = renderHook(() => useAvaliacoes());

    expect(result.current.status).toBe('carregando');
    await waitFor(() => expect(result.current.status).toBe('pronto'));
    expect(result.current.avaliacoes).toEqual([]);
    expect(result.current.total).toBe(0);
  });
});

describe('useAvaliacao', () => {
  beforeEach(() => {
    reiniciarStoresGlobais();
    localStorage.clear();
  });

  it('salva uma avaliação e a reflete no estado', async () => {
    instalarStoresComFavoritos();
    const { result } = renderHook(() => useAvaliacao(550));

    await waitFor(() => expect(result.current.status).toBe('pronto'));
    expect(result.current.avaliacao).toBeUndefined();

    await act(async () => {
      await result.current.salvar({ nota: 8.5, comentario: 'Muito bom' });
    });

    await waitFor(() => expect(result.current.avaliacao?.nota).toBe(8.5));
    expect(result.current.avaliacao?.comentario).toBe('Muito bom');
  });
});