import { Link } from 'react-router-dom';
import type { Filme } from '@nexo/shared-types';
import { BotaoFavorito, formatarAno, formatarNota, PosterFilme } from '@nexo/ui';

interface CartaoFilmeProps {
  filme: Filme;
}

export function CartaoFilme({ filme }: CartaoFilmeProps) {
  return (
    <li className="cartao-filme">
      <Link to={`/filme/${filme.id}`} className="cartao-filme__link">
        <PosterFilme url={filme.posterUrl} titulo={filme.titulo} />
        <h2 className="cartao-filme__titulo">{filme.titulo}</h2>
      </Link>
      <p className="cartao-filme__meta">
        <span>{formatarAno(filme.ano)}</span>
        <span>Nota {formatarNota(filme.notaTmdb)}</span>
      </p>
      <p className="cartao-filme__generos">{filme.generos.join(', ') || 'Sem gênero'}</p>
      <BotaoFavorito filme={filme} />
    </li>
  );
}