import { describe, expect, it } from 'vitest';
import { descreverNotaDoUsuario } from './nota-do-usuario';

describe('descreverNotaDoUsuario', () => {
  it('mostra a nota formatada quando há avaliação', () => {
    expect(descreverNotaDoUsuario(8.5, true)).toBe('Sua nota: 8,5');
  });

  it('mostra a nota mesmo antes de as avaliações terminarem de carregar', () => {
    expect(descreverNotaDoUsuario(7, false)).toBe('Sua nota: 7,0');
  });

  it('indica ausência quando as avaliações carregaram e não há nota', () => {
    expect(descreverNotaDoUsuario(undefined, true)).toBe('Ainda sem avaliação');
  });

  it('não afirma nada enquanto as avaliações carregam', () => {
    expect(descreverNotaDoUsuario(undefined, false)).toBeNull();
  });
});