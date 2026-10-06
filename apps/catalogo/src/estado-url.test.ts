import { describe, expect, it } from 'vitest';
import {
  comGenero,
  comPagina,
  comTermo,
  escreverFiltros,
  FILTROS_PADRAO,
  lerFiltros,
} from './estado-url';

describe('lerFiltros', () => {
  it('usa os valores padrão quando a URL está vazia', () => {
    expect(lerFiltros(new URLSearchParams())).toEqual(FILTROS_PADRAO);
  });

  it('lê termo, gênero e página', () => {
    expect(lerFiltros(new URLSearchParams('genero=28&pagina=3'))).toEqual({
      termo: '',
      generoId: 28,
      pagina: 3,
    });
  });

  it('ignora o gênero quando há termo de busca', () => {
    expect(lerFiltros(new URLSearchParams('q=matrix&genero=28'))).toEqual({
      termo: 'matrix',
      generoId: null,
      pagina: 1,
    });
  });

  it('apara os espaços do termo', () => {
    expect(lerFiltros(new URLSearchParams('q=%20matrix%20')).termo).toBe('matrix');
  });

  it.each(['abc', '0', '-2', '1.5', ''])('volta para a página 1 com pagina=%s', (valor) => {
    expect(lerFiltros(new URLSearchParams({ pagina: valor })).pagina).toBe(1);
  });

  it('limita a página a 500', () => {
    expect(lerFiltros(new URLSearchParams('pagina=9999')).pagina).toBe(500);
  });

  it('ignora gênero inválido', () => {
    expect(lerFiltros(new URLSearchParams('genero=abc')).generoId).toBeNull();
  });
});

describe('escreverFiltros', () => {
  it('omite os valores padrão', () => {
    expect(escreverFiltros(FILTROS_PADRAO).toString()).toBe('');
  });

  it('escreve termo e página', () => {
    expect(escreverFiltros({ termo: 'matrix', generoId: null, pagina: 2 }).toString()).toBe(
      'q=matrix&pagina=2',
    );
  });

  it('não escreve o gênero quando há termo', () => {
    expect(escreverFiltros({ termo: 'matrix', generoId: 28, pagina: 1 }).toString()).toBe(
      'q=matrix',
    );
  });

  it('escreve o gênero quando não há termo', () => {
    expect(escreverFiltros({ termo: '', generoId: 28, pagina: 1 }).toString()).toBe('genero=28');
  });

  it('gera uma URL que, lida de volta, devolve os mesmos filtros', () => {
    const filtros = { termo: 'o poderoso chefão', generoId: null, pagina: 4 };

    expect(lerFiltros(escreverFiltros(filtros))).toEqual(filtros);
  });
});

describe('transições de filtros', () => {
  it('um novo termo volta para a página 1 e limpa o gênero', () => {
    expect(comTermo({ termo: '', generoId: 28, pagina: 5 }, 'matrix')).toEqual({
      termo: 'matrix',
      generoId: null,
      pagina: 1,
    });
  });

  it('apagar o termo mantém o gênero atual e volta para a página 1', () => {
    expect(comTermo({ termo: '', generoId: 28, pagina: 5 }, '   ')).toEqual({
      termo: '',
      generoId: 28,
      pagina: 1,
    });
  });

  it('escolher um gênero limpa a busca e volta para a página 1', () => {
    expect(comGenero({ termo: 'matrix', generoId: null, pagina: 3 }, 18)).toEqual({
      termo: '',
      generoId: 18,
      pagina: 1,
    });
  });

  it('trocar de página preserva os demais filtros', () => {
    expect(comPagina({ termo: '', generoId: 28, pagina: 1 }, 2)).toEqual({
      termo: '',
      generoId: 28,
      pagina: 2,
    });
  });
});