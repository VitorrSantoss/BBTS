import { Toast as T } from 'radix-ui'
import { Check, Info, TriangleAlert, X } from 'lucide-react'
import { cx } from '@/utils/classes'
import { useToastStore } from './toastStore'

const icones = { sucesso: Check, erro: TriangleAlert, info: Info }
const tons = {
  sucesso: 'bg-primary text-white',
  erro: 'bg-accent text-primary',
  info: 'bg-primary-100 text-primary',
}

/** Monte uma vez na raiz do app. */
export function Toaster() {
  const itens = useToastStore((s) => s.itens)
  const remover = useToastStore((s) => s.remover)

  return (
    <T.Provider swipeDirection="right" label="Notificação">
      {itens.map(({ id, mensagem, tom }) => {
        const Icone = icones[tom]
        return (
          <T.Root
            key={id}
            duration={tom === 'erro' ? 8000 : 5000}
            type={tom === 'erro' ? 'foreground' : 'background'}
            onOpenChange={(aberto) => !aberto && remover(id)}
            className="flex anim-toast items-start gap-3 rounded-lg border border-primary-100 bg-surface p-3.5 pr-2.5 shadow-lg data-[swipe=end]:animate-none data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)"
          >
            <span aria-hidden className={cx('flex size-8 shrink-0 items-center justify-center rounded-full', tons[tom])}>
              <Icone className="size-4" />
            </span>
            <T.Description className="flex-1 pt-1.5 text-sm font-semibold text-fg">{mensagem}</T.Description>
            <T.Close aria-label="Fechar aviso" className="rounded-sm p-1.5 text-fg-muted hover:bg-primary-50 hover:text-primary">
              <X aria-hidden className="size-4" />
            </T.Close>
          </T.Root>
        )
      })}
      <T.Viewport className="fixed right-0 bottom-0 z-50 flex w-full max-w-sm flex-col gap-2 p-4 outline-none" />
    </T.Provider>
  )
}
