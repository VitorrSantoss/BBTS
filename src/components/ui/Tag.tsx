import type { HTMLAttributes } from 'react'
import { cx } from '@/utils/classes'

export type VarianteTag = 'destaque' | 'primaria' | 'neutra' | 'chip' | 'contorno'

const variantes: Record<VarianteTag, string> = {
  destaque: 'bg-accent-soft text-primary',
  primaria: 'bg-primary-50 text-primary',
  neutra: 'bg-bg text-fg-muted',
  chip: 'bg-accent text-primary',
  contorno: 'border border-primary-200 text-primary',
}

/** Etiqueta curta: equipe, área, nível, situação. */
export function Tag({ variante = 'destaque', className, ...props }: HTMLAttributes<HTMLSpanElement> & { variante?: VarianteTag }) {
  return (
    <span
      className={cx(
        'inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap',
        variantes[variante],
        className,
      )}
      {...props}
    />
  )
}
