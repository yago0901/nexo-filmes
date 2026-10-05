import { Routes, Route } from 'react-router-dom';

export default function CatalogoRoutes() {
  return (
    <Routes>
      <Route index element={<h1>Filme (remote)</h1>} />
      <Route path=":id" element={<h1>Detalhe</h1>} />
    </Routes>
  );
}