import { Routes, Route } from 'react-router-dom';

export default function CatalogoRoutes() {
  return (
    <Routes>
      <Route index element={<h1>Catálogo (remote)</h1>} />
    </Routes>
  );
}