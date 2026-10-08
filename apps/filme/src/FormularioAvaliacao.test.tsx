import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Avaliacao } from '@nexo/shared-types';
import { FormularioAvaliacao } from './FormularioAvaliacao';

const ROTULO_NOTA = 'Nota';
const ROTULO_COMENTARIO = 'Comentário (opcional)';

const avaliacaoExistente: Avaliacao = {
  filmeId: 550,
  nota: 8.5,
  comentario: 'Muito bom',
  atualizadaEm: '2026-10-01T10:00:00.000Z',
};

function preencher(rotulo: string, valor: string) {
  fireEvent.change(screen.getByLabelText(rotulo), { target: { value: valor } });
}

function valorDe(rotulo: string): string {
  return (screen.getByLabelText(rotulo) as HTMLInputElement).value;
}

function enviar(nomeDoBotao = 'Salvar avaliação') {
  fireEvent.click(screen.getByRole('button', { name: nomeDoBotao }));
}

describe('FormularioAvaliacao', () => {
  it('mostra a mensagem e foca a nota quando o formulário está vazio', async () => {
    const aoSalvar = vi.fn();
    render(<FormularioAvaliacao avaliacao={undefined} aoSalvar={aoSalvar} />);

    enviar();

    expect(await screen.findByText('Informe uma nota.')).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText(ROTULO_NOTA)));
    expect(aoSalvar).not.toHaveBeenCalled();
  });

  it('mostra uma mensagem por campo e foca o primeiro inválido, sem perder o que foi digitado', async () => {
    render(<FormularioAvaliacao avaliacao={undefined} aoSalvar={vi.fn()} />);
    preencher(ROTULO_NOTA, 'abc');
    preencher(ROTULO_COMENTARIO, 'a'.repeat(501));

    enviar();

    expect(await screen.findByText('A nota deve ser um número.')).toBeTruthy();
    expect(screen.getByText('O comentário deve ter no máximo 500 caracteres.')).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText(ROTULO_NOTA)));
    expect(valorDe(ROTULO_NOTA)).toBe('abc');
    expect(valorDe(ROTULO_COMENTARIO)).toHaveLength(501);
  });

  it('foca o comentário quando só ele é inválido e mantém a nota digitada', async () => {
    render(<FormularioAvaliacao avaliacao={undefined} aoSalvar={vi.fn()} />);
    preencher(ROTULO_NOTA, '8,5');
    preencher(ROTULO_COMENTARIO, 'a'.repeat(501));

    enviar();

    expect(
      await screen.findByText('O comentário deve ter no máximo 500 caracteres.'),
    ).toBeTruthy();
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByLabelText(ROTULO_COMENTARIO)),
    );
    expect(valorDe(ROTULO_NOTA)).toBe('8,5');
  });

  it('marca o campo inválido para tecnologias assistivas', async () => {
    render(<FormularioAvaliacao avaliacao={undefined} aoSalvar={vi.fn()} />);

    enviar();

    await screen.findByText('Informe uma nota.');
    const campo = screen.getByLabelText(ROTULO_NOTA);
    expect(campo.getAttribute('aria-invalid')).toBe('true');
    expect(campo.getAttribute('aria-describedby')).toContain('erro-nota');
  });

  it('aceita a nota com vírgula e envia como número', async () => {
    const aoSalvar = vi.fn().mockResolvedValue(undefined);
    render(<FormularioAvaliacao avaliacao={undefined} aoSalvar={aoSalvar} />);
    preencher(ROTULO_NOTA, '8,5');

    enviar();

    await waitFor(() => expect(aoSalvar).toHaveBeenCalledWith({ nota: 8.5, comentario: '' }));
  });

  it('envia o comentário sem os espaços das pontas', async () => {
    const aoSalvar = vi.fn().mockResolvedValue(undefined);
    render(<FormularioAvaliacao avaliacao={undefined} aoSalvar={aoSalvar} />);
    preencher(ROTULO_NOTA, '7');
    preencher(ROTULO_COMENTARIO, '  ótimo  ');

    enviar();

    await waitFor(() => expect(aoSalvar).toHaveBeenCalledWith({ nota: 7, comentario: 'ótimo' }));
  });

  it('desabilita o botão e mostra "Salvando…" enquanto salva', async () => {
    render(
      <FormularioAvaliacao
        avaliacao={undefined}
        aoSalvar={() => new Promise<void>(() => undefined)}
      />,
    );
    preencher(ROTULO_NOTA, '7');

    enviar();

    const botao = await screen.findByRole('button', { name: 'Salvando…' });
    expect(botao.hasAttribute('disabled')).toBe(true);
  });

  it('avisa que a avaliação foi salva', async () => {
    render(
      <FormularioAvaliacao avaliacao={undefined} aoSalvar={vi.fn().mockResolvedValue(undefined)} />,
    );
    preencher(ROTULO_NOTA, '7');

    enviar();

    expect(await screen.findByText('Avaliação salva.')).toBeTruthy();
  });

  it('avisa a falha e mantém tudo o que foi digitado', async () => {
    const aoSalvar = vi.fn().mockRejectedValue(new Error('falha'));
    render(<FormularioAvaliacao avaliacao={undefined} aoSalvar={aoSalvar} />);
    preencher(ROTULO_NOTA, '7');
    preencher(ROTULO_COMENTARIO, 'ótimo filme');

    enviar();

    expect(await screen.findByText(/Não foi possível salvar sua avaliação/)).toBeTruthy();
    expect(valorDe(ROTULO_NOTA)).toBe('7');
    expect(valorDe(ROTULO_COMENTARIO)).toBe('ótimo filme');
    expect(screen.getByRole('button', { name: 'Salvar avaliação' }).hasAttribute('disabled')).toBe(
      false,
    );
  });

  it('preenche os campos ao editar uma avaliação existente', () => {
    render(<FormularioAvaliacao avaliacao={avaliacaoExistente} aoSalvar={vi.fn()} />);

    expect(valorDe(ROTULO_NOTA)).toBe('8,5');
    expect(valorDe(ROTULO_COMENTARIO)).toBe('Muito bom');
    expect(screen.getByRole('button', { name: 'Atualizar avaliação' })).toBeTruthy();
  });
});