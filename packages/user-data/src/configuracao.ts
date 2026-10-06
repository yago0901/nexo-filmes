export const ATRASO_MINIMO_MS = 300;
export const ATRASO_MAXIMO_MS = 1500;

export interface ConfiguracaoRepositorio {
  atrasoAtivo: boolean;
  falhaAtiva: boolean;
  atrasoMinimoMs: number;
  atrasoMaximoMs: number;
}

export const CONFIGURACAO_DESLIGADA: ConfiguracaoRepositorio = {
  atrasoAtivo: false,
  falhaAtiva: false,
  atrasoMinimoMs: ATRASO_MINIMO_MS,
  atrasoMaximoMs: ATRASO_MAXIMO_MS,
};

function interpretarBooleano(valor: string | undefined, padrao: boolean): boolean {
  if (valor === undefined) return padrao;
  return valor.trim().toLowerCase() === 'true';
}

export function lerConfiguracaoDoAmbiente(): ConfiguracaoRepositorio {
  return {
    atrasoAtivo: interpretarBooleano(import.meta.env.PUBLIC_REPO_DELAY, true),
    falhaAtiva: interpretarBooleano(import.meta.env.PUBLIC_REPO_FAIL, true),
    atrasoMinimoMs: ATRASO_MINIMO_MS,
    atrasoMaximoMs: ATRASO_MAXIMO_MS,
  };
}