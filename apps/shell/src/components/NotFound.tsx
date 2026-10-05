import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section>
      <h1>Página não encontrada</h1>
      <p>O endereço que você tentou abrir não existe.</p>
      <Link to="/filmes">Voltar para o catálogo</Link>
    </section>
  );
}