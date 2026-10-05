import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { Remote } from './components/Remote';
import { NotFound } from './components/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/filmes" replace />} />
          <Route path="/filmes/*" element={<Remote nome="Catálogo" carregar={() => import('catalogo/Routes')} />} />
          <Route path="/filme/*" element={<Remote nome="Filme" carregar={() => import('filme/Routes')} />} />
          <Route path="/favoritos" element={<Remote nome="Minha área" carregar={() => import('minhaArea/Routes')} />} />
          <Route path="/painel" element={<Remote nome="Minha área" carregar={() => import('minhaArea/Routes')} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
