export class ErroTmdb extends Error {
  readonly status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = 'ErroTmdb';
    this.status = status;
  }
}

export class ErroLimiteRequisicoes extends ErroTmdb {
  constructor() {
    super('Limite de requisições da TMDB atingido', 429);
    this.name = 'ErroLimiteRequisicoes';
  }
}

export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ErroLimiteRequisicoes) {
    return 'Muitas requisições em pouco tempo. Aguarde um instante e tente novamente.';
  }
  if (erro instanceof ErroTmdb && erro.status === 0) {
    return 'Sem conexão com a TMDB. Verifique sua internet e tente novamente.';
  }
  if (erro instanceof ErroTmdb && erro.status === 401) {
    return 'Token da TMDB ausente ou inválido. Confira o arquivo .env.';
  }
  return 'Não foi possível carregar os dados. Tente novamente.';
}