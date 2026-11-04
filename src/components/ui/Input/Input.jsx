import { cx } from '@/utils/classes';
import Field from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { useCampo } from '../Field/useCampo';
import Icon from '../Icon/Icon';
import styles from './Input.module.css';

export default function Input({
  label,
  dica,
  erro,
  icone,
  id,
  required = false,
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
      <div className={styles.caixa}>
        <input
          id={campoId}
          className={cx(fieldStyles.controle, icone && styles.comIcone)}
          required={required}
          aria-invalid={invalido}
          aria-describedby={descritoPor}
          {...props}
        />
        {icone && <Icon nome={icone} tamanho={18} className={styles.icone} />}
      </div>
    </Field>
  );
}
