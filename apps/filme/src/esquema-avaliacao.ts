import { z } from 'zod';

export const NOTA_MINIMA = 0.5;
export const NOTA_MAXIMA = 10;
export const PASSO_NOTA = 0.5;
export const LIMITE_COMENTARIO = 500;

export function converterNota(texto: string): number {
  const normalizado = texto.trim().replace(',', '.');
  return normalizado === '' ? Number.NaN : Number(normalizado);
}

export function formatarNotaParaCampo(nota: number): string {
  return String(nota).replace('.', ',');
}

function foiPreenchida(texto: string): boolean {
  return texto.trim() !== '';
}

function ehNumero(texto: string): boolean {
  return !foiPreenchida(texto) || Number.isFinite(converterNota(texto));
}

function estaNoIntervalo(texto: string): boolean {
  const nota = converterNota(texto);
  return nota >= NOTA_MINIMA && nota <= NOTA_MAXIMA;
}

function respeitaOPasso(texto: string): boolean {
  return Number.isInteger(converterNota(texto) / PASSO_NOTA);
}

export const esquemaAvaliacao = z.object({
  nota: z
    .string()
    .refine(foiPreenchida, 'Informe uma nota.')
    .refine(ehNumero, 'A nota deve ser um número.')
    .refine(estaNoIntervalo, 'A nota deve estar entre 0,5 e 10.')
    .refine(respeitaOPasso, 'A nota deve variar de 0,5 em 0,5.'),
  comentario: z
    .string()
    .trim()
    .max(LIMITE_COMENTARIO, `O comentário deve ter no máximo ${LIMITE_COMENTARIO} caracteres.`),
});

export type DadosFormularioAvaliacao = z.infer<typeof esquemaAvaliacao>;