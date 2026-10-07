import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mensagemDeErro } from '@nexo/tmdb';
import { EstadoCarregando, EstadoErro, EstadoVazio } from '@nexo/ui';
import { BarraDeFiltros } from './BarraDeFiltros';
import { CartaoFilme } from './CartaoFilme';
import { useFilmes, useGeneros } from './dados';
import { comGenero, comPagina, comTermo, escreverFiltros, lerFiltros } from './estado-url';
import type { FiltrosCatalogo } from './estado-url';
import { Paginacao } from './Paginacao';

type Transformacao = (atuais: FiltrosCatalogo) => FiltrosCatalogo;

export function PaginaCatalogo() {
  const [parametros, setParametros] = useSearchParams();
  const filtros = useMemo(() => lerFiltros(parametros), [parametros]);
  const generos = useGeneros();
  const filmes = useFilmes(filtros);

  const atualizar = useCallback(
    (transformar: Transformacao, substituir = false) => {
      setParametros((atuais) => escreverFiltros(transformar(lerFiltros(atuais))), {
        replace: substituir,
      });
    },
    [setParametros],
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [filtros.pagina]);

  return (
    <section className="catalogo" aria-labelledby="titulo-catalogo">
      <h1 id="titulo-catalogo">Catálogo de filmes</h1>
      <BarraDeFiltros
        filtros={filtros}
        generos={generos.data ?? []}
        aoAlterarTermo={(termo) => atualizar((atuais) => comTermo(atuais, termo), true)}
        aoAlterarGenero={(generoId) => atualizar((atuais) => comGenero(atuais, generoId))}
      />
      {filmes.isPending && <EstadoCarregando texto="Carregando filmes…" />}
      {filmes.isError && (
        <EstadoErro
          mensagem={mensagemDeErro(filmes.error)}
          aoTentarNovamente={() => void filmes.refetch()}
        />
      )}
      {filmes.isSuccess && filmes.data.itens.length === 0 && (
        <EstadoVazio
          titulo="Nenhum filme encontrado"
          descricao={
            filtros.termo
              ? `Não encontramos resultados para “${filtros.termo}”.`
              : 'Tente outro gênero.'
          }
        />
      )}
      {filmes.isSuccess && filmes.data.itens.length > 0 && (
        <>
          <ul className="grade-filmes" aria-busy={filmes.isPlaceholderData}>
            {filmes.data.itens.map((filme) => (
              <CartaoFilme key={filme.id} filme={filme} />
            ))}
          </ul>
          <Paginacao
            pagina={filtros.pagina}
            totalPaginas={filmes.data.totalPaginas}
            aoMudarPagina={(pagina) => atualizar((atuais) => comPagina(atuais, pagina))}
          />
        </>
      )}
    </section>
  );
}