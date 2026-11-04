import { useId } from 'react';
import { CompetencyList, DonutChart } from '@/components/competencias';
import { calcularNivelTotal } from '@/utils/competencias';
import styles from './PainelCompetencias.module.css';

/** Barras de competência ao lado do nível total, nas telas de perfil e do gestor. */
export default function PainelCompetencias({ competencias, minimos }) {
  const tituloId = useId();

  return (
    <section className={styles.painel} aria-labelledby={tituloId}>
      <div className={styles.lista}>
        <h2 id={tituloId} className={styles.titulo}>
          Níveis de Competências
        </h2>
        <CompetencyList competencias={competencias} minimos={minimos} />
      </div>
      <div className={styles.total}>
        <h2 className={styles.titulo}>Nível Total</h2>
        <DonutChart valor={calcularNivelTotal(competencias)} tamanho={160} />
      </div>
    </section>
  );
}
