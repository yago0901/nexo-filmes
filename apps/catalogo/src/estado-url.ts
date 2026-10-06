export interface FiltrosCatalogo {
  termo: string;
  generoId: number | null;
  pagina: number;
}

export const FILTROS_PADRAO: FiltrosCatalogo = { termo: '', generoId: null, pagina: 1 };

const PAGINA_MAXIMA = 500;

function interpretarInteiroPositivo(valor: string | null): number | null {
  if (valor === null || !/^\d+$/.test(valor)) return null;
  const numero = Number(valor);
  return numero > 0 ? numero : null;
}

export function lerFiltros(parametros: URLSearchParams): FiltrosCatalogo {
  const termo = (parametros.get('q') ?? '').trim();
  const generoId = termo ? null : interpretarInteiroPositivo(parametros.get('genero'));
  const pagina = Math.min(
    interpretarInteiroPositivo(parametros.get('pagina')) ?? 1,
    PAGINA_MAXIMA,
  );
  return { termo, generoId, pagina };
}

export function escreverFiltros(filtros: FiltrosCatalogo): URLSearchParams {
  const parametros = new URLSearchParams();
  if (filtros.termo) parametros.set('q', filtros.termo);
  if (!filtros.termo && filtros.generoId !== null) {
    parametros.set('genero', String(filtros.generoId));
  }
  if (filtros.pagina > 1) parametros.set('pagina', String(filtros.pagina));
  return parametros;
}

export function comTermo(filtros: FiltrosCatalogo, termo: string): FiltrosCatalogo {
  const termoLimpo = termo.trim();
  return {
    termo: termoLimpo,
    generoId: termoLimpo ? null : filtros.generoId,
    pagina: 1,
  };
}

export function comGenero(filtros: FiltrosCatalogo, generoId: number | null): FiltrosCatalogo {
  return { ...filtros, termo: '', generoId, pagina: 1 };
}

export function comPagina(filtros: FiltrosCatalogo, pagina: number): FiltrosCatalogo {
  return { ...filtros, pagina };
}