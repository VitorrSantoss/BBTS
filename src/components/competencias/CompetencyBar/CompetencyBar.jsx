import { useId } from 'react';
import { cx } from '@/utils/classes';
import styles from './CompetencyBar.module.css';

/**
 * Competência no modelo SFIA: sigla de 4 letras e nível atual sobre o nível máximo.
 * A barra tem um segmento por nível, o que mostra a escala de cada competência.
 * `nivelMinimo` é opcional e desenha a marca do mínimo esperado nas telas do gestor.
 */
export default function CompetencyBar({ nome, sigla, nivel, nivelMax, nivelMinimo }) {
  const rotuloId = useId();
  const temMinimo = nivelMinimo !== undefined && nivelMinimo !== null;
  const abaixoDoMinimo = temMinimo && nivel < nivelMinimo;
  const textoMinimo = temMinimo
    ? `Mínimo esperado: nível ${nivelMinimo}/${nivelMax}${abaixoDoMinimo ? ', abaixo do esperado' : ''}`
    : '';

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
          {Array.from({ length: nivelMax }, (_, indice) => (
            <span
              key={indice}
              className={cx(styles.segmento, indice < nivel && styles.preenchido)}
              style={{ '--ordem': indice }}
            />
          ))}
        </div>
        {temMinimo && (
          <span
            className={styles.marca}
            style={{ left: `${(Math.min(nivelMinimo, nivelMax) / nivelMax) * 100}%` }}
            aria-hidden="true"
          />
        )}
      </div>
      {temMinimo && (
        <p className={cx(styles.minimo, abaixoDoMinimo && styles.abaixo)} aria-hidden="true">
          {textoMinimo}
        </p>
      )}
    </div>
  );
}
