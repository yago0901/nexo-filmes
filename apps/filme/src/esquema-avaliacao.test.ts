import { describe, expect, it } from 'vitest';
import {
  converterNota,
  esquemaAvaliacao,
  formatarNotaParaCampo,
} from './esquema-avaliacao';

function primeiraMensagem(nota: string, comentario = ''): string | undefined {
  const resultado = esquemaAvaliacao.safeParse({ nota, comentario });
  return resultado.success ? undefined : resultado.error.issues[0]?.message;
}

describe('nota', () => {
  it.each(['0,5', '0.5', '1', '7,5', '10', ' 8 '])('aceita %s', (nota) => {
    expect(primeiraMensagem(nota)).toBeUndefined();
  });

  it.each([
    ['', 'Informe uma nota.'],
    ['   ', 'Informe uma nota.'],
    ['abc', 'A nota deve ser um número.'],
    ['0', 'A nota deve estar entre 0,5 e 10.'],
    ['-1', 'A nota deve estar entre 0,5 e 10.'],
    ['10,5', 'A nota deve estar entre 0,5 e 10.'],
    ['11', 'A nota deve estar entre 0,5 e 10.'],
    ['3,3', 'A nota deve variar de 0,5 em 0,5.'],
    ['7,25', 'A nota deve variar de 0,5 em 0,5.'],
  ])('rejeita "%s" com a mensagem "%s"', (nota, mensagem) => {
    expect(primeiraMensagem(nota)).toBe(mensagem);
  });
});

describe('comentário', () => {
  it('é opcional', () => {
    expect(primeiraMensagem('8', '')).toBeUndefined();
  });

  it('aceita exatamente 500 caracteres', () => {
    expect(primeiraMensagem('8', 'a'.repeat(500))).toBeUndefined();
  });

  it('rejeita 501 caracteres', () => {
    expect(primeiraMensagem('8', 'a'.repeat(501))).toBe(
      'O comentário deve ter no máximo 500 caracteres.',
    );
  });

  it('desconsidera os espaços nas pontas ao contar e ao devolver', () => {
    const resultado = esquemaAvaliacao.safeParse({
      nota: '8',
      comentario: `  ${'a'.repeat(500)}  `,
    });

    expect(resultado.success).toBe(true);
    expect(resultado.success && resultado.data.comentario).toBe('a'.repeat(500));
  });
});

describe('conversões', () => {
  it('converte vírgula e ponto para número', () => {
    expect(converterNota('8,5')).toBe(8.5);
    expect(converterNota('8.5')).toBe(8.5);
  });

  it('devolve NaN para texto vazio', () => {
    expect(Number.isNaN(converterNota(''))).toBe(true);
  });

  it('mostra a nota com vírgula no campo', () => {
    expect(formatarNotaParaCampo(8.5)).toBe('8,5');
    expect(formatarNotaParaCampo(10)).toBe('10');
  });
});