import Icon from '../Icon/Icon';
import styles from './EmptyState.module.css';

export default function EmptyState({ titulo, descricao, icone = 'info', children }) {
  return (
    <div className={styles.vazio}>
      <Icon nome={icone} tamanho={32} className={styles.icone} />
      <p className={styles.titulo}>{titulo}</p>
      {descricao && <p className={styles.descricao}>{descricao}</p>}
      {children}
    </div>
  );
}
