export { armazenamentoLocal } from './armazenamento';
export type { Armazenamento } from './armazenamento';
export { CONFIGURACAO_DESLIGADA, lerConfiguracaoDoAmbiente } from './configuracao';
export type { ConfiguracaoRepositorio } from './configuracao';
export { emitirEvento, escutarEvento } from './eventos';
export { criarRepositorioUsuario, ErroEscritaSimulado } from './repositorio';
export type { NovaAvaliacao, RepositorioUsuario } from './repositorio';
export { repositorioUsuario } from './repositorio-padrao';