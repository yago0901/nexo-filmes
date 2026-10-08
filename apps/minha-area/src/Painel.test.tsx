import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { armazenamentoLocal } from '@nexo/user-data';
import { criarAvaliacao, criarFavorito } from './auxiliares-de-teste';
import Painel from './Painel';
import { reiniciarAmbienteDeTestes } from './reiniciar-ambiente';

async function valorDe(rotulo: string): Promise<string | null | undefined> {
  const termo = await screen.findByText(rotulo);
  return termo.nextElementSibling?.textContent;
}

describe('Painel', () => {
  beforeEach(() => {
    reiniciarAmbienteDeTestes();
  });

  it('mostra os indicadores calculados a partir dos dados salvos', async () => {
    armazenamentoLocal.gravarFavoritos([
      criarFavorito(1, 'Clube da Luta', '2026-10-01T10:00:00.000Z', ['Drama', 'Ação']),
      criarFavorito(2, 'Matrix', '2026-10-02T10:00:00.000Z', ['Ação']),
      criarFavorito(3, 'Superbad', '2026-10-03T10:00:00.000Z', ['Comédia']),
    ]);
    armazenamentoLocal.gravarAvaliacoes([criarAvaliacao(1, 8), criarAvaliacao(2, 8.5)]);

    render(<Painel />);

    expect(await valorDe('Favoritos')).toBe('3');
    expect(await valorDe('Filmes avaliados')).toBe('2');
    expect(await valorDe('Nota média')).toBe('8,3');
    expect(await valorDe('Gênero mais frequente')).toBe('Ação');
  });

  it('mostra zero e traço quando não há dados', async () => {
    render(<Painel />);

    expect(await valorDe('Favoritos')).toBe('0');
    expect(await valorDe('Filmes avaliados')).toBe('0');
    expect(await valorDe('Nota média')).toBe('—');
    expect(await valorDe('Gênero mais frequente')).toBe('—');
  });

  it('conta como avaliado um filme que não está nos favoritos', async () => {
    armazenamentoLocal.gravarAvaliacoes([criarAvaliacao(99, 9)]);

    render(<Painel />);

    expect(await valorDe('Favoritos')).toBe('0');
    expect(await valorDe('Filmes avaliados')).toBe('1');
    expect(await valorDe('Nota média')).toBe('9,0');
  });
});