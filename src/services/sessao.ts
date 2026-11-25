import { create } from 'zustand'
import type { Perfil } from '@/types/dominio'

/**
 * Sessão do navegador: perfil escolhido e id do usuário que entrou (login ou cadastro).
 * Usa as mesmas chaves da versão anterior no localStorage, que pode falhar em janela privada.
 */
const CHAVE_PERFIL = 'perfil'
const CHAVE_USUARIO = 'usuarioId'

function ler(chave: string): string | null {
  try {
    return localStorage.getItem(chave)
  } catch {
    return null
  }
}

function gravar(chave: string, valor: string | null): void {
  try {
    if (valor === null) localStorage.removeItem(chave)
    else localStorage.setItem(chave, valor)
  } catch {
    // Sem armazenamento, o app segue funcionando só nesta aba.
  }
}

const perfilValido = (valor: string | null): Perfil | null => (valor === 'colaborador' || valor === 'gestor' ? valor : null)

interface SessaoState {
  perfil: Perfil | null
  usuarioId: string | null
  escolherPerfil: (perfil: Perfil) => void
  salvarUsuarioId: (id: string | number) => void
  /** Encerra a sessão: esquece perfil e usuário, e volta para a seleção de perfil. */
  sair: () => void
}

export const useSessao = create<SessaoState>((set) => ({
  perfil: perfilValido(ler(CHAVE_PERFIL)),
  usuarioId: ler(CHAVE_USUARIO),
  escolherPerfil: (perfil) => {
    gravar(CHAVE_PERFIL, perfil)
    set({ perfil })
  },
  salvarUsuarioId: (id) => {
    gravar(CHAVE_USUARIO, String(id))
    set({ usuarioId: String(id) })
  },
  sair: () => {
    gravar(CHAVE_PERFIL, null)
    gravar(CHAVE_USUARIO, null)
    set({ perfil: null, usuarioId: null })
  },
}))
