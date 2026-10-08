interface EsqueletoGradeProps {
  quantidade?: number;
  texto?: string;
}

export function EsqueletoGrade({ quantidade = 12, texto = 'Carregando…' }: EsqueletoGradeProps) {
  return (
    <div role="status">
      <span className="somente-leitor">{texto}</span>
      <ul className="grade-filmes" aria-hidden="true">
        {Array.from({ length: quantidade }, (_, indice) => (
          <li key={indice} className="cartao-esqueleto">
            <div className="esqueleto esqueleto--poster" />
            <div className="esqueleto esqueleto--linha" />
            <div className="esqueleto esqueleto--linha esqueleto--curta" />
          </li>
        ))}
      </ul>
    </div>
  );
}