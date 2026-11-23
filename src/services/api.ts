/**
 * Comunicação com a API do BBTS. Toda chamada de rede do app passa por aqui,
 * e os formatos da API são convertidos para os tipos de `@/types/dominio`.
 */
import fotoEquipe1 from '@/assets/images/equipes/FotoEquipe1.webp'
import fotoEquipe2 from '@/assets/images/equipes/FotoEquipe2.webp'
import fotoEquipe3 from '@/assets/images/equipes/FotoEquipe3.webp'
import fotoEquipe4 from '@/assets/images/equipes/FotoEquipe4.webp'
import type {
  Certificacao,
  Colaborador,
  Competencia,
  CompetenciaCatalogo,
  Curso,
  Equipe,
  EquipeResumo,
  Experiencia,
  Feedback,
  Formacao,
  ItemComNivel,
  Lacuna,
  Membro,
  Perfil,
  PerfilApi,
  Pessoa,
  TipoFeedback,
  Usuario,
} from '@/types/dominio'

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

const CABECALHOS_JSON = { 'Content-Type': 'application/json' }
const ESPERA_ENTRE_TENTATIVAS_MS = 2000

export class ErroApi extends Error {
  readonly status: number

  constructor(mensagem: string, status: number) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

/** Mensagem da API quando ela recusa; texto genérico quando nem respondeu. */
export const mensagemDaApi = (erro: unknown, padrao = 'Não conseguimos falar com a API. Tente de novo em instantes.'): string =>
  erro instanceof ErroApi ? erro.message : padrao

async function tratarResposta<T>(resposta: Response): Promise<T> {
  if (!resposta.ok) {
    const corpo = (await resposta.json().catch(() => null)) as { message?: string } | null
    throw new ErroApi(corpo?.message || `Erro HTTP ${resposta.status}: ${resposta.statusText}`, resposta.status)
  }
  // Alguns endpoints, como o DELETE, respondem sem corpo.
  const tipo = resposta.headers.get('content-type')
  return (tipo?.includes('application/json') ? await resposta.json() : null) as T
}

/** Repete em falha de rede, comum enquanto o serviço acorda. */
async function fetchComRetry(url: string, opcoes: RequestInit = {}, tentativas = 3): Promise<Response> {
  try {
    return await fetch(url, opcoes)
  } catch (erro) {
    if (tentativas > 0 && erro instanceof TypeError) {
      await new Promise((resolve) => setTimeout(resolve, ESPERA_ENTRE_TENTATIVAS_MS))
      return fetchComRetry(url, opcoes, tentativas - 1)
    }
    throw erro
  }
}

const requisitar = async <T>(caminho: string, opcoes?: RequestInit): Promise<T> =>
  tratarResposta<T>(await fetchComRetry(`${API_BASE_URL}${caminho}`, opcoes))

const enviarJson = <T>(caminho: string, method: 'POST' | 'PUT', corpo: unknown) =>
  requisitar<T>(caminho, { method, headers: CABECALHOS_JSON, body: JSON.stringify(corpo) })

const excluir = (caminho: string) => requisitar<null>(caminho, { method: 'DELETE' })

/* ───────────── Conversões ───────────── */

const urlDaFoto = (id: number, versao: number | null | undefined) => (versao ? `${API_BASE_URL}/usuarios/${id}/foto?v=${versao}` : null)

const perfilDaApi = (perfil: PerfilApi | null | undefined): Perfil => (perfil === 'GESTOR' ? 'gestor' : 'colaborador')

const FOTOS_DE_EQUIPE = [fotoEquipe1, fotoEquipe2, fotoEquipe3, fotoEquipe4]

/** Imagem ilustrativa da equipe. A API não guarda imagem de equipe, então o front alterna entre quatro. */
export const fotoDaEquipe = (id: number): string => FOTOS_DE_EQUIPE[(Math.max(id, 1) - 1) % FOTOS_DE_EQUIPE.length]!

interface PessoaApi {
  id: number
  nome: string
  email: string
  area: string | null
  fotoVersao: number | null
}

const pessoaDaApi = (p: PessoaApi): Pessoa => ({
  id: p.id,
  nome: p.nome,
  email: p.email,
  area: p.area,
  foto: urlDaFoto(p.id, p.fotoVersao),
})

interface UsuarioApi extends PessoaApi {
  cpf: string
  telefone: string | null
  dataNascimento: string
  perfil: PerfilApi | null
  equipeId: number | null
}

const usuarioDaApi = (u: UsuarioApi): Usuario => ({
  ...pessoaDaApi(u),
  perfil: perfilDaApi(u.perfil),
  equipeId: u.equipeId,
})

interface ColaboradorApi extends Omit<UsuarioApi, 'equipeId'> {
  equipe: EquipeResumo | null
  competencias: Competencia[]
  lacunas: Lacuna[]
  jornada: Curso[]
  idiomas: ItemComNivel[]
  tecnologias: ItemComNivel[]
  experiencias: Experiencia[]
  certificacoes: Array<Omit<Certificacao, 'arquivo'> & { temArquivo: boolean }>
  formacoes: Formacao[]
}

const colaboradorDaApi = (c: ColaboradorApi): Colaborador => ({
  ...c,
  foto: urlDaFoto(c.id, c.fotoVersao),
  perfil: perfilDaApi(c.perfil),
  certificacoes: c.certificacoes.map(({ temArquivo, ...cert }) => ({
    ...cert,
    arquivo: temArquivo ? `${API_BASE_URL}/certificacoes/${cert.id}/arquivo` : null,
  })),
})

interface EquipeApi {
  id: number
  nome: string
  foco: string
  descricao: string | null
  gestor: PessoaApi | null
  competenciasMinimas: Competencia[]
  membros: Array<PessoaApi & { competencias: Competencia[] }>
}

const equipeDaApi = (e: EquipeApi): Equipe => ({
  ...e,
  foto: fotoDaEquipe(e.id),
  gestor: e.gestor ? pessoaDaApi(e.gestor) : null,
  membros: e.membros.map((m): Membro => ({ ...pessoaDaApi(m), competencias: m.competencias })),
})

interface FeedbackApi {
  id: number
  tipo: TipoFeedback
  mensagem: string
  dataEnvio: string
  autor: PessoaApi | null
  destinatario: PessoaApi
}

const feedbackDaApi = (f: FeedbackApi): Feedback => ({
  ...f,
  autor: f.autor ? pessoaDaApi(f.autor) : null,
  destinatario: pessoaDaApi(f.destinatario),
})

/* ───────────── Recursos ───────────── */

export interface RecursoApi {
  cadastrar: (dados: unknown) => Promise<unknown>
  atualizar: (id: number | string, dados: unknown) => Promise<unknown>
  excluir: (id: number | string) => Promise<unknown>
}

/** Escrita de um recurso JSON simples (o corpo leva `usuario: { id }`). */
function recurso(caminho: string): RecursoApi {
  return {
    cadastrar: (dados) => enviarJson(caminho, 'POST', dados),
    atualizar: (id, dados) => enviarJson(`${caminho}/${id}`, 'PUT', dados),
    excluir: (id) => excluir(`${caminho}/${id}`),
  }
}

export const IdiomaAPI = recurso('/idiomas')
export const TecnologiaAPI = recurso('/tecnologias')
export const ExperienciaAPI = recurso('/experienciaProfissional')
export const FormacaoAPI = recurso('/formacoes')

export const CertificacaoAPI = {
  excluir: (id: number) => excluir(`/certificacoes/${id}`),
  /** Multipart com `dados` em JSON e `arquivo` opcional. O navegador define o Content-Type. */
  cadastrar: (certificacao: unknown, arquivo: File | null = null) => {
    const corpo = new FormData()
    corpo.append('dados', new Blob([JSON.stringify(certificacao)], { type: 'application/json' }))
    if (arquivo) corpo.append('arquivo', arquivo)
    return requisitar<{ id: number }>('/certificacoes', { method: 'POST', body: corpo })
  },
}

export const UsuarioAPI = {
  buscar: async (id: number | string) => usuarioDaApi(await requisitar<UsuarioApi>(`/usuarios/${id}`)),
  completo: async (id: number | string) => colaboradorDaApi(await requisitar<ColaboradorApi>(`/usuarios/${id}/completo`)),
  cadastrar: async (dados: unknown) => usuarioDaApi(await enviarJson<UsuarioApi>('/usuarios', 'POST', dados)),
  atualizar: async (id: number | string, dados: unknown) => usuarioDaApi(await enviarJson<UsuarioApi>(`/usuarios/${id}`, 'PUT', dados)),
  enviarFoto: async (id: number | string, foto: File) => {
    const corpo = new FormData()
    corpo.append('foto', foto)
    return usuarioDaApi(await requisitar<UsuarioApi>(`/usuarios/${id}/foto`, { method: 'PUT', body: corpo }))
  },
  definirCompetencia: (id: number | string, sigla: string, nivel: number) =>
    enviarJson<Competencia[]>(`/usuarios/${id}/competencias`, 'PUT', { sigla, nivel }),
  removerCompetencia: (id: number | string, sigla: string) => excluir(`/usuarios/${id}/competencias/${sigla}`),
}

export const AuthAPI = {
  entrar: async (email: string, senha: string, perfil: Perfil) => {
    const resposta = await enviarJson<{ usuario: UsuarioApi; primeiroAcesso: boolean }>('/auth/login', 'POST', {
      email,
      senha,
      perfil: perfil === 'gestor' ? 'GESTOR' : 'COLABORADOR',
    })
    return { usuario: usuarioDaApi(resposta.usuario), primeiroAcesso: resposta.primeiroAcesso }
  },
}

export const EquipeAPI = {
  listar: async (gestorId: number | string) => (await requisitar<EquipeApi[]>(`/equipes?gestorId=${gestorId}`)).map(equipeDaApi),
  buscar: async (id: number | string) => equipeDaApi(await requisitar<EquipeApi>(`/equipes/${id}`)),
  criar: async (dados: { nome: string; foco: string; descricao?: string; gestorId: number; emails: string[] }) =>
    equipeDaApi(await enviarJson<EquipeApi>('/equipes', 'POST', dados)),
  adicionarMembros: async (id: number | string, emails: string[]) => {
    const r = await enviarJson<{ adicionados: PessoaApi[]; naoEncontrados: string[] }>(`/equipes/${id}/membros`, 'POST', { emails })
    return { adicionados: r.adicionados.map(pessoaDaApi), naoEncontrados: r.naoEncontrados }
  },
  removerMembro: (id: number | string, usuarioId: number | string) => excluir(`/equipes/${id}/membros/${usuarioId}`),
}

export const CompetenciaAPI = {
  catalogo: () => requisitar<CompetenciaCatalogo[]>('/competencias'),
}

export const FeedbackAPI = {
  recebidos: async (usuarioId: number | string) =>
    (await requisitar<FeedbackApi[]>(`/feedbacks?destinatarioId=${usuarioId}`)).map(feedbackDaApi),
  enviados: async (autorId: number | string) => (await requisitar<FeedbackApi[]>(`/feedbacks?autorId=${autorId}`)).map(feedbackDaApi),
  enviar: async (dados: { autorId: number | null; destinatarioEmail: string; tipo: TipoFeedback; mensagem: string }) =>
    feedbackDaApi(await enviarJson<FeedbackApi>('/feedbacks', 'POST', dados)),
}

export const getAPIBaseURL = (): string => API_BASE_URL
