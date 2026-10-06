import type { NexoEventos, NomeEvento } from '@nexo/shared-types';

export function emitirEvento<N extends NomeEvento>(nome: N, detalhe: NexoEventos[N]): void {
  window.dispatchEvent(new CustomEvent(nome, { detail: detalhe }));
}

export function escutarEvento<N extends NomeEvento>(
  nome: N,
  ouvinte: (detalhe: NexoEventos[N]) => void,
): () => void {
  function tratar(evento: Event): void {
    ouvinte((evento as CustomEvent<NexoEventos[N]>).detail);
  }

  window.addEventListener(nome, tratar);
  return () => window.removeEventListener(nome, tratar);
}