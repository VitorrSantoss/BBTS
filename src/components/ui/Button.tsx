import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router'
import { cx } from '@/utils/classes'

export type VarianteBotao = 'primario' | 'destaque' | 'secundario' | 'fantasma' | 'inverso' | 'texto' | 'perigo'
export type TamanhoBotao = 'sm' | 'md' | 'lg'

const variantes: Record<VarianteBotao, string> = {
  primario: 'bg-primary text-white hover:bg-primary-strong active:bg-primary-deep',
  // Amarelo: só como fundo com texto azul (nunca texto amarelo sobre branco)
  destaque: 'bg-accent text-primary hover:brightness-95 active:brightness-90',
  secundario: 'border border-primary-200 bg-surface text-primary hover:border-primary-300 hover:bg-primary-50',
  fantasma: 'text-primary hover:bg-primary-50',
  inverso: 'text-white hover:bg-on-primary-soft',
  texto: 'h-auto! px-0! text-primary underline underline-offset-4 decoration-primary-300 hover:decoration-primary',
  perigo: 'border border-primary-200 bg-surface text-primary-deep hover:bg-primary-50',
}

const tamanhos: Record<TamanhoBotao, string> = {
  sm: 'h-8 gap-1.5 rounded-sm px-3 text-sm',
  md: 'h-10 gap-2 rounded-md px-4 text-sm',
  lg: 'h-12 gap-2 rounded-md px-5 text-base',
}

const tamanhosIcone: Record<TamanhoBotao, string> = { sm: 'size-8 rounded-sm', md: 'size-10 rounded-md', lg: 'size-12 rounded-md' }

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao
  tamanho?: TamanhoBotao
  /** Ícone à esquerda (ex.: <Plus />). */
  icone?: ReactNode
  iconeDireita?: ReactNode
  /** Só o ícone fica visível; `children` vira o nome acessível. */
  somenteIcone?: boolean
  carregando?: boolean
  /** Renderiza como link de rota. */
  para?: string
}

/** Botão do sistema. Com `para`, vira um link de navegação com o mesmo visual. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variante = 'primario',
    tamanho = 'md',
    icone,
    iconeDireita,
    somenteIcone,
    carregando,
    para,
    className,
    children,
    disabled,
    type,
    ...props
  },
  ref,
) {
  const classes = cx(
    'inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap select-none',
    'transition-[background-color,border-color,color,filter] duration-(--dur-rapida)',
    'disabled:pointer-events-none disabled:opacity-50',
    variantes[variante],
    somenteIcone ? tamanhosIcone[tamanho] : tamanhos[tamanho],
    className,
  )

  const conteudo = (
    <>
      {carregando ? <Spinner /> : icone}
      {somenteIcone ? <span className="sr-only">{children}</span> : children}
      {!somenteIcone && iconeDireita}
    </>
  )

  if (para) {
    return (
      <Link to={para} viewTransition className={classes}>
        {conteudo}
      </Link>
    )
  }

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={classes}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      {...props}
    >
      {conteudo}
    </button>
  )
})

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx('inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent', className)}
    />
  )
}
