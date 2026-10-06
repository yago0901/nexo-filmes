import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { clienteTmdb, mensagemDeErro } from '@nexo/tmdb';

function Lista() {
  const [titulos, setTitulos] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    clienteTmdb
      .listarFilmes({ pagina: 1 })
      .then((pagina) => setTitulos(pagina.itens.map((filme) => `${filme.titulo} (${filme.ano})`)))
      .catch((falha: unknown) => setErro(mensagemDeErro(falha)));
  }, []);

  return (
    <section>
      <h1>Catálogo (remote)</h1>
      {erro && <p role="alert">{erro}</p>}
      <ul>
        {titulos.map((titulo) => (
          <li key={titulo}>{titulo}</li>
        ))}
      </ul>
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