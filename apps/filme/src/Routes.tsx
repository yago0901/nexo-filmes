import { QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import { criarClienteDeConsultas } from './cliente-de-consultas';
import { FilmeNaoEncontrado } from './FilmeNaoEncontrado';
import { PaginaFilme } from './PaginaFilme';
import './filme.css';

const clienteDeConsultas = criarClienteDeConsultas();

export default function FilmeRoutes() {
  return (
    <QueryClientProvider client={clienteDeConsultas}>
      <Routes>
        <Route path=":id" element={<PaginaFilme />} />
        <Route path="*" element={<FilmeNaoEncontrado />} />
      </Routes>
    </QueryClientProvider>
  );
}