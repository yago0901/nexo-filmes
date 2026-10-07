import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FilmeDetalhe } from '@nexo/shared-types';
import { clienteTmdb, ErroLimiteRequisicoes, ErroTmdb } from '@nexo/tmdb';
import { criarClienteDeConsultas } from './cliente-de-consultas';
import { PaginaFilme } from './PaginaFilme';

vi.mock('@nexo/tmdb', async (importarOriginal) => {
  const original = await importarOriginal<typeof import('@nexo/tmdb')>();
  return { ...original, clienteTmdb: { obterDetalhe: vi.fn() } };
});

const filmeExemplo: FilmeDetalhe = {
  id: 550,
  titulo: 'Clube da Luta',
  ano: 1999,
  posterUrl: 'https://image.tmdb.org/t/p/w342/poster.jpg',
  posterGrandeUrl: 'https://image.tmdb.org/t/p/w500/poster.jpg',
  notaTmdb: 8.4,
  generos: ['Drama'],
  duracaoMin: 139,
  sinopse: 'Um homem insone encontra um vendedor de sabão.',
  direcao: ['David Fincher'],
  elenco: [{ nome: 'Edward Norton', personagem: 'Narrador' }],
};

function renderizar(rota: string) {
  render(
    <QueryClientProvider client={criarClienteDeConsultas()}>
      <MemoryRouter initialEntries={[rota]}>
        <Routes>
          <Route path=":id" element={<PaginaFilme />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PaginaFilme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mostra os dados do filme', async () => {
    vi.mocked(clienteTmdb.obterDetalhe).mockResolvedValue(filmeExemplo);

    renderizar('/550');

    expect(await screen.findByRole('heading', { name: 'Clube da Luta', level: 1 })).toBeTruthy();
    expect(screen.getByText('2 h 19 min')).toBeTruthy();
    expect(screen.getByText('David Fincher')).toBeTruthy();
    expect(screen.getByText('Edward Norton — Narrador')).toBeTruthy();
    expect(clienteTmdb.obterDetalhe).toHaveBeenCalledWith(550);
  });

  it('mostra "não encontrado" sem chamar a TMDB quando o id é inválido', () => {
    renderizar('/abc');

    expect(screen.getByText('Filme não encontrado')).toBeTruthy();
    expect(clienteTmdb.obterDetalhe).not.toHaveBeenCalled();
  });

  it('mostra "não encontrado" quando a TMDB responde 404', async () => {
    vi.mocked(clienteTmdb.obterDetalhe).mockRejectedValue(new ErroTmdb('não existe', 404));

    renderizar('/99999999');

    expect(await screen.findByText('Filme não encontrado')).toBeTruthy();
  });

  it('mostra o erro de limite de requisições e carrega ao tentar novamente', async () => {
    vi.mocked(clienteTmdb.obterDetalhe)
      .mockRejectedValueOnce(new ErroLimiteRequisicoes())
      .mockResolvedValueOnce(filmeExemplo);

    renderizar('/550');

    const alerta = await screen.findByRole('alert');
    expect(alerta.textContent).toContain('Muitas requisições');

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByRole('heading', { name: 'Clube da Luta', level: 1 })).toBeTruthy();
    expect(clienteTmdb.obterDetalhe).toHaveBeenCalledTimes(2);
  });
});