import { useId } from 'react';
import { cx } from '@/utils/classes';
import styles from './Checkbox.module.css';

export default function Checkbox({ label, id, className, ...props }) {
  const idGerado = useId();
  const campoId = id ?? idGerado;

  return (
    <div className={cx(styles.linha, className)}>
      <input id={campoId} type="checkbox" className={styles.caixa} {...props} />
      <label htmlFor={campoId} className={styles.rotulo}>
        {label}
      </label>
    </div>
  );
}
