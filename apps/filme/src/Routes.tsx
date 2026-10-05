import { Routes, Route, useParams, useLocation, Link } from 'react-router-dom';

function Detalhe() {
  const { id } = useParams();
  return (
    <section>
      <h1>Detalhe do filme {id}</h1>
      <Link to="/filmes">Voltar ao catálogo</Link>
    </section>
  );
}

function NaoCasou() {
  const { pathname } = useLocation();
  return <p>Nenhuma rota do remote filme casou com: {pathname}</p>;
}

export default function FilmeRoutes() {
  return (
    <Routes>
      <Route path=":id" element={<Detalhe />} />
      <Route path="*" element={<NaoCasou />} />
    </Routes>
  );
}