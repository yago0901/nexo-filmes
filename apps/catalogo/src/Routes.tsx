import { Routes, Route, Link } from 'react-router-dom';

function Lista() {
  return (
    <section>
      <h1>Catálogo (remote)</h1>
      <Link to="/filme/550">Abrir filme 550</Link>
    </section>
  );
}

export default function CatalogoRoutes() {
  return (
    <Routes>
      <Route index element={<Lista />} />
    </Routes>
  );
}