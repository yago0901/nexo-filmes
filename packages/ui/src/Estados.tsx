interface EstadoCarregandoProps {
  texto?: string;
}

export function EstadoCarregando({ texto = 'Carregando…' }: EstadoCarregandoProps) {
  return (
    <p role="status" className="estado estado--carregando">
      {texto}
    </p>
  );
}

interface EstadoVazioProps {
  titulo: string;
  descricao?: string;
}

export function EstadoVazio({ titulo, descricao }: EstadoVazioProps) {
  return (
    <div className="estado estado--vazio">
      <h2>{titulo}</h2>
      {descricao && <p>{descricao}</p>}
    </div>
  );
}

interface EstadoErroProps {
  mensagem: string;
  aoTentarNovamente: () => void;
}

export function EstadoErro({ mensagem, aoTentarNovamente }: EstadoErroProps) {
  return (
    <div role="alert" className="estado estado--erro">
      <p>{mensagem}</p>
      <button type="button" onClick={aoTentarNovamente}>
        Tentar novamente
      </button>
    </div>
  );
}