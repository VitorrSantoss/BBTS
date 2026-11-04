import styles from './PageHeader.module.css';

/** Título da tela sobre a faixa azul, com apoio opcional em `descricao`. */
export default function PageHeader({ titulo, descricao }) {
  return (
    <div className={styles.cabecalho} data-surface="primary">
      <h1 className={styles.titulo}>{titulo}</h1>
      {descricao && <p className={styles.descricao}>{descricao}</p>}
    </div>
  );
}
