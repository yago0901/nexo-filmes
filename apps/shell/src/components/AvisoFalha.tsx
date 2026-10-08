import { useEffect, useState } from 'react';
import { escutarEvento } from '@nexo/user-data';

interface Aviso {
  id: number;
  texto: string;
}

const DURACAO_AVISO_MS = 6000;

export function AvisoFalha() {
  const [aviso, setAviso] = useState<Aviso | null>(null);

  useEffect(
    () =>
      escutarEvento('nexo:favorito-falhou', ({ titulo }) => {
        setAviso((atual) => ({
          id: (atual?.id ?? 0) + 1,
          texto: `Não foi possível salvar “${titulo}” nos favoritos. A alteração foi desfeita.`,
        }));
      }),
    [],
  );

  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(() => setAviso(null), DURACAO_AVISO_MS);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  return (
    <div className="aviso-falha" role="alert" aria-live="assertive">
      {aviso?.texto}
    </div>
  );
}