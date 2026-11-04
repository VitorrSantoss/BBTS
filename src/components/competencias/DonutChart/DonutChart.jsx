import { cx } from '@/utils/classes';
import styles from './DonutChart.module.css';
import { useValorAnimado } from './useValorAnimado';

/** Rosca do nível total. `valor` é um percentual de 0 a 100. */
export default function DonutChart({ valor, tamanho = 150, rotulo = 'Nível total', className }) {
  const alvo = Math.min(100, Math.max(0, Math.round(valor)));
  const exibido = useValorAnimado(alvo);

  const espessura = Math.round(tamanho * 0.14);
  const raio = (tamanho - espessura) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const centro = tamanho / 2;

  return (
    <div
      className={cx(styles.rosca, className)}
      style={{ width: tamanho, height: tamanho, fontSize: tamanho * 0.22 }}
      role="img"
      aria-label={`${rotulo}: ${alvo}%`}
    >
      <svg viewBox={`0 0 ${tamanho} ${tamanho}`} aria-hidden="true">
        <circle
          className={styles.trilha}
          cx={centro}
          cy={centro}
          r={raio}
          strokeWidth={espessura}
        />
        <circle
          className={styles.valor}
          cx={centro}
          cy={centro}
          r={raio}
          strokeWidth={espessura}
          strokeDasharray={circunferencia}
          strokeDashoffset={circunferencia * (1 - exibido / 100)}
          transform={`rotate(-90 ${centro} ${centro})`}
        />
      </svg>
      <span className={styles.texto} aria-hidden="true">
        {exibido}%
      </span>
    </div>
  );
}
