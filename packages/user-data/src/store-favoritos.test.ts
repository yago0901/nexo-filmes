import { describe, expect, it, vi } from 'vitest';
import type { Favorito } from '@nexo/shared-types';
import { criarFavorito, criarFilme } from './auxiliares-de-teste';
import { estaFavoritado, estaSalvando } from './estado-favoritos';
import { escutarEvento } from './eventos';
import type { RepositorioUsuario } from './repositorio';
import { criarStoreFavoritos } from './store-favoritos';

function criarRepositorioManual(favoritosIniciais: Favorito[] = []) {
  let finalizar: (erro?: Error) => void = () => undefined;
  const definirFavorito = vi.fn(
    () =>
      new Promise<void>((resolver, rejeitar) => {
        finalizar = (erro) => (erro ? rejeitar(erro) : resolver());
      }),
  );
  const repositorio: RepositorioUsuario = {
    listarFavoritos: async () => favoritosIniciais,
    listarAvaliacoes: async () => [],
    salvarAvaliacao: async () => {
      throw new Error('não utilizado');
    },
    definirFavorito,
  };
  return {
    repositorio,
    definirFavorito,
    concluir: () => finalizar(),
    falhar: () => finalizar(new Error('falha')),
  };
}

describe('store de favoritos', () => {
  it('carrega os favoritos salvos', async () => {
    const { repositorio } = criarRepositorioManual([criarFavorito(550)]);
    const store = criarStoreFavoritos(repositorio);

    await store.carregar();

    expect(store.obterEstado().status).toBe('pronto');
    expect(estaFavoritado(store.obterEstado(), 550)).toBe(true);
  });

  it('marca erro quando o carregamento falha e se recupera na nova tentativa', async () => {
    const listarFavoritos = vi
      .fn<RepositorioUsuario['listarFavoritos']>()
      .mockRejectedValueOnce(new Error('falha'))
      .mockResolvedValueOnce([criarFavorito(550)]);
    const { repositorio } = criarRepositorioManual();
    const store = criarStoreFavoritos({ ...repositorio, listarFavoritos });

    await store.carregar();
    expect(store.obterEstado().status).toBe('erro');

    await store.carregar();
    expect(store.obterEstado().status).toBe('pronto');
    expect(estaFavoritado(store.obterEstado(), 550)).toBe(true);
  });

  it('mostra favoritado e salvando antes de o repositório responder', async () => {
    const { repositorio, concluir } = criarRepositorioManual();
    const store = criarStoreFavoritos(repositorio);
    await store.carregar();

    const promessa = store.alternarFavorito(criarFilme(550));
    await vi.waitFor(() => expect(estaSalvando(store.obterEstado(), 550)).toBe(true));

    expect(estaFavoritado(store.obterEstado(), 550)).toBe(true);
    concluir();
    await promessa;
  });

  it('confirma o favorito e limpa o salvando quando o repositório conclui', async () => {
    const { repositorio, concluir } = criarRepositorioManual();
    const store = criarStoreFavoritos(repositorio);
    await store.carregar();

    const promessa = store.alternarFavorito(criarFilme(550));
    await vi.waitFor(() => expect(estaSalvando(store.obterEstado(), 550)).toBe(true));
    concluir();
    await promessa;

    expect(estaFavoritado(store.obterEstado(), 550)).toBe(true);
    expect(estaSalvando(store.obterEstado(), 550)).toBe(false);
  });

  it('volta ao estado anterior quando favoritar falha', async () => {
    const { repositorio, falhar } = criarRepositorioManual();
    const store = criarStoreFavoritos(repositorio);
    await store.carregar();

    const promessa = store.alternarFavorito(criarFilme(550));
    await vi.waitFor(() => expect(estaFavoritado(store.obterEstado(), 550)).toBe(true));
    falhar();
    await promessa;

    expect(estaFavoritado(store.obterEstado(), 550)).toBe(false);
    expect(estaSalvando(store.obterEstado(), 550)).toBe(false);
  });

  it('restaura o favorito quando desfavoritar falha', async () => {
    const { repositorio, falhar } = criarRepositorioManual([criarFavorito(550)]);
    const store = criarStoreFavoritos(repositorio);
    await store.carregar();

    const promessa = store.alternarFavorito(criarFilme(550));
    await vi.waitFor(() => expect(estaFavoritado(store.obterEstado(), 550)).toBe(false));
    falhar();
    await promessa;

    expect(estaFavoritado(store.obterEstado(), 550)).toBe(true);
    expect(estaSalvando(store.obterEstado(), 550)).toBe(false);
  });

  it('ignora novos cliques enquanto o filme está salvando', async () => {
    const { repositorio, definirFavorito, concluir } = criarRepositorioManual();
    const store = criarStoreFavoritos(repositorio);
    await store.carregar();

    const primeira = store.alternarFavorito(criarFilme(550));
    await vi.waitFor(() => expect(estaSalvando(store.obterEstado(), 550)).toBe(true));
    await store.alternarFavorito(criarFilme(550));

    expect(definirFavorito).toHaveBeenCalledTimes(1);
    expect(estaFavoritado(store.obterEstado(), 550)).toBe(true);
    concluir();
    await primeira;
  });

  it('emite os eventos de alteração, desfazimento e falha', async () => {
    const alteracoes: boolean[] = [];
    const falhas: number[] = [];
    const pararAlteracoes = escutarEvento('nexo:favoritos-alterados', ({ favoritado }) => {
      alteracoes.push(favoritado);
    });
    const pararFalhas = escutarEvento('nexo:favorito-falhou', ({ filmeId }) => {
      falhas.push(filmeId);
    });
    const { repositorio, falhar } = criarRepositorioManual();
    const store = criarStoreFavoritos(repositorio);
    await store.carregar();

    const promessa = store.alternarFavorito(criarFilme(550));
    await vi.waitFor(() => expect(estaSalvando(store.obterEstado(), 550)).toBe(true));
    falhar();
    await promessa;
    pararAlteracoes();
    pararFalhas();

    expect(alteracoes).toEqual([true, false]);
    expect(falhas).toEqual([550]);
  });

  it('avisa os assinantes a cada mudança e para depois de cancelar', async () => {
    const { repositorio, concluir } = criarRepositorioManual();
    const store = criarStoreFavoritos(repositorio);
    const ouvinte = vi.fn();
    const cancelar = store.assinar(ouvinte);

    await store.carregar();
    expect(ouvinte).toHaveBeenCalled();

    cancelar();
    const chamadasAntes = ouvinte.mock.calls.length;
    const promessa = store.alternarFavorito(criarFilme(550));
    await vi.waitFor(() => expect(estaSalvando(store.obterEstado(), 550)).toBe(true));
    concluir();
    await promessa;

    expect(ouvinte.mock.calls.length).toBe(chamadasAntes);
  });
});