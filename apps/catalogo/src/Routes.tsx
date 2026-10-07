import { QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import { criarClienteDeConsultas } from './cliente-de-consultas';
import { PaginaCatalogo } from './PaginaCatalogo';
import './catalogo.css';

const clienteDeConsultas = criarClienteDeConsultas();

export default function CatalogoRoutes() {
  return (
    <QueryClientProvider client={clienteDeConsultas}>
      <Routes>
        <Route index element={<PaginaCatalogo />} />
      </Routes>
    </QueryClientProvider>
  );
}