import type { FilmeDetalhe } from '@nexo/shared-types';
import { BotaoFavorito, formatarAno, formatarDuracao, formatarNota, PosterFilme } from '@nexo/ui';

interface DetalheFilmeProps {
  filme: FilmeDetalhe;
}

export function DetalheFilme({ filme }: DetalheFilmeProps) {
  return (
    <article className="detalhe-filme" aria-labelledby="titulo-filme">
      <PosterFilme url={filme.posterGrandeUrl} titulo={filme.titulo} />
      <div className="detalhe-filme__conteudo">
        <h1 id="titulo-filme">{filme.titulo}</h1>
        <p className="detalhe-filme__meta">
          <span>{formatarAno(filme.ano)}</span>
          <span>{formatarDuracao(filme.duracaoMin)}</span>
          <span>Nota TMDB: {formatarNota(filme.notaTmdb)}</span>
        </p>
        <p>{filme.generos.join(', ') || 'Sem gênero informado'}</p>
        <BotaoFavorito filme={filme} />
        <h2>Sinopse</h2>
        <p>{filme.sinopse || 'Sinopse não disponível.'}</p>
        <h2>Direção</h2>
        <p>{filme.direcao.join(', ') || 'Não informada'}</p>
        <h2>Elenco</h2>
        {filme.elenco.length === 0 ? (
          <p>Elenco não informado.</p>
        ) : (
          <ul className="detalhe-filme__elenco">
            {filme.elenco.map((membro) => (
              <li key={`${membro.nome}-${membro.personagem}`}>
                {membro.nome} — {membro.personagem}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}