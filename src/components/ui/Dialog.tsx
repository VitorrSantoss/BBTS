import type { ReactNode } from 'react'
import { Dialog as D } from 'radix-ui'
import { X } from 'lucide-react'
import { cx } from '@/utils/classes'

export interface DialogProps {
  aberto: boolean
  aoMudar: (aberto: boolean) => void
  titulo: ReactNode
  descricao?: ReactNode
  children: ReactNode
  largura?: 'sm' | 'md' | 'lg'
}

/** Janela modal: foco preso, Esc fecha e o foco volta para quem abriu. */
export function Dialog({ aberto, aoMudar, titulo, descricao, children, largura = 'md' }: DialogProps) {
  return (
    <D.Root open={aberto} onOpenChange={aoMudar}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-40 anim-overlay bg-scrim" />
        <D.Content
          className={cx(
            'fixed top-1/2 left-1/2 z-50 flex max-h-[90dvh] w-[calc(100vw-1.5rem)] -translate-x-1/2 -translate-y-1/2 anim-dialog flex-col',
            'overflow-hidden rounded-xl bg-surface shadow-lg outline-none',
            { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }[largura],
          )}
        >
          <header className="flex items-start gap-4 border-b border-primary-100 px-6 py-5">
            <div className="flex flex-1 flex-col gap-1">
              <D.Title className="text-xl font-bold text-primary">{titulo}</D.Title>
              {descricao ? (
                <D.Description className="text-sm text-fg-muted">{descricao}</D.Description>
              ) : (
                <D.Description className="sr-only">Janela de diálogo</D.Description>
              )}
            </div>
            <D.Close aria-label="Fechar" className="-mt-1 -mr-2 rounded-md p-2 text-fg-muted hover:bg-primary-50 hover:text-primary">
              <X aria-hidden className="size-5" />
            </D.Close>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        </D.Content>
      </D.Portal>
    </D.Root>
  )
}
