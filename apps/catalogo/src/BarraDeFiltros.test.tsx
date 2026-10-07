import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Genero } from '@nexo/shared-types';
import { BarraDeFiltros } from './BarraDeFiltros';
import { FILTROS_PADRAO } from './estado-url';
import type { FiltrosCatalogo } from './estado-url';

const generos: Genero[] = [
  { id: 28, nome: 'Ação' },
  { id: 18, nome: 'Drama' },
];

function renderizar(filtros: FiltrosCatalogo = FILTROS_PADRAO) {
  const aoAlterarTermo = vi.fn();
  const aoAlterarGenero = vi.fn();
  render(
    <BarraDeFiltros
      filtros={filtros}
      generos={generos}
      aoAlterarTermo={aoAlterarTermo}
      aoAlterarGenero={aoAlterarGenero}
    />,
  );
  return { aoAlterarTermo, aoAlterarGenero };
}

describe('BarraDeFiltros', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('avisa o termo uma única vez, só depois de parar de digitar', () => {
    const { aoAlterarTermo } = renderizar();
    const campo = screen.getByLabelText('Buscar por título');

    fireEvent.change(campo, { target: { value: 'm' } });
    fireEvent.change(campo, { target: { value: 'ma' } });
    fireEvent.change(campo, { target: { value: 'mat' } });
    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(aoAlterarTermo).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(aoAlterarTermo).toHaveBeenCalledTimes(1);
    expect(aoAlterarTermo).toHaveBeenCalledWith('mat');
  });

  it('não avisa quando o texto só difere do termo atual por espaços', () => {
    const { aoAlterarTermo } = renderizar({ termo: 'matrix', generoId: null, pagina: 1 });

    fireEvent.change(screen.getByLabelText('Buscar por título'), {
      target: { value: 'matrix ' },
    });
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(aoAlterarTermo).not.toHaveBeenCalled();
  });

  it('desabilita o gênero e explica o motivo quando há busca', () => {
    renderizar({ termo: 'matrix', generoId: null, pagina: 1 });

    expect(screen.getByLabelText('Gênero').hasAttribute('disabled')).toBe(true);
    expect(screen.getByText(/não combina com o filtro de gênero/)).toBeTruthy();
  });

  it('notifica o gênero escolhido', () => {
    const { aoAlterarGenero } = renderizar();

    fireEvent.change(screen.getByLabelText('Gênero'), { target: { value: '28' } });

    expect(aoAlterarGenero).toHaveBeenCalledWith(28);
  });

  it('notifica null ao voltar para "Todos os gêneros"', () => {
    const { aoAlterarGenero } = renderizar({ termo: '', generoId: 28, pagina: 1 });

    fireEvent.change(screen.getByLabelText('Gênero'), { target: { value: '' } });

    expect(aoAlterarGenero).toHaveBeenCalledWith(null);
  });
});