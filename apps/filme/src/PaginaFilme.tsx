import { useParams } from 'react-router-dom';
import { ErroTmdb, mensagemDeErro } from '@nexo/tmdb';
import { EstadoCarregando, EstadoErro } from '@nexo/ui';
import { BotaoVoltar } from './BotaoVoltar';
import { useFilmeDetalhe } from './dados';
import { DetalheFilme } from './DetalheFilme';
import { FilmeNaoEncontrado } from './FilmeNaoEncontrado';

function interpretarId(valor: string | undefined): number | null {
  if (!valor || !/^\d+$/.test(valor)) return null;
  const id = Number(valor);
  return id > 0 ? id : null;
}

function naoEncontrado(erro: unknown): boolean {
  return erro instanceof ErroTmdb && erro.status === 404;
}

interface ConteudoDoFilmeProps {
  filmeId: number;
}

function ConteudoDoFilme({ filmeId }: ConteudoDoFilmeProps) {
  const consulta = useFilmeDetalhe(filmeId);

  if (consulta.isPending) return <EstadoCarregando texto="Carregando filme…" />;

  if (consulta.isError) {
    return naoEncontrado(consulta.error) ? (
      <FilmeNaoEncontrado />
    ) : (
      <EstadoErro
        mensagem={mensagemDeErro(consulta.error)}
        aoTentarNovamente={() => void consulta.refetch()}
      />
    );
  }

  return <DetalheFilme filme={consulta.data} />;
}

export function PaginaFilme() {
  const { id } = useParams();
  const filmeId = interpretarId(id);

  return (
    <section className="pagina-filme">
      <BotaoVoltar />
      {filmeId === null ? <FilmeNaoEncontrado /> : <ConteudoDoFilme filmeId={filmeId} />}
    </section>
  );
}