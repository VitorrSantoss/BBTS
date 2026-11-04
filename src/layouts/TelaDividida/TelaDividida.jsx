import logoBbts from '@/assets/images/LogoBBTS.png';
import styles from './TelaDividida.module.css';

/** Entrada do sistema: painel azul com a marca de um lado e o conteúdo do outro. */
export default function TelaDividida({ children }) {
  return (
    <div className={styles.tela}>
      <div className={styles.marca} data-surface="primary">
        <img
          src={logoBbts}
          alt="BB Tecnologia e Serviços"
          width="967"
          height="84"
          className={styles.logo}
        />
        <div className={styles.chamada}>
          <p className={styles.frase}>Gestão de competências</p>
          <p className={styles.apoio}>Níveis, lacunas e evolução das equipes em um só lugar.</p>
        </div>
      </div>
      <div className={styles.conteudo}>{children}</div>
    </div>
  );
}
