export function Footer() {
  return (
    <footer className="rodape">
      <div className="rodape__interno">
        <p className="rodape__marca">
          Nexo <span>Filmes</span>
        </p>
        <p>
          Este produto usa a API da TMDB, mas não é endossado nem certificado pela TMDB. Dados e
          imagens de{' '}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
            themoviedb.org
            <span className="somente-leitor"> (abre em nova aba)</span>
          </a>
          .
        </p>
        <p>Portal de filmes desenvolvido como teste técnico.</p>
      </div>
    </footer>
  );
}