interface PaginacaoProps {
  pagina: number;
  totalPaginas: number;
  aoMudarPagina: (pagina: number) => void;
}

export function Paginacao({ pagina, totalPaginas, aoMudarPagina }: PaginacaoProps) {
  if (totalPaginas <= 1) return null;

  return (
    <nav className="paginacao" aria-label="Paginação">
      <button type="button" disabled={pagina <= 1} onClick={() => aoMudarPagina(pagina - 1)}>
        Anterior
      </button>
      <span aria-current="page">
        Página {pagina} de {totalPaginas}
      </span>
      <button
        type="button"
        disabled={pagina >= totalPaginas}
        onClick={() => aoMudarPagina(pagina + 1)}
      >
        Próxima
      </button>
    </nav>
  );
}