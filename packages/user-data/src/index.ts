export { armazenamentoLocal } from './armazenamento';
export type { Armazenamento } from './armazenamento';
export { CONFIGURACAO_DESLIGADA, lerConfiguracaoDoAmbiente } from './configuracao';
export type { ConfiguracaoRepositorio } from './configuracao';
export {
  contarFavoritos,
  estaFavoritado,
  estaSalvando,
  listarFavoritos,
} from './estado-favoritos';
export type { EstadoFavoritos, StatusFavoritos } from './estado-favoritos';
export { emitirEvento, escutarEvento } from './eventos';
export { useFavorito, useFavoritos } from './hooks';
export { criarRepositorioUsuario, ErroEscritaSimulado } from './repositorio';
export type { NovaAvaliacao, RepositorioUsuario } from './repositorio';
export { repositorioUsuario } from './repositorio-padrao';
export { criarStoreFavoritos } from './store-favoritos';
export type { StoreFavoritos } from './store-favoritos';
export { obterStoreFavoritos } from './store-global';