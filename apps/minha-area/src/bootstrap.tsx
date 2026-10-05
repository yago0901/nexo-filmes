import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Favoritos from './Favoritos';
import Painel from './Painel';
import Contador from './Contador';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <BrowserRouter>
        <header>
          <Contador />
        </header>
        <Routes>
          <Route path="/" element={<Navigate to="/favoritos" replace />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/painel" element={<Painel />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
  );
}