import { describe, expect, it } from 'vitest';
import { formatarAno, formatarDuracao, formatarNota } from './formatadores';

describe('formatarNota', () => {
  it('usa uma casa decimal com vírgula', () => {
    expect(formatarNota(8.4)).toBe('8,4');
  });

  it('completa com zero quando a nota é inteira', () => {
    expect(formatarNota(7)).toBe('7,0');
  });

  it('indica ausência quando a nota é zero', () => {
    expect(formatarNota(0)).toBe('Sem nota');
  });
});

describe('formatarAno', () => {
  it('mostra o ano', () => {
    expect(formatarAno(1999)).toBe('1999');
  });

  it('indica ausência quando não há ano', () => {
    expect(formatarAno(null)).toBe('Ano não informado');
  });
});

describe('formatarDuracao', () => {
  it('mostra só minutos quando é menos de uma hora', () => {
    expect(formatarDuracao(45)).toBe('45 min');
  });

  it('mostra só horas quando não há minutos restantes', () => {
    expect(formatarDuracao(120)).toBe('2 h');
  });

  it('mostra horas e minutos', () => {
    expect(formatarDuracao(139)).toBe('2 h 19 min');
  });

  it('indica ausência quando não há duração', () => {
    expect(formatarDuracao(null)).toBe('Duração não informada');
  });
});