import { describe, expect, it } from 'vitest';
import { criarAvaliacao } from './auxiliares-de-teste';
import {
  comAvaliacaoSalva,
  definirAvaliacoesCarregadas,
  ESTADO_INICIAL_AVALIACOES,
  listarAvaliacoesDoEstado,
  obterAvaliacaoDoEstado,
} from './estado-avaliacoes';

describe('estado de avaliações', () => {
  it('passa para pronto ao carregar e encontra a avaliação pelo filme', () => {
    const estado = definirAvaliacoesCarregadas(ESTADO_INICIAL_AVALIACOES, [
      criarAvaliacao(550, 9),
    ]);

    expect(estado.status).toBe('pronto');
    expect(obterAvaliacaoDoEstado(estado, 550)?.nota).toBe(9);
  });

  it('devolve undefined para filme sem avaliação', () => {
    expect(obterAvaliacaoDoEstado(ESTADO_INICIAL_AVALIACOES, 550)).toBeUndefined();
  });

  it('uma nova avaliação do mesmo filme substitui a anterior', () => {
    const estado = comAvaliacaoSalva(
      comAvaliacaoSalva(ESTADO_INICIAL_AVALIACOES, criarAvaliacao(550, 5)),
      criarAvaliacao(550, 9.5),
    );

    expect(listarAvaliacoesDoEstado(estado)).toHaveLength(1);
    expect(obterAvaliacaoDoEstado(estado, 550)?.nota).toBe(9.5);
  });

  it('lista da avaliação mais recente para a mais antiga', () => {
    const estado = definirAvaliacoesCarregadas(ESTADO_INICIAL_AVALIACOES, [
      criarAvaliacao(1, 7, '2026-10-01T10:00:00.000Z'),
      criarAvaliacao(2, 7, '2026-10-03T10:00:00.000Z'),
      criarAvaliacao(3, 7, '2026-10-02T10:00:00.000Z'),
    ]);

    expect(listarAvaliacoesDoEstado(estado).map((avaliacao) => avaliacao.filmeId)).toEqual([
      2, 3, 1,
    ]);
  });

  it('não altera o estado original ao salvar', () => {
    comAvaliacaoSalva(ESTADO_INICIAL_AVALIACOES, criarAvaliacao(550));

    expect(obterAvaliacaoDoEstado(ESTADO_INICIAL_AVALIACOES, 550)).toBeUndefined();
  });
});