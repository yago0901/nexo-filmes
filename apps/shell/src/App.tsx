import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AvisoFalha } from './components/AvisoFalha';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { NotFound } from './components/NotFound';
import { Remote } from './components/Remote';
import { carregarRemote } from './remotes';

const App = () => {
  return (
    <BrowserRouter>
      <a className="link-pular" href="#conteudo">
        Ir para o conteúdo
      </a>
      <div className="aplicacao">
        <AvisoFalha />
        <Header />
        <main id="conteudo" className="conteudo-principal" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Navigate to="/filmes" replace />} />
            <Route
              path="/filmes/*"
              element={<Remote nome="Catálogo" carregar={carregarRemote('catalogo/Routes')} />}
            />
            <Route
              path="/filme/*"
              element={<Remote nome="Filme" carregar={carregarRemote('filme/Routes')} />}
            />
            <Route
              path="/favoritos"
              element={<Remote nome="Favoritos" carregar={carregarRemote('minhaArea/Favoritos')} />}
            />
            <Route
              path="/painel"
              element={<Remote nome="Painel" carregar={carregarRemote('minhaArea/Painel')} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;