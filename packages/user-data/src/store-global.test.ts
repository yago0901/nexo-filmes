import { beforeEach, describe, expect, it } from 'vitest';
import {
  obterStoreAvaliacoes,
  obterStoreFavoritos,
  reiniciarStoresGlobais,
} from './store-global';

describe('obterStoreFavoritos', () => {
  beforeEach(() => {
    reiniciarStoresGlobais();
  });

  it('devolve sempre a mesma instância (singleton via globalThis)', () => {
    const a = obterStoreFavoritos();
    const b = obterStoreFavoritos();
    expect(a).toBe(b);
  });

  it('cria uma nova instância depois de reiniciar', () => {
    const antes = obterStoreFavoritos();
    reiniciarStoresGlobais();
    const depois = obterStoreFavoritos();
    expect(antes).not.toBe(depois);
  });
});

describe('obterStoreAvaliacoes', () => {
  beforeEach(() => {
    reiniciarStoresGlobais();
  });

  it('devolve sempre a mesma instância (singleton via globalThis)', () => {
    const a = obterStoreAvaliacoes();
    const b = obterStoreAvaliacoes();
    expect(a).toBe(b);
  });

  it('cria uma nova instância depois de reiniciar', () => {
    const antes = obterStoreAvaliacoes();
    reiniciarStoresGlobais();
    const depois = obterStoreAvaliacoes();
    expect(antes).not.toBe(depois);
  });
});

describe('reiniciarStoresGlobais', () => {
  beforeEach(() => {
    reiniciarStoresGlobais();
  });

  it('remove os dois stores do globalThis', () => {
    obterStoreFavoritos();
    obterStoreAvaliacoes();
    expect((globalThis as Record<string, unknown>).__nexoStoreFavoritos).toBeDefined();
    expect((globalThis as Record<string, unknown>).__nexoStoreAvaliacoes).toBeDefined();

    reiniciarStoresGlobais();

    expect((globalThis as Record<string, unknown>).__nexoStoreFavoritos).toBeUndefined();
    expect((globalThis as Record<string, unknown>).__nexoStoreAvaliacoes).toBeUndefined();
  });

  it('não quebra se chamado duas vezes seguidas', () => {
    reiniciarStoresGlobais();
    expect(() => reiniciarStoresGlobais()).not.toThrow();
  });
});