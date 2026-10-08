interface IndicadorProps {
  rotulo: string;
  valor: string;
}

export function Indicador({ rotulo, valor }: IndicadorProps) {
  return (
    <div className="indicador">
      <dt>{rotulo}</dt>
      <dd>{valor}</dd>
    </div>
  );
}