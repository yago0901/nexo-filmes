import { Component, lazy, Suspense, useMemo, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { EstadoCarregando, EstadoErro } from '@nexo/ui';

interface BoundaryProps {
  nome: string;
  compacto?: boolean;
  onRetry: () => void;
  children: ReactNode;
}

interface BoundaryState {
  erro: Error | null;
}

class Boundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { erro: null };

  static getDerivedStateFromError(erro: Error): BoundaryState {
    return { erro };
  }

  render() {
    if (!this.state.erro) return this.props.children;

    const { nome, compacto, onRetry } = this.props;

    if (compacto) {
      return (
        <div role="alert" className="remote-compacto">
          <span>{nome} indisponível.</span>
          <button type="button" onClick={onRetry}>
            Tentar novamente
          </button>
        </div>
      );
    }

    return (
      <EstadoErro
        mensagem={`Não foi possível carregar a área “${nome}”.`}
        aoTentarNovamente={onRetry}
      />
    );
  }
}

interface RemoteProps {
  nome: string;
  compacto?: boolean;
  carregar: () => Promise<{ default: ComponentType }>;
}

export function Remote({ nome, compacto, carregar }: RemoteProps) {
  const [tentativa, setTentativa] = useState(0);
  const Comp = useMemo(() => lazy(carregar), [nome, tentativa]);
  const fallback = compacto ? (
    <span className="somente-leitor">Carregando {nome}…</span>
  ) : (
    <EstadoCarregando texto={`Carregando ${nome}…`} />
  );

  return (
    <Boundary
      key={`${nome}-${tentativa}`}
      nome={nome}
      compacto={compacto}
      onRetry={() => setTentativa((t) => t + 1)}
    >
      <Suspense fallback={fallback}>
        <Comp />
      </Suspense>
    </Boundary>
  );
}