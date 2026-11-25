import { useEffect, type ReactNode } from 'react'
import { Navigate, Outlet, ScrollRestoration } from 'react-router'
import { ErrorState } from '@/components/ui'
import { useTituloDaRota } from '@/hooks/useNavegacao'
import { useSessao } from '@/services/sessao'
import type { Perfil } from '@/types/dominio'

/* ───────────── Raiz, proteção e erro ───────────── */

/** Mantém o título da aba em dia com a rota e restaura a rolagem. */
export function Raiz() {
  const titulo = useTituloDaRota()
  useEffect(() => {
    document.title = titulo ? `${titulo} | BBTS` : 'BBTS'
  }, [titulo])
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}

/** Exige login no perfil certo. Sem sessão, ou com o outro perfil, volta para a seleção de perfil. */
export function RequireProfile({ perfil, children }: { perfil: Perfil; children: ReactNode }) {
  const atual = useSessao((s) => s.perfil)
  const usuarioId = useSessao((s) => s.usuarioId)
  return atual === perfil && usuarioId ? children : <Navigate to="/" replace />
}

/** Último recurso para falhas inesperadas de renderização. */
export function ErroDeRota() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-16">
      <h1 className="sr-only">Erro</h1>
      <div className="w-full">
        <ErrorState
          titulo="Algo deu errado nesta tela"
          descricao="Recarregue a página para continuar."
          aoTentarDeNovo={() => window.location.reload()}
        />
      </div>
    </main>
  )
}
