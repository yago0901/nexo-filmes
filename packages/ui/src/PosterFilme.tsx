import './poster.css';

interface PosterFilmeProps {
  url: string | null;
  titulo: string;
}

export function PosterFilme({ url, titulo }: PosterFilmeProps) {
  if (!url) {
    return (
      <div className="poster poster--ausente" role="img" aria-label={`Sem pôster para ${titulo}`}>
        Sem pôster
      </div>
    );
  }

  return (
    <img
      className="poster"
      src={url}
      alt={`Pôster de ${titulo}`}
      width={200}
      height={300}
      loading="lazy"
    />
  );
}