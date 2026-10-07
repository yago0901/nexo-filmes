import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Paginacao } from './Paginacao';

describe('Paginacao', () => {
  it('mostra a página atual e o total', () => {
    render(<Paginacao pagina={2} totalPaginas={5} aoMudarPagina={vi.fn()} />);

    expect(screen.getByText('Página 2 de 5')).toBeTruthy();
  });

  it('desabilita "Anterior" na primeira página', () => {
    render(<Paginacao pagina={1} totalPaginas={5} aoMudarPagina={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Anterior' }).hasAttribute('disabled')).toBe(true);
    expect(screen.getByRole('button', { name: 'Próxima' }).hasAttribute('disabled')).toBe(false);
  });

  it('desabilita "Próxima" na última página', () => {
    render(<Paginacao pagina={5} totalPaginas={5} aoMudarPagina={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Próxima' }).hasAttribute('disabled')).toBe(true);
  });

  it('pede a página anterior e a próxima', () => {
    const aoMudarPagina = vi.fn();
    render(<Paginacao pagina={3} totalPaginas={5} aoMudarPagina={aoMudarPagina} />);

    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));

    expect(aoMudarPagina).toHaveBeenNthCalledWith(1, 2);
    expect(aoMudarPagina).toHaveBeenNthCalledWith(2, 4);
  });

  it('não aparece quando há uma página só', () => {
    const { container } = render(
      <Paginacao pagina={1} totalPaginas={1} aoMudarPagina={vi.fn()} />,
    );

    expect(container.firstChild).toBeNull();
  });
});