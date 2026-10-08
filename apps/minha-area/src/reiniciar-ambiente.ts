import { armazenamentoLocal, reiniciarStoresGlobais } from '@nexo/user-data';

export function reiniciarAmbienteDeTestes(): void {
  armazenamentoLocal.gravarFavoritos([]);
  armazenamentoLocal.gravarAvaliacoes([]);
  reiniciarStoresGlobais();
}