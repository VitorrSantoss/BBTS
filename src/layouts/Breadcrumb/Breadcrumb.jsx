import { Link, useMatches } from 'react-router';
import styles from './Breadcrumb.module.css';

/** Trilha do fluxo do gestor, definida em `handle.trilha` em cada rota. */
export default function Breadcrumb() {
  const rotas = useMatches();
  const rota = rotas.findLast(({ handle }) => handle?.trilha);
  const itens = rota ? rota.handle.trilha(rota.params) : [];

  if (itens.length === 0) return null;

  return (
    <nav className={styles.trilha} aria-label="Trilha de navegação">
      <ol className={styles.lista}>
        {itens.map(({ rotulo, para }, indice) => {
          const atual = indice === itens.length - 1;
          return (
            <li key={para} className={styles.item}>
              {indice > 0 && (
                <span className={styles.separador} aria-hidden="true">
                  ›
                </span>
              )}
              {atual ? (
                <span aria-current="page">{rotulo}</span>
              ) : (
                <Link to={para} className={styles.link}>
                  {rotulo}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
