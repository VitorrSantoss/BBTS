import { useValorAnimado } from '@/hooks/useValorAnimado'
import { cx } from '@/utils/classes'

/** Rosca de percentual (nível total, aderência). `valor` vai de 0 a 100. */
export function DonutChart({
  valor,
  tamanho = 152,
  rotulo = 'Nível total',
  legenda,
  className,
}: {
  valor: number
  tamanho?: number
  rotulo?: string
  legenda?: string
  className?: string
}) {
  const alvo = Math.min(100, Math.max(0, Math.round(valor)))
  const exibido = useValorAnimado(alvo)

  const espessura = Math.round(tamanho * 0.1)
  const raio = (tamanho - espessura) / 2
  const circunferencia = 2 * Math.PI * raio
  const centro = tamanho / 2

  return (
    <div
      className={cx('relative shrink-0', className)}
      style={{ width: tamanho, height: tamanho }}
      role="img"
      aria-label={`${rotulo}: ${alvo}%`}
    >
      <svg viewBox={`0 0 ${tamanho} ${tamanho}`} aria-hidden className="size-full">
        <circle cx={centro} cy={centro} r={raio} fill="none" stroke="var(--azul-100)" strokeWidth={espessura} />
        <circle
          cx={centro}
          cy={centro}
          r={raio}
          fill="none"
          stroke="var(--bbts-azul)"
          strokeWidth={espessura}
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={circunferencia * (1 - exibido / 100)}
          transform={`rotate(-90 ${centro} ${centro})`}
        />
      </svg>
      <span aria-hidden className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-primary tabular" style={{ fontSize: tamanho * 0.22, lineHeight: 1 }}>
          {exibido}%
        </span>
        {legenda && <span className="mt-1 text-xs font-semibold text-fg-muted">{legenda}</span>}
      </span>
    </div>
  )
}
