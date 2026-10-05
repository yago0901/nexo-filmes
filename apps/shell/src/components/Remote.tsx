import { Component, lazy, Suspense, useMemo, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';

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
        if (this.state.erro) {
            const { nome, compacto, onRetry } = this.props;
            return (
                <div role="alert">
                    <p>
                        {compacto
                            ? `${nome} indisponível.`
                            : `Não foi possível carregar a área “${nome}”.`}
                    </p>
                    <button type="button" onClick={onRetry}>
                        Tentar novamente
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

interface RemoteProps {
    nome: string;
    compacto?: boolean;
    carregar: () => Promise<{ default: ComponentType }>;
}

export function Remote({ nome, compacto, carregar }: RemoteProps) {
    const [tentativa, setTentativa] = useState(0);
    const Comp = useMemo(() => lazy(carregar), [tentativa]);

    return (
        <Boundary
            key={tentativa}
            nome={nome}
            compacto={compacto}
            onRetry={() => setTentativa((t) => t + 1)}
        >
            <Suspense fallback={<p>Carregando {nome}…</p>}>
                <Comp />
            </Suspense>
        </Boundary>
    );
}