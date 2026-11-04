import { useId } from 'react';
import { cx } from '@/utils/classes';

/** Liga um controle de formulário à sua dica e à sua mensagem de erro. */
export function useCampo({ id, erro, dica }) {
  const idGerado = useId();
  const campoId = id ?? idGerado;
  const idDica = dica ? `${campoId}-dica` : undefined;
  const idErro = erro ? `${campoId}-erro` : undefined;

  return {
    campoId,
    idDica,
    idErro,
    descritoPor: cx(idDica, idErro) || undefined,
    invalido: erro ? true : undefined,
  };
}
