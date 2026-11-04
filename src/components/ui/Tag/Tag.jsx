import { cx } from '@/utils/classes';
import styles from './Tag.module.css';

/**
 * - padrao: fundo amarelo translúcido e borda amarela (equipe e áreas de atuação).
 * - chip: amarelo sólido com texto azul, em formato pill (nomes em cards).
 */
export default function Tag({ variante = 'padrao', className, children }) {
  return <span className={cx(styles.tag, styles[variante], className)}>{children}</span>;
}
