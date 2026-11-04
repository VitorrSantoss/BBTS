import { EmptyState } from '@/components/ui';
import CompetencyBar from '../CompetencyBar/CompetencyBar';
import styles from './CompetencyList.module.css';

/** Lista de competências. `minimos` é um mapa opcional de sigla para nível mínimo esperado. */
export default function CompetencyList({ competencias, minimos = {} }) {
  if (competencias.length === 0) {
    return <EmptyState titulo="Nenhuma competência registrada" />;
  }

  return (
    <ul className={styles.lista}>
      {competencias.map((competencia) => (
        <li key={competencia.sigla}>
          <CompetencyBar {...competencia} nivelMinimo={minimos[competencia.sigla]} />
        </li>
      ))}
    </ul>
  );
}
