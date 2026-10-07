import { QueryClient } from '@tanstack/react-query';

const UM_MINUTO_MS = 60_000;

export function criarClienteDeConsultas(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: UM_MINUTO_MS,
      },
    },
  });
}