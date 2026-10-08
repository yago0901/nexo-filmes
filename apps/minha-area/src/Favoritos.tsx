import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EstadoCarregando, EstadoErro, EstadoVazio } from '@nexo/ui';
import { useAvaliacoes, useFavoritos } from '@nexo/user-data';
import { CartaoFavorito } from './CartaoFavorito';
import './minha-area.css';

export default function Favoritos() {
  const { status, favoritos, recarregar } = useFavoritos();
  const { status: statusAvaliacoes, avaliacoes } = useAvaliacoes();
  const notasPorFilme = useMemo(
    () =>
      new Map(avaliacoes.map((avaliacao): [number, number] => [avaliacao.filmeId, avaliacao.nota])),
    [avaliacoes],
  );

  return (
    <section className="favoritos" aria-labelledby="titulo-favoritos">
      <h1 id="titulo-favoritos">Meus favoritos</h1>

      {(status === 'inicial' || status === 'carregando') && (
        <EstadoCarregando texto="Carregando favoritos…" />
      )}

      {status === 'erro' && (
        <EstadoErro
          mensagem="Não foi possível carregar seus favoritos."
          aoTentarNovamente={() => void recarregar()}
        />
      )}

      {status === 'pronto' && favoritos.length === 0 && (
        <div className="favoritos__vazio">
          <EstadoVazio
            titulo="Você ainda não favoritou nenhum filme"
            descricao="Favorite filmes no catálogo para vê-los aqui."
          />
          <Link to="/filmes" className="favoritos__link-catalogo">
            Explorar o catálogo
          </Link>
        </div>
      )}

      {status === 'pronto' && favoritos.length > 0 && (
        <ul className="grade-filmes">
          {favoritos.map((favorito) => (
            <CartaoFavorito
              key={favorito.filme.id}
              favorito={favorito}
              notaDoUsuario={notasPorFilme.get(favorito.filme.id)}
              avaliacoesProntas={statusAvaliacoes === 'pronto'}
            />
          ))}
        </ul>
      )}
    </section>
  );
}