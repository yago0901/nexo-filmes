import { useEffect, useState } from 'react';
import type { Genero } from '@nexo/shared-types';
import type { FiltrosCatalogo } from './estado-url';
import { useValorComDebounce } from './useValorComDebounce';

const ATRASO_BUSCA_MS = 400;

interface BarraDeFiltrosProps {
  filtros: FiltrosCatalogo;
  generos: Genero[];
  aoAlterarTermo: (termo: string) => void;
  aoAlterarGenero: (generoId: number | null) => void;
}

export function BarraDeFiltros({
  filtros,
  generos,
  aoAlterarTermo,
  aoAlterarGenero,
}: BarraDeFiltrosProps) {
  const [texto, setTexto] = useState(filtros.termo);
  const textoComAtraso = useValorComDebounce(texto, ATRASO_BUSCA_MS);
  const buscando = filtros.termo !== '';

  useEffect(() => {
    if (textoComAtraso.trim() !== filtros.termo) aoAlterarTermo(textoComAtraso);
  }, [textoComAtraso]);

  useEffect(() => {
    setTexto((atual) => (atual.trim() === filtros.termo ? atual : filtros.termo));
  }, [filtros.termo]);

  return (
    <form role="search" className="filtros" onSubmit={(evento) => evento.preventDefault()}>
      <div className="filtros__campo">
        <label htmlFor="busca-titulo">Buscar por título</label>
        <input
          id="busca-titulo"
          type="search"
          value={texto}
          autoComplete="off"
          onChange={(evento) => setTexto(evento.target.value)}
        />
      </div>
      <div className="filtros__campo">
        <label htmlFor="filtro-genero">Gênero</label>
        <select
          id="filtro-genero"
          value={filtros.generoId ?? ''}
          disabled={buscando || generos.length === 0}
          aria-describedby={buscando ? 'aviso-genero' : undefined}
          onChange={(evento) =>
            aoAlterarGenero(evento.target.value ? Number(evento.target.value) : null)
          }
        >
          <option value="">Todos os gêneros</option>
          {generos.map((genero) => (
            <option key={genero.id} value={genero.id}>
              {genero.nome}
            </option>
          ))}
        </select>
      </div>
      {buscando && (
        <p id="aviso-genero" className="filtros__aviso">
          A busca por título não combina com o filtro de gênero. Limpe a busca para filtrar por
          gênero.
        </p>
      )}
    </form>
  );
}