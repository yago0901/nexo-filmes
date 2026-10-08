import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { armazenamentoLocal } from '@nexo/user-data';
import { criarAvaliacao, criarFavorito } from './auxiliares-de-teste';
import Favoritos from './Favoritos';
import { reiniciarAmbienteDeTestes } from './reiniciar-ambiente';

function renderizar() {
  render(
    <MemoryRouter>
      <Favoritos />
    </MemoryRouter>,
  );
}

describe('Favoritos', () => {
  beforeEach(() => {
    reiniciarAmbienteDeTestes();
  });

  it('mostra o estado vazio com link para o catálogo', async () => {
    renderizar();

    expect(await screen.findByText('Você ainda não favoritou nenhum filme')).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Explorar o catálogo' }).getAttribute('href'),
    ).toBe('/filmes');
  });

  it('lista do favorito mais recente para o mais antigo', async () => {
    armazenamentoLocal.gravarFavoritos([
      criarFavorito(1, 'Clube da Luta', '2026-10-01T10:00:00.000Z'),
      criarFavorito(2, 'Matrix', '2026-10-03T10:00:00.000Z'),
    ]);

    renderizar();

    const titulos = await screen.findAllByRole('heading', { level: 2 });
    expect(titulos.map((titulo) => titulo.textContent)).toEqual(['Matrix', 'Clube da Luta']);
  });

  it('mostra a nota dada pelo usuário e indica quando não há avaliação', async () => {
    armazenamentoLocal.gravarFavoritos([
      criarFavorito(1, 'Clube da Luta'),
      criarFavorito(2, 'Matrix'),
    ]);
    armazenamentoLocal.gravarAvaliacoes([criarAvaliacao(1, 8.5)]);

    renderizar();

    expect(await screen.findByText('Sua nota: 8,5')).toBeTruthy();
    expect(screen.getByText('Ainda sem avaliação')).toBeTruthy();
  });

  it('cada cartão leva para o detalhe do filme', async () => {
    armazenamentoLocal.gravarFavoritos([criarFavorito(550, 'Clube da Luta')]);

    renderizar();

    const link = await screen.findByRole('link', { name: /Clube da Luta/ });
    expect(link.getAttribute('href')).toBe('/filme/550');
  });

  it('remove o favorito da lista e do armazenamento', async () => {
    armazenamentoLocal.gravarFavoritos([
      criarFavorito(1, 'Clube da Luta'),
      criarFavorito(2, 'Matrix'),
    ]);
    renderizar();

    fireEvent.click(
      await screen.findByRole('button', { name: 'Remover Clube da Luta dos favoritos' }),
    );

    await waitFor(() => expect(screen.queryByText('Clube da Luta')).toBeNull());
    expect(screen.getByText('Matrix')).toBeTruthy();
    await waitFor(() =>
      expect(armazenamentoLocal.lerFavoritos().map((favorito) => favorito.filme.id)).toEqual([2]),
    );
  });

  it('mostra o estado vazio depois de remover o último favorito', async () => {
    armazenamentoLocal.gravarFavoritos([criarFavorito(1, 'Clube da Luta')]);
    renderizar();

    fireEvent.click(
      await screen.findByRole('button', { name: 'Remover Clube da Luta dos favoritos' }),
    );

    expect(await screen.findByText('Você ainda não favoritou nenhum filme')).toBeTruthy();
  });
});