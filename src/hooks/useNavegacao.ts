import { useEffect, useRef, type RefObject } from 'react'
import { useLocation, useMatches } from 'react-router'
import { tituloEquipe } from '@/utils/equipes'
import { useColaborador } from './useColaborador'
import { useEquipe } from './useEquipes'

export interface ItemTrilha {
  rotulo: string
  para: string
}

/** Tipo de trilha do gestor. O `:id` da rota é de equipe ou de colaborador. */
export type TipoTrilha = 'equipe' | 'colaborador' | 'perfil'

/** Metadados de cada rota, em `handle`. */
export interface HandleRota {
  titulo?: string
  comCabecalho?: boolean
  trilha?: TipoTrilha
}

/** Título da rota mais específica que define um. */
export function useTituloDaRota(): string | undefined {
  const matches = useMatches()
  return matches
    .map((m) => (m.handle as HandleRota | undefined)?.titulo)
    .filter(Boolean)
    .at(-1)
}

const HOME: ItemTrilha = { rotulo: 'Dashboard', para: '/gestor' }

/**
 * Trilha (breadcrumb) da rota atual, se ela tiver uma: Dashboard › Equipe › Colaborador › Perfil.
 * Os nomes vêm das mesmas consultas das telas, então não geram requisições a mais.
 */
export function useTrilhaDaRota(): ItemTrilha[] | null {
  const matches = useMatches()
  const atual = [...matches].reverse().find((m) => (m.handle as HandleRota | undefined)?.trilha)
  const tipo = (atual?.handle as HandleRota | undefined)?.trilha
  const id = atual?.params.id

  const { data: resumo } = useEquipe(tipo === 'equipe' ? id : undefined)
  const { colaborador } = useColaborador(tipo === 'colaborador' || tipo === 'perfil' ? id : null)

  if (!tipo || !id) return null
  if (tipo === 'equipe') {
    return [HOME, ...(resumo ? [{ rotulo: tituloEquipe(resumo.equipe), para: `/gestor/equipes/${id}` }] : [])]
  }

  const equipe = colaborador?.equipe
  const trilha: ItemTrilha[] = [
    HOME,
    ...(equipe ? [{ rotulo: tituloEquipe(equipe), para: `/gestor/equipes/${equipe.id}` }] : []),
    { rotulo: colaborador?.nome ?? 'Colaborador', para: `/gestor/colaboradores/${id}` },
  ]
  if (tipo === 'perfil') trilha.push({ rotulo: 'Perfil', para: `/gestor/colaboradores/${id}/perfil` })
  return trilha
}

/** Ao trocar de rota, leva o foco para o conteúdo, como aconteceria num carregamento de página. */
export function useFocoAoNavegar(refConteudo: RefObject<HTMLElement | null>): void {
  const { pathname } = useLocation()
  const rotaAnterior = useRef(pathname)

  useEffect(() => {
    if (rotaAnterior.current === pathname) return
    rotaAnterior.current = pathname
    refConteudo.current?.focus({ preventScroll: true })
  }, [pathname, refConteudo])
}
