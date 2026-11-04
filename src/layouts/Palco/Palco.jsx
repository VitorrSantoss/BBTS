import styles from './Palco.module.css';

/** Faixa azul que continua o cabeçalho. O conteúdo da tela flutua sobre ela. */
export default function Palco({ children }) {
  return (
    <div className={styles.palco}>
      <div className={styles.faixa} aria-hidden="true" />
      {children}
    </div>
  );
}
