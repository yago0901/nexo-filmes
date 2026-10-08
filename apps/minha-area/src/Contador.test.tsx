import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { armazenamentoLocal, obterStoreFavoritos } from '@nexo/user-data';
import { criarFavorito } from './auxiliares-de-teste';
import Contador from './Contador';
import { reiniciarAmbienteDeTestes } from './reiniciar-ambiente';

function renderizar() {
  render(
    <MemoryRouter>
      <Contador />
    </MemoryRouter>,
  );
}

describe('Contador', () => {
  beforeEach(() => {
    reiniciarAmbienteDeTestes();
  });

  it('mostra o total de favoritos salvos', async () => {
    armazenamentoLocal.gravarFavoritos([criarFavorito(1), criarFavorito(2)]);

    renderizar();

    expect(await screen.findByRole('link', { name: 'Favoritos: 2' })).toBeTruthy();
  });

  it('mostra zero quando não há favoritos', async () => {
    renderizar();

    expect(await screen.findByRole('link', { name: 'Favoritos: 0' })).toBeTruthy();
  });

  it('leva para a lista de favoritos', async () => {
    renderizar();

    const link = await screen.findByRole('link', { name: /Favoritos/ });

    expect(link.getAttribute('href')).toBe('/favoritos');
  });

  it('atualiza sem recarregar quando um filme é favoritado e desfavoritado', async () => {
    renderizar();
    await screen.findByRole('link', { name: 'Favoritos: 0' });
    const filme = criarFavorito(550).filme;

    await act(async () => {
      await obterStoreFavoritos().alternarFavorito(filme);
    });
    expect(screen.getByRole('link', { name: 'Favoritos: 1' })).toBeTruthy();

    await act(async () => {
      await obterStoreFavoritos().alternarFavorito(filme);
    });
    expect(screen.getByRole('link', { name: 'Favoritos: 0' })).toBeTruthy();
  });
});