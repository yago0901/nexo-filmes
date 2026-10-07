export function formatarNota(nota: number): string {
  return nota > 0 ? nota.toFixed(1).replace('.', ',') : 'Sem nota';
}

export function formatarAno(ano: number | null): string {
  return ano === null ? 'Ano não informado' : String(ano);
}

export function formatarDuracao(minutos: number | null): string {
  if (minutos === null) return 'Duração não informada';
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (horas === 0) return `${resto} min`;
  return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`;
}