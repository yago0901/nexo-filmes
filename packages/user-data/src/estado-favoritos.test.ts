import { describe, expect, it } from 'vitest';
import { criarFavorito } from './auxiliares-de-teste';
import {
  adicionarFavorito,
  contarFavoritos,
  definirCarregados,
  desmarcarPendente,
  ESTADO_INICIAL,
  estaFavoritado,
  estaSalvando,
  listarFavoritos,
  marcarPendente,
  removerFavorito,
  restaurarFavorito,
} from './estado-favoritos';

describe('estado de favoritos', () => {
  it('lista do favorito mais recente para o mais antigo', () => {
    const estado = definirCarregados(ESTADO_INICIAL, [
      criarFavorito(1, '2026-10-01T10:00:00.000Z'),
      criarFavorito(2, '2026-10-03T10:00:00.000Z'),
      criarFavorito(3, '2026-10-02T10:00:00.000Z'),
    ]);

    expect(listarFavoritos(estado).map((favorito) => favorito.filme.id)).toEqual([2, 3, 1]);
  });

  it('conta os favoritos e passa para pronto ao carregar', () => {
    const estado = definirCarregados(ESTADO_INICIAL, [criarFavorito(1), criarFavorito(2)]);

    expect(contarFavoritos(estado)).toBe(2);
    expect(estado.status).toBe('pronto');
  });

  it('adiciona e remove sem alterar o estado original', () => {
    const adicionado = adicionarFavorito(ESTADO_INICIAL, criarFavorito(550));
    const removido = removerFavorito(adicionado, 550);

    expect(estaFavoritado(adicionado, 550)).toBe(true);
    expect(estaFavoritado(removido, 550)).toBe(false);
    expect(estaFavoritado(ESTADO_INICIAL, 550)).toBe(false);
  });

  it('restaura o favorito anterior ou remove quando não havia', () => {
    const favorito = criarFavorito(550);
    const comFavorito = adicionarFavorito(ESTADO_INICIAL, favorito);

    expect(estaFavoritado(restaurarFavorito(ESTADO_INICIAL, 550, favorito), 550)).toBe(true);
    expect(estaFavoritado(restaurarFavorito(comFavorito, 550, undefined), 550)).toBe(false);
  });

  it('marca e desmarca filmes que estão salvando', () => {
    const salvando = marcarPendente(ESTADO_INICIAL, 550);

    expect(estaSalvando(salvando, 550)).toBe(true);
    expect(estaSalvando(desmarcarPendente(salvando, 550), 550)).toBe(false);
  });
});