import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Filme, Pagina } from '@nexo/shared-types';
import { clienteTmdb } from '@nexo/tmdb';
import { criarClienteDeConsultas } from './cliente-de-consultas';
import { useFilmes } from './dados';

vi.mock('@nexo/tmdb', () => ({
  clienteTmdb: {
    listarGeneros: vi.fn(),
    listarFilmes: vi.fn(),
    buscarFilmes: vi.fn(),
  },
}));

const paginaExemplo: Pagina<Filme> = {
  itens: [],
  pagina: 1,
  totalPaginas: 1,
  totalResultados: 0,
};

function criarWrapper() {
  const cliente = criarClienteDeConsultas();
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={cliente}>{children}</QueryClientProvider>;
  };
}

describe('useFilmes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(clienteTmdb.listarFilmes).mockResolvedValue(paginaExemplo);
    vi.mocked(clienteTmdb.buscarFilmes).mockResolvedValue(paginaExemplo);
  });

  it('lista o catálogo com página e gênero quando não há busca', async () => {
    const { result } = renderHook(() => useFilmes({ termo: '', generoId: 28, pagina: 2 }), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(clienteTmdb.listarFilmes).toHaveBeenCalledWith({ pagina: 2, generoId: 28 });
    expect(clienteTmdb.buscarFilmes).not.toHaveBeenCalled();
  });

  it('não envia gênero quando nenhum está selecionado', async () => {
    const { result } = renderHook(() => useFilmes({ termo: '', generoId: null, pagina: 1 }), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(clienteTmdb.listarFilmes).toHaveBeenCalledWith({ pagina: 1, generoId: undefined });
  });

  it('usa a busca por título quando há termo', async () => {
    const { result } = renderHook(
      () => useFilmes({ termo: 'matrix', generoId: null, pagina: 1 }),
      { wrapper: criarWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(clienteTmdb.buscarFilmes).toHaveBeenCalledWith({ termo: 'matrix', pagina: 1 });
    expect(clienteTmdb.listarFilmes).not.toHaveBeenCalled();
  });

  it('expõe o erro quando a TMDB falha', async () => {
    vi.mocked(clienteTmdb.listarFilmes).mockRejectedValue(new Error('falha'));

    const { result } = renderHook(() => useFilmes({ termo: '', generoId: null, pagina: 1 }), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});