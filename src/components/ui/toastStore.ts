import { create } from 'zustand'

export type Tom = 'sucesso' | 'erro' | 'info'

export interface ItemToast {
  id: number
  mensagem: string
  tom: Tom
}

interface EstadoToast {
  itens: ItemToast[]
  adicionar: (mensagem: string, tom: Tom) => void
  remover: (id: number) => void
}

let proximoId = 0

export const useToastStore = create<EstadoToast>((set) => ({
  itens: [],
  adicionar: (mensagem, tom) => set((s) => ({ itens: [...s.itens.slice(-2), { id: ++proximoId, mensagem, tom }] })),
  remover: (id) => set((s) => ({ itens: s.itens.filter((i) => i.id !== id) })),
}))

/** Avisos rápidos. Pode ser chamado de qualquer lugar, inclusive fora de componentes. */
export const toast = {
  sucesso: (mensagem: string) => useToastStore.getState().adicionar(mensagem, 'sucesso'),
  erro: (mensagem: string) => useToastStore.getState().adicionar(mensagem, 'erro'),
  info: (mensagem: string) => useToastStore.getState().adicionar(mensagem, 'info'),
}
