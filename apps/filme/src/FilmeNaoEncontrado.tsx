import { EstadoVazio } from '@nexo/ui';

export function FilmeNaoEncontrado() {
  return (
    <EstadoVazio
      titulo="Filme não encontrado"
      descricao="O filme que você procura não existe ou foi removido."
    />
  );
}