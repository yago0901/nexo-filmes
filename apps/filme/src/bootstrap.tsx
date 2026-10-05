import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FilmeRoutes from './Routes';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/filme/550" replace />} />
          <Route path="/filme/*" element={<FilmeRoutes />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
  );
}