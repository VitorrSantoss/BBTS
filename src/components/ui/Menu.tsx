import type { ComponentProps } from 'react'
import { DropdownMenu as M } from 'radix-ui'
import { cx } from '@/utils/classes'

export const Menu = M.Root
export const MenuGatilho = M.Trigger

export function MenuConteudo({ className, align = 'end', ...props }: ComponentProps<typeof M.Content>) {
  return (
    <M.Portal>
      <M.Content
        align={align}
        sideOffset={8}
        className={cx('z-50 min-w-60 anim-menu rounded-lg border border-primary-100 bg-surface p-1.5 shadow-lg', className)}
        {...props}
      />
    </M.Portal>
  )
}

export function MenuItem({ className, ...props }: ComponentProps<typeof M.Item>) {
  return (
    <M.Item
      className={cx(
        'flex h-10 cursor-pointer items-center gap-3 rounded-md px-3 text-sm font-semibold text-fg outline-none select-none',
        'data-disabled:opacity-50 data-highlighted:bg-primary-50 data-highlighted:text-primary [&>svg]:size-4 [&>svg]:text-primary',
        className,
      )}
      {...props}
    />
  )
}

export function MenuRotulo({ className, ...props }: ComponentProps<typeof M.Label>) {
  return <M.Label className={cx('px-3 pt-2 pb-1 text-xs font-semibold text-fg-muted', className)} {...props} />
}

export function MenuSeparador() {
  return <M.Separator className="my-1.5 h-px bg-primary-100" />
}
