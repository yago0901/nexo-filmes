import { useMemo } from 'react';
import { EstadoCarregando, EstadoErro, formatarNota } from '@nexo/ui';
import { useAvaliacoes, useFavoritos } from '@nexo/user-data';
import { calcularEstatisticas } from './estatisticas-painel';
import { Indicador } from './Indicador';
import './minha-area.css';

const SEM_VALOR = '—';

export default function Painel() {
  const favoritos = useFavoritos();
  const avaliacoes = useAvaliacoes();
  const estatisticas = useMemo(
    () => calcularEstatisticas(favoritos.favoritos, avaliacoes.avaliacoes),
    [favoritos.favoritos, avaliacoes.avaliacoes],
  );
  const comErro = favoritos.status === 'erro' || avaliacoes.status === 'erro';
  const pronto = favoritos.status === 'pronto' && avaliacoes.status === 'pronto';

  function recarregar() {
    void Promise.all([favoritos.recarregar(), avaliacoes.recarregar()]);
  }

  return (
    <section className="painel" aria-labelledby="titulo-painel">
      <h1 id="titulo-painel">Painel</h1>
      {comErro && (
        <EstadoErro
          mensagem="Não foi possível carregar os dados do painel."
          aoTentarNovamente={recarregar}
        />
      )}
      {!comErro && !pronto && <EstadoCarregando texto="Carregando painel…" />}
      {!comErro && pronto && (
        <dl className="painel__indicadores">
          <Indicador rotulo="Favoritos" valor={String(estatisticas.totalFavoritos)} />
          <Indicador rotulo="Filmes avaliados" valor={String(estatisticas.totalAvaliados)} />
          <Indicador
            rotulo="Nota média"
            valor={
              estatisticas.notaMedia === null ? SEM_VALOR : formatarNota(estatisticas.notaMedia)
            }
          />
          <Indicador
            rotulo="Gênero mais frequente"
            valor={estatisticas.generoMaisFrequente ?? SEM_VALOR}
          />
        </dl>
      )}
    </section>
  );
}