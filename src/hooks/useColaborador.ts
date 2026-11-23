import { useQuery } from '@tanstack/react-query'
import { CompetenciaAPI, FeedbackAPI, UsuarioAPI } from '@/services/api'
import { useSessao } from '@/services/sessao'

export const chaves = {
  usuario: (id: string | number | null) => ['usuario', String(id)] as const,
  colaboradores: ['colaborador'] as const,
  colaborador: (id: string | number | null | undefined) => ['colaborador', String(id)] as const,
  catalogo: ['competencias'] as const,
  feedbacks: ['feedbacks'] as const,
  recebidos: (id: string | number | null) => ['feedbacks', 'recebidos', String(id)] as const,
  enviados: (id: string | number | null) => ['feedbacks', 'enviados', String(id)] as const,
  equipes: ['equipes'] as const,
  equipesDoGestor: (gestorId: string | number | null) => ['equipes', 'gestor', String(gestorId)] as const,
  equipe: (id: string | number | undefined) => ['equipes', 'id', String(id)] as const,
}

/** Usuário logado, para o cabeçalho e as saudações. */
export function useUsuarioLogado() {
  const usuarioId = useSessao((s) => s.usuarioId)
  return useQuery({
    queryKey: chaves.usuario(usuarioId),
    queryFn: () => UsuarioAPI.buscar(usuarioId!),
    enabled: Boolean(usuarioId),
  })
}

/**
 * Perfil completo de um colaborador (GET /usuarios/:id/completo): dados, equipe, competências,
 * lacunas, jornada, idiomas, tecnologias, experiências, certificados e formação.
 */
export function useColaborador(id: string | number | null | undefined) {
  const consulta = useQuery({
    queryKey: chaves.colaborador(id),
    queryFn: () => UsuarioAPI.completo(id!),
    enabled: id != null && id !== '',
  })
  return {
    colaborador: consulta.data ?? null,
    erro: consulta.error,
    carregando: consulta.isPending,
    recarregando: consulta.isFetching,
    recarregar: () => void consulta.refetch(),
  }
}

/** O próprio colaborador logado. */
export function useMeusDados() {
  const usuarioId = useSessao((s) => s.usuarioId)
  return useColaborador(usuarioId)
}

/** Catálogo de competências SFIA. Muda pouco: fica em cache por 10 minutos. */
export function useCatalogo() {
  return useQuery({ queryKey: chaves.catalogo, queryFn: CompetenciaAPI.catalogo, staleTime: 10 * 60_000 })
}

export function useFeedbacksRecebidos(usuarioId: string | number | null) {
  return useQuery({
    queryKey: chaves.recebidos(usuarioId),
    queryFn: () => FeedbackAPI.recebidos(usuarioId!),
    enabled: Boolean(usuarioId),
  })
}

export function useFeedbacksEnviados(autorId: string | number | null) {
  return useQuery({
    queryKey: chaves.enviados(autorId),
    queryFn: () => FeedbackAPI.enviados(autorId!),
    enabled: Boolean(autorId),
  })
}
