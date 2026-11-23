import type { Colaborador, StatusFormacao } from '@/types/dominio'
import { apenasDigitos, digitosDoTelefone } from '@/utils/mascaras'
import { CertificacaoAPI, ErroApi, ExperienciaAPI, FormacaoAPI, IdiomaAPI, TecnologiaAPI, UsuarioAPI, type RecursoApi } from './api'

/** Valores do formulário de cadastro/edição. */
export interface LinhaNivel {
  id?: number
  nome: string
  nivel: string
}
export interface LinhaExperiencia {
  id?: number
  empresa: string
  cargo: string
  dataInicio: string
  dataFim: string
  empregoAtual: boolean
}
export interface LinhaFormacao {
  id?: number
  instituicao: string
  curso: string
  anoInicio: string
  anoFim: string
  status: StatusFormacao
}
export interface LinhaCertificado {
  id?: number
  nomeCurso?: string
  arquivo: File | null
}
export interface ValoresCadastro {
  nome: string
  cpf: string
  area: string
  email: string
  telefone: string
  dataNascimento: string
  /** Só no cadastro novo. Na edição fica vazia e a senha atual é mantida. */
  senha: string
  foto: File | null
  idiomas: LinhaNivel[]
  tecnologias: LinhaNivel[]
  experiencias: LinhaExperiencia[]
  formacoes: LinhaFormacao[]
  certificados: LinhaCertificado[]
}

/** O usuário foi salvo, mas algum dado relacionado falhou. O cadastro já não pode ser repetido. */
export class ErroSalvamentoParcial extends Error {
  readonly usuarioId: string

  constructor(usuarioId: string, causa: unknown) {
    super('Salvamento parcial', { cause: causa })
    this.name = 'ErroSalvamentoParcial'
    this.usuarioId = usuarioId
  }
}

export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ErroApi) return `A API recusou os dados: ${erro.message}`
  return 'Não conseguimos falar com a API. Tente de novo em instantes.'
}

const dataDeHoje = () => new Date().toLocaleDateString('sv-SE')
const semExtensao = (nomeArquivo: string) => nomeArquivo.replace(/\.[^.]+$/, '')

/**
 * CPF e telefone vão só com dígitos (telefone vazio vira null: a regex da API não aceita texto vazio).
 * A senha só vai quando foi preenchida; a API guarda o hash.
 */
const montarUsuario = ({ nome, cpf, area, email, telefone, dataNascimento, senha }: ValoresCadastro) => ({
  nome: nome.trim(),
  cpf: apenasDigitos(cpf),
  area: area.trim() || null,
  email: email.trim(),
  telefone: digitosDoTelefone(telefone) || null,
  dataNascimento,
  ...(senha ? { senha } : {}),
})

const preenchidoNome = ({ id, nome }: LinhaNivel) => Boolean(id || nome.trim())
const preenchidaExperiencia = ({ id, empresa, cargo }: LinhaExperiencia) => Boolean(id || empresa.trim() || cargo.trim())
const preenchidaFormacao = ({ id, instituicao, curso }: LinhaFormacao) => Boolean(id || instituicao.trim() || curso.trim())

const montarNivel = ({ nome, nivel }: LinhaNivel) => ({ nome: nome.trim(), nivel })

const montarExperiencia = ({ empresa, cargo, dataInicio, dataFim, empregoAtual }: LinhaExperiencia) => ({
  empresa: empresa.trim(),
  cargo: cargo.trim(),
  dataInicio,
  dataFim: empregoAtual ? null : dataFim || null,
  empregoAtual,
})

const montarFormacao = ({ instituicao, curso, anoInicio, anoFim, status }: LinhaFormacao) => ({
  instituicao: instituicao.trim(),
  curso: curso.trim(),
  anoInicio: Number(anoInicio),
  anoFim: anoFim ? Number(anoFim) : null,
  status,
})

const mudou = (dados: Record<string, unknown>, original: Record<string, unknown>) =>
  Object.keys(dados).some((campo) => dados[campo] !== original[campo])

/**
 * Aplica as linhas do formulário na API: exclui o que saiu, atualiza o que mudou e cria o novo.
 * Campos que a tela não mostra, como `descricao`, são preservados a partir do original.
 */
async function sincronizar<L extends { id?: number }, O extends { id: number }>({
  api,
  linhas,
  originais,
  montar,
  dono,
}: {
  api: RecursoApi
  linhas: L[]
  originais: O[]
  montar: (linha: L) => Record<string, unknown>
  dono: { usuario: { id: number } }
}) {
  const mantidos = new Set(linhas.map(({ id }) => id).filter(Boolean))

  for (const original of originais) {
    if (!mantidos.has(original.id)) await api.excluir(original.id)
  }

  for (const linha of linhas) {
    const dados = montar(linha)
    const original = originais.find(({ id }) => id === linha.id)
    if (!original) await api.cadastrar({ ...dados, ...dono })
    else if (mudou(dados, original as unknown as Record<string, unknown>)) {
      await api.atualizar(original.id, { ...original, ...dados, ...dono })
    }
  }
}

/** Certificados não são editados: só entram novos arquivos e saem os removidos. */
async function sincronizarCertificados(linhas: LinhaCertificado[], originais: Array<{ id: number }>, dono: { usuario: { id: number } }) {
  const mantidos = new Set(linhas.map(({ id }) => id).filter(Boolean))
  for (const original of originais) {
    if (!mantidos.has(original.id)) await CertificacaoAPI.excluir(original.id)
  }
  for (const { arquivo } of linhas) {
    if (arquivo) {
      await CertificacaoAPI.cadastrar({ nomeCurso: semExtensao(arquivo.name), dataConclusao: dataDeHoje(), ...dono }, arquivo)
    }
  }
}

/**
 * Sem `usuarioId` cria o usuário com POST. Com `usuarioId`, usa PUT e nunca duplica o cadastro.
 * `original` traz o que veio da API, para comparar as linhas.
 */
export async function salvarCadastro({
  usuarioId,
  valores,
  original,
}: {
  usuarioId: string | null
  valores: ValoresCadastro
  original?: Colaborador | null
}): Promise<string> {
  let id = usuarioId

  if (id) await UsuarioAPI.atualizar(id, montarUsuario(valores))
  else id = String((await UsuarioAPI.cadastrar(montarUsuario(valores))).id)

  const dono = { usuario: { id: Number(id) } }

  try {
    if (valores.foto) await UsuarioAPI.enviarFoto(id, valores.foto)
    await sincronizar({
      api: IdiomaAPI,
      linhas: valores.idiomas.filter(preenchidoNome),
      originais: original?.idiomas ?? [],
      montar: montarNivel,
      dono,
    })
    await sincronizar({
      api: TecnologiaAPI,
      linhas: valores.tecnologias.filter(preenchidoNome),
      originais: original?.tecnologias ?? [],
      montar: montarNivel,
      dono,
    })
    await sincronizar({
      api: ExperienciaAPI,
      linhas: valores.experiencias.filter(preenchidaExperiencia),
      originais: original?.experiencias ?? [],
      montar: montarExperiencia,
      dono,
    })
    await sincronizar({
      api: FormacaoAPI,
      linhas: valores.formacoes.filter(preenchidaFormacao),
      originais: original?.formacoes ?? [],
      montar: montarFormacao,
      dono,
    })
    await sincronizarCertificados(valores.certificados, original?.certificacoes ?? [], dono)
  } catch (causa) {
    throw new ErroSalvamentoParcial(id, causa)
  }

  return id
}
