import { useId } from 'react';
import styles from './CompetencyBar.module.css';

const limitarPercentual = (valor, maximo) =>
  maximo > 0 ? Math.min(100, Math.max(0, (valor / maximo) * 100)) : 0;

/**
 * Competência no modelo SFIA: sigla de 4 letras e nível atual sobre o nível máximo.
 * `nivelMinimo` é opcional e desenha a marca do mínimo esperado nas telas do gestor.
 */
export default function CompetencyBar({ nome, sigla, nivel, nivelMax, nivelMinimo }) {
  const rotuloId = useId();
  const temMinimo = nivelMinimo !== undefined && nivelMinimo !== null;
  const textoMinimo = temMinimo ? `Mínimo esperado: nível ${nivelMinimo}/${nivelMax}` : '';

  return (
    <div className={styles.competencia}>
      <div className={styles.cabecalho}>
        <span id={rotuloId} className={styles.nome}>
          {nome} <span className={styles.sigla}>({sigla})</span>
        </span>
        <span className={styles.nivel}>
          Nível {nivel}/{nivelMax}
        </span>
      </div>
      <div className={styles.barra}>
        <div
          className={styles.trilha}
          role="progressbar"
          aria-labelledby={rotuloId}
          aria-valuemin={0}
          aria-valuenow={nivel}
          aria-valuemax={nivelMax}
          aria-valuetext={`Nível ${nivel} de ${nivelMax}. ${textoMinimo}`.trim()}
        >
          <div
            className={styles.preenchimento}
            style={{ width: `${limitarPercentual(nivel, nivelMax)}%` }}
          />
        </div>
        {temMinimo && (
          <span
            className={styles.marca}
            style={{ left: `${limitarPercentual(nivelMinimo, nivelMax)}%` }}
            aria-hidden="true"
          />
        )}
      </div>
      {temMinimo && (
        <p className={styles.minimo} aria-hidden="true">
          {textoMinimo}
        </p>
      )}
    </div>
  );
}
