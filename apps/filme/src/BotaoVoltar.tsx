import { useLocation, useNavigate } from 'react-router-dom';

export function BotaoVoltar() {
  const navegar = useNavigate();
  const { key } = useLocation();
  const temHistorico = key !== 'default';

  return (
    <button
      type="button"
      className="botao-voltar"
      onClick={() => (temHistorico ? navegar(-1) : navegar('/filmes'))}
    >
      ← Voltar
    </button>
  );
}