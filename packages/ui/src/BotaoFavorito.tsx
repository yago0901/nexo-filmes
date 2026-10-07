import { useMemo } from 'react';
import type { FilmeResumo } from '@nexo/shared-types';
import { useFavorito } from '@nexo/user-data';

interface BotaoFavoritoProps {
  filme: FilmeResumo;
}

export function BotaoFavorito({ filme }: BotaoFavoritoProps) {
  const { id, titulo, ano, posterUrl, generos } = filme;
  const resumo = useMemo<FilmeResumo>(
    () => ({ id, titulo, ano, posterUrl, generos }),
    [id, titulo, ano, posterUrl, generos],
  );
  const { pronto, favoritado, salvando, alternar } = useFavorito(resumo);
  const acao = salvando ? 'Salvando…' : 'Favoritar';

  return (
    <button
      type="button"
      className="botao-favorito"
      aria-pressed={favoritado}
      aria-busy={salvando}
      aria-label={`${acao} ${titulo}`}
      disabled={!pronto}
      onClick={() => void alternar()}
    >
      <span aria-hidden="true">{favoritado ? '♥' : '♡'}</span> {acao}
    </button>
  );
}