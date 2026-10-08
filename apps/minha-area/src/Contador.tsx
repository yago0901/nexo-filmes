import { Link } from 'react-router-dom';
import { useFavoritos } from '@nexo/user-data';
import './minha-area.css';

export default function Contador() {
  const { status, total } = useFavoritos();

  return (
    <Link to="/favoritos" className="contador-favoritos">
      <span aria-hidden="true">♥</span>
      <span>
        Favoritos: <span aria-live="polite">{status === 'pronto' ? total : '–'}</span>
      </span>
    </Link>
  );
}