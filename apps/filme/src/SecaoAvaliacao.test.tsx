import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { SecaoAvaliacao } from './SecaoAvaliacao';

describe('SecaoAvaliacao', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('salva pelo repositório e preenche o formulário ao abrir de novo', async () => {
    const primeira = render(<SecaoAvaliacao filmeId={550} />);
    fireEvent.change(await screen.findByLabelText('Nota'), { target: { value: '9' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar avaliação' }));
    expect(await screen.findByText('Avaliação salva.')).toBeTruthy();
    primeira.unmount();

    render(<SecaoAvaliacao filmeId={550} />);

    const campo = (await screen.findByLabelText('Nota')) as HTMLInputElement;
    expect(campo.value).toBe('9');
    expect(screen.getByRole('button', { name: 'Atualizar avaliação' })).toBeTruthy();
  });
});