import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { Remote } from './components/Remote';
import { NotFound } from './components/NotFound';
import { carregarRemote } from './remotes';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/filmes/*" element={<Remote nome="Catálogo" carregar={carregarRemote('catalogo/Routes')} />} />
          <Route path="/filme/*" element={<Remote nome="Filme" carregar={carregarRemote('filme/Routes')} />} />
          <Route path="/favoritos" element={<Remote nome="Favoritos" carregar={carregarRemote('minhaArea/Favoritos')} />} />
          <Route path="/painel" element={<Remote nome="Painel" carregar={carregarRemote('minhaArea/Painel')} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
