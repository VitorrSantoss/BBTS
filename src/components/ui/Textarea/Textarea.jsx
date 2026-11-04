import { cx } from '@/utils/classes';
import Field from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { useCampo } from '../Field/useCampo';
import styles from './Textarea.module.css';

export default function Textarea({
  label,
  dica,
  erro,
  id,
  required = false,
  rows = 6,
  className,
  ...props
}) {
  const { campoId, idDica, idErro, descritoPor, invalido } = useCampo({ id, erro, dica });

  return (
    <Field
      campoId={campoId}
      label={label}
      dica={dica}
      idDica={idDica}
      erro={erro}
      idErro={idErro}
      obrigatorio={required}
      className={className}
    >
      <textarea
        id={campoId}
        className={cx(fieldStyles.controle, styles.textarea)}
        rows={rows}
        required={required}
        aria-invalid={invalido}
        aria-describedby={descritoPor}
        {...props}
      />
    </Field>
  );
}
