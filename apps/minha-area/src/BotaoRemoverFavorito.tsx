import type { FilmeResumo } from '@nexo/shared-types';
import { useFavorito } from '@nexo/user-data';

interface BotaoRemoverFavoritoProps {
  filme: FilmeResumo;
}

export function BotaoRemoverFavorito({ filme }: BotaoRemoverFavoritoProps) {
  const { salvando, alternar } = useFavorito(filme);

  return (
    <button
      type="button"
      className="botao-remover"
      aria-busy={salvando}
      aria-label={`Remover ${filme.titulo} dos favoritos`}
      disabled={salvando}
      onClick={() => void alternar()}
    >
      {salvando ? 'Removendo…' : 'Remover'}
    </button>
  );
}