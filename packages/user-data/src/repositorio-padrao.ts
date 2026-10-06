import { armazenamentoLocal } from './armazenamento';
import { lerConfiguracaoDoAmbiente } from './configuracao';
import { criarRepositorioUsuario } from './repositorio';

export const repositorioUsuario = criarRepositorioUsuario(
  armazenamentoLocal,
  lerConfiguracaoDoAmbiente(),
);