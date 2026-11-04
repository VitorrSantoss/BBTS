import { cx } from '@/utils/classes';
import styles from './Skeleton.module.css';

/** Bloco de espera. Formas: linha, bloco ou circulo. */
export default function Skeleton({
  largura = '100%',
  altura = '1rem',
  forma = 'linha',
  className,
}) {
  return (
    <span
      className={cx(styles.skeleton, styles[forma], className)}
      style={{ width: largura, height: altura }}
      aria-hidden="true"
    />
  );
}
