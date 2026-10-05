import { NavLink } from 'react-router-dom';
import { Remote } from './Remote';

export function Header() {
  return (
    <header>
      <nav aria-label="Principal">
        <NavLink to="/filmes">Filmes</NavLink>{' '}
        <NavLink to="/favoritos">Favoritos</NavLink>{' '}
        <NavLink to="/painel">Painel</NavLink>
      </nav>
      <Remote
        nome="Contador"
        compacto
        carregar={() => import('minhaArea/Contador')}
      />
    </header>
  );
}