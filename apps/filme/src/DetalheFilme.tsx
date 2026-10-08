import type { FilmeDetalhe } from '@nexo/shared-types';
import { BotaoFavorito, formatarAno, formatarDuracao, formatarNota, PosterFilme } from '@nexo/ui';
import { SecaoAvaliacao } from './SecaoAvaliacao';

interface DetalheFilmeProps {
  filme: FilmeDetalhe;
}

export function DetalheFilme({ filme }: DetalheFilmeProps) {
  return (
    <article className="detalhe-filme" aria-labelledby="titulo-filme">
      <div className="detalhe-filme__poster">
        <PosterFilme url={filme.posterGrandeUrl} titulo={filme.titulo} nota={filme.notaTmdb} />
      </div>

      <div className="detalhe-filme__conteudo">
        <h1 id="titulo-filme">{filme.titulo}</h1>

        <p className="detalhe-filme__meta">
          <span>{formatarAno(filme.ano)}</span>
          <span>{formatarDuracao(filme.duracaoMin)}</span>
          <span>Nota TMDB: {formatarNota(filme.notaTmdb)}</span>
        </p>

        <ul className="detalhe-filme__generos">
          {filme.generos.length > 0 ? (
            filme.generos.map((g) => (
              <li key={g} className="etiqueta">
                {g}
              </li>
            ))
          ) : (
            <li className="etiqueta">Sem gênero informado</li>
          )}
        </ul>

        <BotaoFavorito filme={filme} />

        <h2>Sinopse</h2>
        <p className="detalhe-filme__sinopse">{filme.sinopse || 'Sinopse não disponível.'}</p>

        <h2>Direção</h2>
        <p>{filme.direcao.join(', ') || 'Não informada'}</p>

        <h2>Elenco</h2>
        {filme.elenco.length === 0 ? (
          <p>Elenco não informado.</p>
        ) : (
          <ul className="detalhe-filme__elenco">
            {filme.elenco.map((membro) => (
              <li key={`${membro.nome}-${membro.personagem}`}>
                <strong>{membro.nome}</strong> — {membro.personagem}
              </li>
            ))}
          </ul>
        )}

        <SecaoAvaliacao key={filme.id} filmeId={filme.id} />
      </div>
    </article>
  );
}