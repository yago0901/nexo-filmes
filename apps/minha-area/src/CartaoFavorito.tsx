import { Link } from 'react-router-dom';
import type { Favorito } from '@nexo/shared-types';
import { formatarAno, formatarNota, PosterFilme } from '@nexo/ui';
import { BotaoRemoverFavorito } from './BotaoRemoverFavorito';
import { descreverNotaDoUsuario } from './nota-do-usuario';

interface CartaoFavoritoProps {
  favorito: Favorito;
  notaDoUsuario: number | undefined;
  avaliacoesProntas: boolean;
}

export function CartaoFavorito({
  favorito,
  notaDoUsuario,
  avaliacoesProntas,
}: CartaoFavoritoProps) {
  const { filme } = favorito;
  const textoDaNota = descreverNotaDoUsuario(notaDoUsuario, avaliacoesProntas);

  return (
    <li className="cartao-filme">
      <Link to={`/filme/${filme.id}`} className="cartao-filme__link">
        <PosterFilme url={filme.posterUrl} titulo={filme.titulo} />
        <h2 className="cartao-filme__titulo">{filme.titulo}</h2>
        <p className="cartao-filme__meta">{formatarAno(filme.ano)}</p>
      </Link>
      {textoDaNota && <p className="cartao-filme__nota-usuario">{textoDaNota}</p>}
      <BotaoRemoverFavorito filme={filme} />
    </li>
  );
}