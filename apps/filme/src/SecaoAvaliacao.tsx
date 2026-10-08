import { EstadoCarregando, EstadoErro } from '@nexo/ui';
import { useAvaliacao } from '@nexo/user-data';
import { FormularioAvaliacao } from './FormularioAvaliacao';

interface SecaoAvaliacaoProps {
  filmeId: number;
}

export function SecaoAvaliacao({ filmeId }: SecaoAvaliacaoProps) {
  const { status, avaliacao, salvar, recarregar } = useAvaliacao(filmeId);

  if (status === 'inicial' || status === 'carregando') {
    return <EstadoCarregando texto="Carregando sua avaliação…" />;
  }

  if (status === 'erro') {
    return (
      <EstadoErro
        mensagem="Não foi possível carregar sua avaliação."
        aoTentarNovamente={() => void recarregar()}
      />
    );
  }

  return <FormularioAvaliacao avaliacao={avaliacao} aoSalvar={salvar} />;
}