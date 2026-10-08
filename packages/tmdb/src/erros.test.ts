import { describe, expect, it } from 'vitest';
import { ErroLimiteRequisicoes, ErroTmdb, mensagemDeErro } from './erros';

describe('ErroTmdb', () => {
  it('guarda mensagem, status e nome', () => {
    const erro = new ErroTmdb('falhou', 500);
    expect(erro).toBeInstanceOf(Error);
    expect(erro.name).toBe('ErroTmdb');
    expect(erro.message).toBe('falhou');
    expect(erro.status).toBe(500);
  });

  it('funciona com status 0 (falha de rede)', () => {
    const erro = new ErroTmdb('sem conexão', 0);
    expect(erro.status).toBe(0);
  });
});

describe('ErroLimiteRequisicoes', () => {
  it('é um ErroTmdb com status 429', () => {
    const erro = new ErroLimiteRequisicoes();
    expect(erro).toBeInstanceOf(ErroTmdb);
    expect(erro.name).toBe('ErroLimiteRequisicoes');
    expect(erro.status).toBe(429);
    expect(erro.message).toContain('Limite de requisições');
  });
});

describe('mensagemDeErro', () => {
  it('mensagem específica para limite de requisições', () => {
    expect(mensagemDeErro(new ErroLimiteRequisicoes())).toBe(
      'Muitas requisições em pouco tempo. Aguarde um instante e tente novamente.',
    );
  });

  it('mensagem específica para falha de conexão (status 0)', () => {
    expect(mensagemDeErro(new ErroTmdb('x', 0))).toBe(
      'Sem conexão com a TMDB. Verifique sua internet e tente novamente.',
    );
  });

  it('mensagem específica para token inválido (status 401)', () => {
    expect(mensagemDeErro(new ErroTmdb('x', 401))).toBe(
      'Token da TMDB ausente ou inválido. Confira o arquivo .env.',
    );
  });

  it('mensagem genérica para outros status da TMDB', () => {
    expect(mensagemDeErro(new ErroTmdb('x', 500))).toBe(
      'Não foi possível carregar os dados. Tente novamente.',
    );
  });

  it('mensagem genérica para erros desconhecidos', () => {
    expect(mensagemDeErro(new Error('qualquer'))).toBe(
      'Não foi possível carregar os dados. Tente novamente.',
    );
    expect(mensagemDeErro('string')).toBe('Não foi possível carregar os dados. Tente novamente.');
    expect(mensagemDeErro(null)).toBe('Não foi possível carregar os dados. Tente novamente.');
    expect(mensagemDeErro(undefined)).toBe(
      'Não foi possível carregar os dados. Tente novamente.',
    );
  });

  it('verifica a ordem: ErroLimiteRequisicoes tem prioridade sobre status 429', () => {
    // Garante que o "if" de limite vem antes do "if" de status 0 e 401
    expect(mensagemDeErro(new ErroLimiteRequisicoes())).not.toBe(
      'Não foi possível carregar os dados. Tente novamente.',
    );
  });
});