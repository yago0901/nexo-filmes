import { Link, NavLink } from 'react-router-dom';
import { carregarRemote } from '../remotes';
import { Remote } from './Remote';

const LINKS = [
  { destino: '/filmes', texto: 'Filmes' },
  { destino: '/favoritos', texto: 'Favoritos' },
  { destino: '/painel', texto: 'Painel' },
];

export function Header() {
  return (
    <header className="cabecalho">
      <div className="cabecalho__interno">
        <Link to="/filmes" className="cabecalho__marca">
          Nexo <span>Filmes</span>
        </Link>
        <nav className="cabecalho__navegacao" aria-label="Principal">
          {LINKS.map(({ destino, texto }) => (
            <NavLink key={destino} to={destino} className="cabecalho__link">
              {texto}
            </NavLink>
          ))}
        </nav>
        <div className="cabecalho__contador">
          <Remote nome="Contador" compacto carregar={carregarRemote('minhaArea/Contador')} />
        </div>
      </div>
    </header>
  );
}