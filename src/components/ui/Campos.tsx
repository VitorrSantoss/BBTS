import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { ChevronDown, TriangleAlert } from 'lucide-react'
import { cx } from '@/utils/classes'

const controle = cx(
  'w-full rounded-md border border-primary-500 bg-surface text-fg placeholder:text-fg-muted/70',
  'transition-[border-color,box-shadow] duration-(--dur-rapida)',
  'hover:border-primary focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary-200 focus-visible:outline-none',
  'aria-invalid:border-primary-deep aria-invalid:ring-primary-200',
  'disabled:cursor-not-allowed disabled:border-primary-200 disabled:bg-bg disabled:text-fg-muted',
)

interface BaseCampo {
  label: ReactNode
  erro?: string
  dica?: ReactNode
  /** Ícone dentro do campo, à esquerda. */
  icone?: ReactNode
  className?: string
  /** Esconde o label visualmente (continua acessível). */
  labelOculto?: boolean
}

function useIdsDoCampo(erro?: string, dica?: ReactNode) {
  const id = useId()
  const idDica = `${id}-dica`
  const idErro = `${id}-erro`
  const descricao = [dica ? idDica : null, erro ? idErro : null].filter(Boolean).join(' ') || undefined
  return { id, idDica, idErro, descricao }
}

function Moldura({
  id,
  label,
  labelOculto,
  required,
  erro,
  dica,
  idDica,
  idErro,
  className,
  children,
}: BaseCampo & { id: string; required?: boolean; idDica: string; idErro: string; children: ReactNode }) {
  return (
    <div className={cx('flex min-w-0 flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cx('text-sm font-semibold text-fg', labelOculto && 'sr-only')}>
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-primary">
            *
          </span>
        )}
      </label>
      {children}
      {dica && !erro && (
        <p id={idDica} className="text-xs text-fg-muted">
          {dica}
        </p>
      )}
      {erro && (
        <p id={idErro} className="flex items-center gap-1.5 text-xs font-semibold text-primary-deep">
          <TriangleAlert aria-hidden className="size-3.5 shrink-0" />
          {erro}
        </p>
      )}
    </div>
  )
}

export type InputProps = BaseCampo & InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, erro, dica, icone, className, labelOculto, required, type, ...props },
  ref,
) {
  const { id, idDica, idErro, descricao } = useIdsDoCampo(erro, dica)
  const arquivo = type === 'file'
  return (
    <Moldura {...{ id, label, labelOculto, required, erro, dica, idDica, idErro, className }}>
      <div className="relative">
        {icone && (
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-primary [&>svg]:size-4">{icone}</span>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          required={required}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricao}
          className={cx(
            controle,
            arquivo
              ? 'h-auto py-2 pr-3 pl-2 text-sm file:mr-3 file:h-8 file:cursor-pointer file:rounded-sm file:border-0 file:bg-primary-50 file:px-3 file:font-semibold file:text-primary'
              : 'h-11 px-3.5',
            icone && 'pl-10',
          )}
          {...props}
        />
      </div>
    </Moldura>
  )
})

export type SelectProps = BaseCampo & SelectHTMLAttributes<HTMLSelectElement> & { opcoes: Array<{ valor: string; rotulo: string }> }

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, erro, dica, className, labelOculto, required, opcoes, icone: _icone, ...props },
  ref,
) {
  const { id, idDica, idErro, descricao } = useIdsDoCampo(erro, dica)
  return (
    <Moldura {...{ id, label, labelOculto, required, erro, dica, idDica, idErro, className }}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          required={required}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricao}
          className={cx(controle, 'h-11 appearance-none pr-10 pl-3.5')}
          {...props}
        >
          {opcoes.map(({ valor, rotulo }) => (
            <option key={valor} value={valor}>
              {rotulo}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-primary" />
      </div>
    </Moldura>
  )
})

export type TextareaProps = BaseCampo & TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, erro, dica, className, labelOculto, required, rows = 4, icone: _icone, ...props },
  ref,
) {
  const { id, idDica, idErro, descricao } = useIdsDoCampo(erro, dica)
  return (
    <Moldura {...{ id, label, labelOculto, required, erro, dica, idDica, idErro, className }}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        required={required}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricao}
        className={cx(controle, 'resize-y px-3.5 py-2.5 leading-relaxed')}
        {...props}
      />
    </Moldura>
  )
})

export const Checkbox = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: ReactNode }>(
  function Checkbox({ label, className, ...props }, ref) {
    const id = useId()
    return (
      <div className={cx('flex items-center gap-2.5', className)}>
        <input ref={ref} id={id} type="checkbox" className="size-5 shrink-0 cursor-pointer rounded-xs accent-(--bbts-azul)" {...props} />
        <label htmlFor={id} className="cursor-pointer text-sm font-semibold text-fg">
          {label}
        </label>
      </div>
    )
  },
)
