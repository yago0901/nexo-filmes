export { armazenamentoLocal } from './armazenamento';
export type { Armazenamento } from './armazenamento';
export { CONFIGURACAO_DESLIGADA, lerConfiguracaoDoAmbiente } from './configuracao';
export type { ConfiguracaoRepositorio } from './configuracao';
export { listarAvaliacoesDoEstado, obterAvaliacaoDoEstado } from './estado-avaliacoes';
export type { EstadoAvaliacoes, StatusAvaliacoes } from './estado-avaliacoes';
export {
  contarFavoritos,
  estaFavoritado,
  estaSalvando,
  listarFavoritos,
} from './estado-favoritos';
export type { EstadoFavoritos, StatusFavoritos } from './estado-favoritos';
export { emitirEvento, escutarEvento } from './eventos';
export { useAvaliacao, useAvaliacoes, useFavorito, useFavoritos } from './hooks';
export type { DadosAvaliacao } from './hooks';
export { criarRepositorioUsuario, ErroEscritaSimulado } from './repositorio';
export type { NovaAvaliacao, RepositorioUsuario } from './repositorio';
export { repositorioUsuario } from './repositorio-padrao';
export { criarStoreAvaliacoes } from './store-avaliacoes';
export type { StoreAvaliacoes } from './store-avaliacoes';
export { criarStoreFavoritos } from './store-favoritos';
export type { StoreFavoritos } from './store-favoritos';
export { obterStoreAvaliacoes, obterStoreFavoritos } from './store-global';