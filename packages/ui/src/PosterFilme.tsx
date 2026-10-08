import { formatarNota } from './formatadores';

interface PosterFilmeProps {
  url: string | null;
  titulo: string;
  nota?: number;
}

export function PosterFilme({ url, titulo, nota }: PosterFilmeProps) {
  const notaVisivel = nota !== undefined && nota > 0 ? nota : null;
  const classeDaMoldura =
    notaVisivel === null ? 'poster-moldura' : 'poster-moldura poster-moldura--com-nota';

  return (
    <div className={classeDaMoldura}>
      {url ? (
        <img
          className="poster"
          src={url}
          alt={`Pôster de ${titulo}`}
          width={200}
          height={300}
          loading="lazy"
        />
      ) : (
        <div className="poster poster--ausente" role="img" aria-label={`Sem pôster para ${titulo}`}>
          Sem pôster
        </div>
      )}
      {notaVisivel !== null && (
        <span className="selo-nota">
          <span className="somente-leitor">Nota TMDB </span>
          {formatarNota(notaVisivel)}
        </span>
      )}
    </div>
  );
}