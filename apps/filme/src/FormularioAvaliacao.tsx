import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Avaliacao } from '@nexo/shared-types';
import {
  converterNota,
  esquemaAvaliacao,
  formatarNotaParaCampo,
  LIMITE_COMENTARIO,
} from './esquema-avaliacao';
import type { DadosFormularioAvaliacao } from './esquema-avaliacao';

interface DadosParaSalvar {
  nota: number;
  comentario: string;
}

interface FormularioAvaliacaoProps {
  avaliacao: Avaliacao | undefined;
  aoSalvar: (dados: DadosParaSalvar) => Promise<unknown>;
}

type SituacaoDoEnvio = 'ocioso' | 'salvando' | 'salvo' | 'falhou';

export function FormularioAvaliacao({ avaliacao, aoSalvar }: FormularioAvaliacaoProps) {
  const [situacao, setSituacao] = useState<SituacaoDoEnvio>('ocioso');
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<DadosFormularioAvaliacao>({
    resolver: zodResolver(esquemaAvaliacao),
    defaultValues: {
      nota: avaliacao ? formatarNotaParaCampo(avaliacao.nota) : '',
      comentario: avaliacao?.comentario ?? '',
    },
  });

  const tamanhoDoComentario = watch('comentario').length;
  const salvando = situacao === 'salvando';
  const textoDoBotao = avaliacao ? 'Atualizar avaliação' : 'Salvar avaliação';

  const enviar = handleSubmit(async (dados) => {
    setSituacao('salvando');
    try {
      await aoSalvar({ nota: converterNota(dados.nota), comentario: dados.comentario });
      reset(dados);
      setSituacao('salvo');
    } catch {
      setSituacao('falhou');
    }
  });

  return (
    <form
      className="formulario-avaliacao"
      aria-labelledby="titulo-avaliacao"
      noValidate
      onSubmit={enviar}
    >
      <h2 id="titulo-avaliacao">Sua avaliação</h2>

      <div className="campo">
        <label htmlFor="campo-nota">Nota</label>
        <input
          id="campo-nota"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          aria-invalid={errors.nota ? 'true' : 'false'}
          aria-describedby={errors.nota ? 'dica-nota erro-nota' : 'dica-nota'}
          {...register('nota')}
        />
        <p id="dica-nota" className="campo__dica">
          De 0,5 a 10, em passos de 0,5.
        </p>
        {errors.nota && (
          <p id="erro-nota" className="campo__erro" role="alert">
            {errors.nota.message}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor="campo-comentario">Comentário (opcional)</label>
        <textarea
          id="campo-comentario"
          rows={5}
          aria-invalid={errors.comentario ? 'true' : 'false'}
          aria-describedby={
            errors.comentario ? 'dica-comentario erro-comentario' : 'dica-comentario'
          }
          {...register('comentario')}
        />
        <p id="dica-comentario" className="campo__dica">
          {tamanhoDoComentario} de {LIMITE_COMENTARIO} caracteres.
        </p>
        {errors.comentario && (
          <p id="erro-comentario" className="campo__erro" role="alert">
            {errors.comentario.message}
          </p>
        )}
      </div>

      {situacao === 'falhou' && (
        <p className="formulario-avaliacao__falha" role="alert">
          Não foi possível salvar sua avaliação. O que você digitou foi mantido; tente novamente.
        </p>
      )}
      {situacao === 'salvo' && !isDirty && (
        <p className="formulario-avaliacao__sucesso" role="status">
          Avaliação salva.
        </p>
      )}

      <button type="submit" disabled={salvando} aria-busy={salvando}>
        {salvando ? 'Salvando…' : textoDoBotao}
      </button>
    </form>
  );
}