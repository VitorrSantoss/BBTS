import { cx } from '@/utils/classes';
import Field from '../Field/Field';
import fieldStyles from '../Field/Field.module.css';
import { useCampo } from '../Field/useCampo';
import Icon from '../Icon/Icon';
import styles from './Select.module.css';

export default function Select({
  label,
  dica,
  erro,
  opcoes,
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
        <select
          id={campoId}
          className={cx(fieldStyles.controle, styles.select)}
          required={required}
          aria-invalid={invalido}
          aria-describedby={descritoPor}
          {...props}
        >
          {opcoes.map(({ valor, rotulo }) => (
            <option key={valor} value={valor}>
              {rotulo}
            </option>
          ))}
        </select>
        <Icon nome="chevron" className={styles.icone} />
      </div>
    </Field>
  );
}
