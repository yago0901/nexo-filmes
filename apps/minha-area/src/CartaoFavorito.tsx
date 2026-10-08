import { Link } from 'react-router-dom';
import type { Favorito } from '@nexo/shared-types';
import { formatarAno, PosterFilme } from '@nexo/ui';
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
    <li className="cartao-favorito">
      <Link to={`/filme/${filme.id}`} className="cartao-favorito__link">
        <PosterFilme url={filme.posterUrl} titulo={filme.titulo} />
        <h2 className="cartao-favorito__titulo">{filme.titulo}</h2>
      </Link>
      <p className="cartao-favorito__meta">{formatarAno(filme.ano)}</p>
      {textoDaNota && <p className="cartao-favorito__nota">{textoDaNota}</p>}
      <BotaoRemoverFavorito filme={filme} />
    </li>
  );
}