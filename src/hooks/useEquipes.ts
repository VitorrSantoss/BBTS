import { useQuery } from '@tanstack/react-query'
import { EquipeAPI } from '@/services/api'
import { useSessao } from '@/services/sessao'
import type { Equipe } from '@/types/dominio'
import { aderenciaDaEquipe, competenciasAbaixoDoMinimo } from '@/utils/competencias'
import { minimosDe } from '@/utils/equipes'
import { chaves } from './useColaborador'

export interface ResumoEquipe {
  equipe: Equipe
  aderencia: number | null
  /** Membros com ao menos uma competência abaixo do mínimo. */
  abaixoDoMinimo: number
}

export function resumirEquipe(equipe: Equipe): ResumoEquipe {
  const minimos = minimosDe(equipe.competenciasMinimas)
  return {
    equipe,
    aderencia: aderenciaDaEquipe(equipe.membros, minimos),
    abaixoDoMinimo: equipe.membros.filter((m) => competenciasAbaixoDoMinimo(m.competencias, minimos).length > 0).length,
  }
}

/** Equipes do gestor logado, com membros, níveis e mínimos. `ativo: false` não consulta (perfil colaborador). */
export function useMinhasEquipes(ativo = true) {
  const usuarioId = useSessao((s) => s.usuarioId)
  return useQuery({
    queryKey: chaves.equipesDoGestor(usuarioId),
    queryFn: async () => (await EquipeAPI.listar(usuarioId!)).map(resumirEquipe),
    enabled: ativo && Boolean(usuarioId),
  })
}

export function useEquipe(id: string | undefined) {
  return useQuery({
    queryKey: chaves.equipe(id),
    queryFn: async () => resumirEquipe(await EquipeAPI.buscar(id!)),
    enabled: Boolean(id),
  })
}
