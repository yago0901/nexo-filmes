import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CatalogoRoutes from './Routes';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/filmes" replace />} />
          <Route path="/filmes/*" element={<CatalogoRoutes />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
  );
}