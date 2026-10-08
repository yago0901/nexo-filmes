import { formatarNota } from '@nexo/ui';

export function descreverNotaDoUsuario(
  nota: number | undefined,
  avaliacoesProntas: boolean,
): string | null {
  if (nota !== undefined) return `Sua nota: ${formatarNota(nota)}`;
  return avaliacoesProntas ? 'Ainda sem avaliação' : null;
}