import { cx } from '@/utils/classes';
import Icon from '../Icon/Icon';
import styles from './Field.module.css';

/** Moldura comum dos campos: label visível, controle, dica e erro inline. */
export default function Field({
  campoId,
  label,
  dica,
  idDica,
  erro,
  idErro,
  obrigatorio = false,
  className,
  children,
}) {
  return (
    <div className={cx(styles.campo, className)}>
      <label htmlFor={campoId} className={styles.rotulo}>
        {label}
        {obrigatorio && (
          <span className={styles.obrigatorio} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {dica && (
        <p id={idDica} className={styles.dica}>
          {dica}
        </p>
      )}
      {erro && (
        <p id={idErro} className={styles.erro}>
          <Icon nome="alerta" tamanho={16} className={styles.iconeErro} />
          <span>{erro}</span>
        </p>
      )}
    </div>
  );
}
