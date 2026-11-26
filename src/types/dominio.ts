/** Perfis de acesso do sistema. */
export type Perfil = 'colaborador' | 'gestor'

/** Como a API escreve o perfil. */
export type PerfilApi = 'COLABORADOR' | 'GESTOR'

/**
 * Competência SFIA: sigla de 4 letras e nível sobre o nível máximo (ex.: PROG 5/6).
 * Nos mínimos de uma equipe, `nivel` é o nível mínimo esperado.
 */
export interface Competencia {
  sigla: string
  nome: string
  categoria?: string | null
  nivel: number
  nivelMax: number
}

/** Item do catálogo SFIA (GET /competencias). */
export interface CompetenciaCatalogo {
  id: number
  sigla: string
  nome: string
  categoria: string | null
  nivelMax: number
}

/** Competência mínima da equipe que o colaborador ainda não atinge. */
export interface Lacuna {
  sigla: string
  nome: string
  nivel: number
  minimo: number
}

/** Curso sugerido na jornada de capacitação (ligado a uma lacuna). */
export interface Curso {
  id: number
  titulo: string
  sigla: string
}

/** Enums NivelIdioma e NivelHabilidades da API. */
export type NivelIdioma = 'INICIANTE' | 'BASICO' | 'INTERMEDIARIO' | 'AVANCADO' | 'FLUENTE' | 'NATIVO'
export type NivelTecnologia = 'JUNIOR' | 'PLENO' | 'SENIOR'
export type NivelItem = NivelIdioma | NivelTecnologia

export interface ItemComNivel {
  id: number
  nome: string
  nivel: NivelItem
}

export interface Experiencia {
  id: number
  empresa: string
  cargo: string
  dataInicio: string
  dataFim: string | null
  empregoAtual: boolean
  descricao?: string | null
}

export interface Certificacao {
  id: number
  nomeCurso: string
  dataConclusao?: string | null
  nomeArquivo?: string | null
  /** URL do arquivo na API, quando há um. */
  arquivo: string | null
}

export type StatusFormacao = 'CURSANDO' | 'CONCLUIDO'

export interface Formacao {
  id: number
  instituicao: string
  curso: string
  anoInicio: number
  anoFim: number | null
  status: StatusFormacao
}

/** Equipe do colaborador, com os mínimos usados para medir aderência. */
export interface EquipeResumo {
  id: number
  nome: string
  foco: string
  competenciasMinimas: Competencia[]
}

export interface Colaborador {
  id: number
  nome: string
  email: string
  cpf: string | null
  telefone: string | null
  dataNascimento: string | null
  /** URL da foto na API. Nula quando a pessoa não enviou uma. */
  foto: string | null
  area: string | null
  perfil: Perfil
  equipe: EquipeResumo | null
  competencias: Competencia[]
  lacunas: Lacuna[]
  jornada: Curso[]
  formacoes: Formacao[]
  experiencias: Experiencia[]
  idiomas: ItemComNivel[]
  tecnologias: ItemComNivel[]
  certificacoes: Certificacao[]
}

/** Identidade resumida: gestor, autor ou destinatário de feedback. */
export interface Pessoa {
  id: number
  nome: string
  email: string
  area: string | null
  foto: string | null
}

export interface Membro extends Pessoa {
  competencias: Competencia[]
}

export interface Equipe {
  id: number
  nome: string
  foco: string
  descricao: string | null
  /** Imagem ilustrativa da equipe (asset do front, escolhida pelo id). */
  foto: string
  gestor: Pessoa | null
  membros: Membro[]
  competenciasMinimas: Competencia[]
}

export type TipoFeedback = 'POSITIVO' | 'DESENVOLVIMENTO'

export interface Feedback {
  id: number
  tipo: TipoFeedback
  mensagem: string
  dataEnvio: string
  autor: Pessoa | null
  destinatario: Pessoa
}

/** Usuário logado (GET /usuarios/:id). */
export interface Usuario {
  id: number
  nome: string
  email: string
  area: string | null
  perfil: Perfil
  equipeId: number | null
  foto: string | null
}
