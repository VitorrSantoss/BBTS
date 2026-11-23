import { useId, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useFieldArray, useForm, useWatch, type UseFormRegister, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import {
  Briefcase,
  Camera,
  FileDown,
  FileText,
  GraduationCap,
  KeyRound,
  Languages,
  Plus,
  Save,
  Trash2,
  UserRound,
  Wrench,
} from 'lucide-react'
import { Avatar, Button, Checkbox, ErrorState, Input, LoadingState, PageHeader, Select, Skeleton, toast } from '@/components/ui'
import { chaves, useMeusDados } from '@/hooks/useColaborador'
import { ErroSalvamentoParcial, mensagemDeErro, salvarCadastro, type ValoresCadastro } from '@/services/cadastro'
import { gerarFichaPdf } from '@/services/gerarPdf'
import { useSessao } from '@/services/sessao'
import type { Colaborador } from '@/types/dominio'
import { cx } from '@/utils/classes'
import { NIVEIS_IDIOMA, NIVEIS_TECNOLOGIA, STATUS_FORMACAO } from '@/utils/formatadores'
import { mascararCpf, mascararTelefone } from '@/utils/mascaras'
import { cpf, emailObrigatorio, obrigatorio, telefone } from '@/utils/validacao'

/* ───────────────────────────── Modelo e validação ───────────────────────────── */

const linhaNivel = z.object({ id: z.number().optional(), nome: z.string().max(50, 'Use até 50 caracteres.'), nivel: z.string() })
const linhaExperiencia = z.object({
  id: z.number().optional(),
  empresa: z.string().max(200),
  cargo: z.string().max(150),
  dataInicio: z.string(),
  dataFim: z.string(),
  empregoAtual: z.boolean(),
})
const linhaFormacao = z.object({
  id: z.number().optional(),
  instituicao: z.string().max(150),
  curso: z.string().max(150),
  anoInicio: z.string(),
  anoFim: z.string(),
  status: z.enum(['CURSANDO', 'CONCLUIDO']),
})
const linhaCertificado = z.object({ id: z.number().optional(), nomeCurso: z.string().optional(), arquivo: z.custom<File | null>() })

const ANO_MINIMO = 1950
const ANO_MAXIMO = new Date().getFullYear() + 10
const anoValido = (ano: string) => /^\d{4}$/.test(ano) && Number(ano) >= ANO_MINIMO && Number(ano) <= ANO_MAXIMO

/** No cadastro novo a senha é obrigatória; na edição ela não aparece. */
const criarEsquema = (edicao: boolean) =>
  z
    .object({
      nome: obrigatorio('Informe o nome completo.').max(200),
      cpf,
      area: z.string().max(120),
      email: emailObrigatorio,
      telefone,
      dataNascimento: obrigatorio('Informe a data de nascimento.'),
      senha: z.string(),
      confirmacaoSenha: z.string(),
      foto: z.custom<File | null>(),
      idiomas: z.array(linhaNivel),
      tecnologias: z.array(linhaNivel),
      experiencias: z.array(linhaExperiencia),
      formacoes: z.array(linhaFormacao),
      certificados: z.array(linhaCertificado),
    })
    .superRefine((v, ctx) => {
      if (!edicao) {
        if (v.senha.length < 6) ctx.addIssue({ code: 'custom', path: ['senha'], message: 'A senha precisa ter no mínimo 6 caracteres.' })
        else if (v.senha !== v.confirmacaoSenha) {
          ctx.addIssue({ code: 'custom', path: ['confirmacaoSenha'], message: 'As senhas não conferem.' })
        }
      }
      v.formacoes.forEach((f, i) => {
        const emBranco = !f.instituicao.trim() && !f.curso.trim() && !f.anoInicio
        if (emBranco && !f.id) return
        if (!f.instituicao.trim())
          ctx.addIssue({ code: 'custom', path: ['formacoes', i, 'instituicao'], message: 'Informe a instituição.' })
        if (!f.curso.trim()) ctx.addIssue({ code: 'custom', path: ['formacoes', i, 'curso'], message: 'Informe o curso.' })
        if (!anoValido(f.anoInicio)) {
          ctx.addIssue({ code: 'custom', path: ['formacoes', i, 'anoInicio'], message: `Use um ano entre ${ANO_MINIMO} e ${ANO_MAXIMO}.` })
        }
        if (f.anoFim && !anoValido(f.anoFim)) {
          ctx.addIssue({ code: 'custom', path: ['formacoes', i, 'anoFim'], message: `Use um ano entre ${ANO_MINIMO} e ${ANO_MAXIMO}.` })
        } else if (f.anoFim && anoValido(f.anoInicio) && Number(f.anoFim) < Number(f.anoInicio)) {
          ctx.addIssue({ code: 'custom', path: ['formacoes', i, 'anoFim'], message: 'O fim não pode ser antes do início.' })
        }
      })
      // Linhas novas em branco são ignoradas. Linha existente sem nome pede a remoção.
      ;(['idiomas', 'tecnologias'] as const).forEach((lista) =>
        v[lista].forEach((l, i) => {
          if (l.id && !l.nome.trim()) {
            ctx.addIssue({
              code: 'custom',
              path: [lista, i, 'nome'],
              message: `Informe ${lista === 'idiomas' ? 'o idioma' : 'a tecnologia'} ou remova a linha.`,
            })
          }
        }),
      )
      v.experiencias.forEach((e, i) => {
        const emBranco = !e.empresa.trim() && !e.cargo.trim() && !e.dataInicio
        if (emBranco && !e.id) return
        if (!e.empresa.trim()) ctx.addIssue({ code: 'custom', path: ['experiencias', i, 'empresa'], message: 'Informe a empresa.' })
        if (!e.cargo.trim()) ctx.addIssue({ code: 'custom', path: ['experiencias', i, 'cargo'], message: 'Informe o cargo.' })
        if (!e.dataInicio) ctx.addIssue({ code: 'custom', path: ['experiencias', i, 'dataInicio'], message: 'Informe a data de início.' })
        if (!e.empregoAtual && e.dataFim && e.dataInicio && e.dataFim < e.dataInicio) {
          ctx.addIssue({ code: 'custom', path: ['experiencias', i, 'dataFim'], message: 'O fim não pode ser antes do início.' })
        }
      })
    })

type Formulario = z.infer<ReturnType<typeof criarEsquema>>

const novoIdioma = () => ({ nome: '', nivel: 'INTERMEDIARIO' })
const novaTecnologia = () => ({ nome: '', nivel: 'PLENO' })
const novaExperiencia = () => ({ empresa: '', cargo: '', dataInicio: '', dataFim: '', empregoAtual: false })
const novaFormacao = () => ({ instituicao: '', curso: '', anoInicio: '', anoFim: '', status: 'CONCLUIDO' as const })
const novoCertificado = () => ({ arquivo: null })

const formularioVazio = (): Formulario => ({
  nome: '',
  cpf: '',
  area: '',
  email: '',
  telefone: '',
  dataNascimento: '',
  senha: '',
  confirmacaoSenha: '',
  foto: null,
  idiomas: [novoIdioma()],
  tecnologias: [novaTecnologia()],
  experiencias: [novaExperiencia()],
  formacoes: [novaFormacao()],
  certificados: [novoCertificado()],
})

/** Preenche o formulário com os dados existentes, para a edição. */
const formularioDoColaborador = (c: Colaborador): Formulario => ({
  nome: c.nome ?? '',
  cpf: mascararCpf(c.cpf),
  area: c.area ?? '',
  email: c.email ?? '',
  telefone: mascararTelefone(c.telefone),
  dataNascimento: c.dataNascimento ?? '',
  senha: '',
  confirmacaoSenha: '',
  foto: null,
  idiomas: c.idiomas.map(({ id, nome, nivel }) => ({ id, nome, nivel })),
  tecnologias: c.tecnologias.map(({ id, nome, nivel }) => ({ id, nome, nivel })),
  experiencias: c.experiencias.map((e) => ({
    id: e.id,
    empresa: e.empresa,
    cargo: e.cargo,
    dataInicio: e.dataInicio,
    dataFim: e.dataFim ?? '',
    empregoAtual: Boolean(e.empregoAtual),
  })),
  formacoes: c.formacoes.map((f) => ({
    id: f.id,
    instituicao: f.instituicao,
    curso: f.curso,
    anoInicio: String(f.anoInicio),
    anoFim: f.anoFim ? String(f.anoFim) : '',
    status: f.status,
  })),
  certificados: c.certificacoes.map((cert) => ({ id: cert.id, nomeCurso: cert.nomeCurso, arquivo: null })),
})

/* ───────────────────────────── Peças visuais ───────────────────────────── */

function Secao({
  id,
  titulo,
  icone,
  descricao,
  children,
}: {
  id: string
  titulo: string
  icone: ReactNode
  descricao?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="scroll-mt-6 rounded-xl border border-primary-100 bg-surface p-5 shadow-xs sm:p-6"
    >
      <header className="mb-5 flex items-start gap-3">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary [&>svg]:size-[18px]"
        >
          {icone}
        </span>
        <div>
          <h2 id={`${id}-titulo`} className="text-lg font-bold text-primary">
            {titulo}
          </h2>
          {descricao && <p className="text-sm text-fg-muted">{descricao}</p>}
        </div>
      </header>
      {children}
    </section>
  )
}

/** Linhas dinâmicas. Ao remover, o foco vai para "Adicionar", para o teclado não perder o lugar. */
function Linhas({
  quantidade,
  nomeDoItem,
  rotuloAdicionar,
  aoAdicionar,
  aoRemover,
  renderizar,
}: {
  quantidade: number
  nomeDoItem: string
  rotuloAdicionar: string
  aoAdicionar: () => void
  aoRemover: (i: number) => void
  renderizar: (i: number) => ReactNode
}) {
  const refAdicionar = useRef<HTMLButtonElement>(null)
  return (
    <div className="flex flex-col gap-3">
      {quantidade > 0 && (
        <ul className="flex flex-col divide-y divide-primary-100">
          {Array.from({ length: quantidade }, (_, i) => (
            <li key={i} className="flex items-start gap-2 py-3 first:pt-0">
              <div className="min-w-0 flex-1">{renderizar(i)}</div>
              <Button
                variante="fantasma"
                somenteIcone
                icone={<Trash2 aria-hidden className="size-4" />}
                className="mt-7"
                onClick={() => {
                  aoRemover(i)
                  refAdicionar.current?.focus()
                }}
              >
                {`Remover ${nomeDoItem} ${i + 1}`}
              </Button>
            </li>
          ))}
        </ul>
      )}
      <Button
        ref={refAdicionar}
        variante="fantasma"
        tamanho="sm"
        icone={<Plus aria-hidden className="size-4" />}
        onClick={aoAdicionar}
        className="self-start"
      >
        {rotuloAdicionar}
      </Button>
    </div>
  )
}

/** Foto com prévia dentro do círculo. O arquivo vai para a API quando o formulário é salvo. */
function FotoPerfil({ fotoAtual, nome, aoEscolher }: { fotoAtual: string | null; nome: string; aoEscolher: (foto: File) => void }) {
  const id = useId()
  const [previa, setPrevia] = useState<string | null>(null)
  const [erro, setErro] = useState('')

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <input
        id={id}
        type="file"
        accept="image/*"
        className="peer sr-only"
        aria-describedby={`${id}-dica`}
        onChange={(e) => {
          const arquivo = e.target.files?.[0]
          if (!arquivo) return
          if (!arquivo.type.startsWith('image/')) {
            setErro('Escolha um arquivo de imagem.')
            return
          }
          if (arquivo.size > TAMANHO_MAXIMO_DA_FOTO) {
            setErro('A foto pode ter no máximo 5 MB.')
            return
          }
          setErro('')
          aoEscolher(arquivo)
          const leitor = new FileReader()
          leitor.onload = () => setPrevia(String(leitor.result))
          leitor.readAsDataURL(arquivo)
        }}
      />
      <label
        htmlFor={id}
        className="group relative cursor-pointer rounded-full peer-focus-visible:outline-3 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-primary"
      >
        <Avatar src={previa ?? fotoAtual} alt={nome ? `Foto de ${nome}` : 'Prévia da foto de perfil'} tamanho={120} borda="azul" />
        <span
          aria-hidden
          className="absolute right-0 bottom-0 flex size-9 items-center justify-center rounded-full bg-accent text-primary shadow-md ring-2 ring-surface"
        >
          <Camera className="size-4" />
        </span>
        <span className="sr-only">Escolher foto de perfil</span>
      </label>
      <div>
        <p className="text-sm font-semibold text-primary">Foto de perfil</p>
        <p id={`${id}-dica`} className="text-xs text-fg-muted">
          JPG, PNG ou WebP, até 5 MB.
        </p>
      </div>
      {erro && (
        <p role="alert" className="text-xs font-semibold text-primary-deep">
          {erro}
        </p>
      )}
    </div>
  )
}

const TAMANHO_MAXIMO_DA_FOTO = 5 * 1024 * 1024

function CamposNivel({
  lista,
  i,
  register,
  errors,
  rotulo,
  opcoes,
  placeholder,
}: {
  lista: 'idiomas' | 'tecnologias'
  i: number
  register: UseFormRegister<Formulario>
  errors: FieldErrors<Formulario>
  rotulo: string
  opcoes: Array<{ valor: string; rotulo: string }>
  placeholder: string
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
      <Input
        {...register(`${lista}.${i}.nome`)}
        label={rotulo}
        placeholder={placeholder}
        maxLength={50}
        erro={errors[lista]?.[i]?.nome?.message}
      />
      <Select {...register(`${lista}.${i}.nivel`)} label="Nível" opcoes={opcoes} />
    </div>
  )
}

const SECOES = [
  { id: 'dados', rotulo: 'Dados pessoais' },
  { id: 'idiomas', rotulo: 'Idiomas' },
  { id: 'tecnologias', rotulo: 'Tecnologias' },
  { id: 'experiencias', rotulo: 'Experiência' },
  { id: 'formacoes', rotulo: 'Formação' },
  { id: 'certificados', rotulo: 'Certificados' },
]

/* ───────────────────────────── Formulário ───────────────────────────── */

/** Formulário de `/cadastro` (POST) e `/colaborador/editar` (PUT). */
function FormularioCadastro({
  inicial,
  original,
  usuarioId,
  edicao = false,
  aoRecarregar,
  fotoAtual = null,
}: {
  inicial: Formulario
  original?: Colaborador | null
  usuarioId?: string | null
  edicao?: boolean
  aoRecarregar?: () => void
  fotoAtual?: string | null
}) {
  const navegar = useNavigate()
  const queryClient = useQueryClient()
  const escolherPerfil = useSessao((s) => s.escolherPerfil)
  const salvarUsuarioId = useSessao((s) => s.salvarUsuarioId)
  const [gerandoPdf, setGerandoPdf] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Formulario>({ resolver: zodResolver(criarEsquema(edicao)), defaultValues: inicial })

  const idiomas = useFieldArray({ control, name: 'idiomas' })
  const tecnologias = useFieldArray({ control, name: 'tecnologias' })
  const experiencias = useFieldArray({ control, name: 'experiencias' })
  const formacoes = useFieldArray({ control, name: 'formacoes' })
  const certificados = useFieldArray({ control, name: 'certificados' })

  const nome = useWatch({ control, name: 'nome' })
  const empregoAtual = (useWatch({ control, name: 'experiencias' }) ?? []).map((e) => e?.empregoAtual)

  const atualizarCache = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: chaves.colaboradores }),
      queryClient.invalidateQueries({ queryKey: ['usuario'] }),
      queryClient.invalidateQueries({ queryKey: chaves.equipes }),
    ])

  const aoEnviar = async (dados: Formulario) => {
    try {
      const id = await salvarCadastro({ usuarioId: usuarioId ?? null, valores: dados as ValoresCadastro, original })
      salvarUsuarioId(id)
      escolherPerfil('colaborador')
      await atualizarCache()
      toast.sucesso(edicao ? 'Alterações salvas.' : 'Cadastro concluído. Bem-vindo!')
      navegar('/colaborador', { viewTransition: true })
    } catch (erro) {
      if (!(erro instanceof ErroSalvamentoParcial)) {
        toast.erro(mensagemDeErro(erro))
        return
      }
      // O usuário já existe: recarregar evita repetir os itens que chegaram a ser salvos.
      salvarUsuarioId(erro.usuarioId)
      escolherPerfil('colaborador')
      await atualizarCache()
      toast.erro('Os dados pessoais foram salvos, mas parte do restante falhou. Revise e salve de novo.')
      if (edicao) aoRecarregar?.()
      else navegar('/colaborador/editar', { replace: true })
    }
  }

  const gerarPdf = async () => {
    setGerandoPdf(true)
    try {
      await gerarFichaPdf(getValues() as ValoresCadastro)
      toast.sucesso('Ficha em PDF gerada.')
    } catch {
      toast.erro('Não foi possível gerar o PDF. Tente de novo.')
    } finally {
      setGerandoPdf(false)
    }
  }

  const tituloPagina = edicao ? 'Meus dados' : 'Cadastro de colaborador'

  return (
    <form noValidate onSubmit={handleSubmit(aoEnviar)} className="flex flex-col gap-6">
      <PageHeader titulo={tituloPagina} descricao="Mantenha seus dados, idiomas, tecnologias e experiências em dia." />

      <div className="grid items-start gap-6 *:min-w-0 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Secao id="dados" titulo="Dados pessoais" icone={<UserRound />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('nome')}
                label="Nome completo"
                autoComplete="name"
                maxLength={200}
                placeholder="Digite seu nome completo"
                required
                erro={errors.nome?.message}
              />
              <Input
                {...register('cpf', { onChange: (e) => setValue('cpf', mascararCpf(e.target.value)) })}
                label="CPF"
                inputMode="numeric"
                placeholder="000.000.000-00"
                required
                erro={errors.cpf?.message}
              />
              <Input {...register('area')} label="Área de atuação" maxLength={120} placeholder="Ex.: Desenvolvimento Back-End" />
              <Input
                {...register('email')}
                label="E-mail"
                type="email"
                autoComplete="email"
                maxLength={150}
                placeholder="seu.email@bbts.com.br"
                required
                erro={errors.email?.message}
              />
              <Input
                {...register('telefone', { onChange: (e) => setValue('telefone', mascararTelefone(e.target.value)) })}
                label="Telefone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="(00) 00000-0000"
                erro={errors.telefone?.message}
              />
              <Input
                {...register('dataNascimento')}
                label="Data de nascimento"
                type="date"
                autoComplete="bday"
                required
                erro={errors.dataNascimento?.message}
              />
            </div>
          </Secao>

          {!edicao && (
            <Secao id="acesso" titulo="Acesso" icone={<KeyRound />} descricao="Você entra no sistema com o e-mail e esta senha.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  {...register('senha')}
                  label="Senha"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mínimo de 6 caracteres"
                  required
                  erro={errors.senha?.message}
                />
                <Input
                  {...register('confirmacaoSenha')}
                  label="Confirme a senha"
                  type="password"
                  autoComplete="new-password"
                  required
                  erro={errors.confirmacaoSenha?.message}
                />
              </div>
            </Secao>
          )}

          <Secao id="idiomas" titulo="Idiomas" icone={<Languages />}>
            <Linhas
              quantidade={idiomas.fields.length}
              nomeDoItem="idioma"
              rotuloAdicionar="Adicionar idioma"
              aoAdicionar={() => idiomas.append(novoIdioma())}
              aoRemover={idiomas.remove}
              renderizar={(i) => (
                <CamposNivel
                  key={idiomas.fields[i]?.id}
                  lista="idiomas"
                  i={i}
                  register={register}
                  errors={errors}
                  rotulo="Idioma"
                  opcoes={NIVEIS_IDIOMA}
                  placeholder="Ex.: Inglês"
                />
              )}
            />
          </Secao>

          <Secao id="tecnologias" titulo="Tecnologias" icone={<Wrench />}>
            <Linhas
              quantidade={tecnologias.fields.length}
              nomeDoItem="tecnologia"
              rotuloAdicionar="Adicionar tecnologia"
              aoAdicionar={() => tecnologias.append(novaTecnologia())}
              aoRemover={tecnologias.remove}
              renderizar={(i) => (
                <CamposNivel
                  key={tecnologias.fields[i]?.id}
                  lista="tecnologias"
                  i={i}
                  register={register}
                  errors={errors}
                  rotulo="Tecnologia"
                  opcoes={NIVEIS_TECNOLOGIA}
                  placeholder="Ex.: JavaScript"
                />
              )}
            />
          </Secao>

          <Secao id="experiencias" titulo="Experiência" icone={<Briefcase />}>
            <Linhas
              quantidade={experiencias.fields.length}
              nomeDoItem="experiência"
              rotuloAdicionar="Adicionar experiência"
              aoAdicionar={() => experiencias.append(novaExperiencia())}
              aoRemover={experiencias.remove}
              renderizar={(i) => {
                const erro = errors.experiencias?.[i]
                return (
                  <div key={experiencias.fields[i]?.id} className="grid gap-3 sm:grid-cols-2">
                    <Input
                      {...register(`experiencias.${i}.empresa`)}
                      label="Empresa"
                      maxLength={200}
                      placeholder="Nome da empresa"
                      erro={erro?.empresa?.message}
                    />
                    <Input
                      {...register(`experiencias.${i}.cargo`)}
                      label="Cargo"
                      maxLength={150}
                      placeholder="Ex.: Estágio de T.I"
                      erro={erro?.cargo?.message}
                    />
                    <Input {...register(`experiencias.${i}.dataInicio`)} label="Início" type="date" erro={erro?.dataInicio?.message} />
                    <Input
                      {...register(`experiencias.${i}.dataFim`)}
                      label="Fim"
                      type="date"
                      disabled={empregoAtual[i]}
                      erro={erro?.dataFim?.message}
                    />
                    <Checkbox
                      {...register(`experiencias.${i}.empregoAtual`, {
                        onChange: (e) => e.target.checked && setValue(`experiencias.${i}.dataFim`, ''),
                      })}
                      label="Emprego atual"
                    />
                  </div>
                )
              }}
            />
          </Secao>

          <Secao id="formacoes" titulo="Formação acadêmica" icone={<GraduationCap />}>
            <Linhas
              quantidade={formacoes.fields.length}
              nomeDoItem="formação"
              rotuloAdicionar="Adicionar formação"
              aoAdicionar={() => formacoes.append(novaFormacao())}
              aoRemover={formacoes.remove}
              renderizar={(i) => {
                const erro = errors.formacoes?.[i]
                return (
                  <div key={formacoes.fields[i]?.id} className="grid gap-3 sm:grid-cols-2">
                    <Input
                      {...register(`formacoes.${i}.instituicao`)}
                      label="Instituição"
                      maxLength={150}
                      placeholder="Ex.: Faculdade Senac"
                      erro={erro?.instituicao?.message}
                    />
                    <Input
                      {...register(`formacoes.${i}.curso`)}
                      label="Curso"
                      maxLength={150}
                      placeholder="Ex.: Análise e Desenvolvimento de Sistemas"
                      erro={erro?.curso?.message}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        {...register(`formacoes.${i}.anoInicio`)}
                        label="Início"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="2022"
                        erro={erro?.anoInicio?.message}
                      />
                      <Input
                        {...register(`formacoes.${i}.anoFim`)}
                        label="Fim"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="2025"
                        erro={erro?.anoFim?.message}
                      />
                    </div>
                    <Select {...register(`formacoes.${i}.status`)} label="Situação" opcoes={STATUS_FORMACAO} />
                  </div>
                )
              }}
            />
          </Secao>

          <Secao id="certificados" titulo="Certificados" icone={<FileText />} descricao="Envie o certificado em PDF.">
            <Linhas
              quantidade={certificados.fields.length}
              nomeDoItem="certificado"
              rotuloAdicionar="Adicionar arquivo"
              aoAdicionar={() => certificados.append(novoCertificado())}
              aoRemover={certificados.remove}
              renderizar={(i) => {
                const campo = certificados.fields[i]
                return campo?.id && getValues(`certificados.${i}.id`) ? (
                  <p className="mt-7 flex items-center gap-2 rounded-md bg-primary-50 px-3 py-2.5 text-sm font-semibold text-primary">
                    <FileText aria-hidden className="size-4" />
                    {getValues(`certificados.${i}.nomeCurso`)}
                  </p>
                ) : (
                  <Input
                    key={campo?.id}
                    label="Arquivo do certificado"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setValue(`certificados.${i}.arquivo`, e.target.files?.[0] ?? null, { shouldDirty: true })}
                  />
                )
              }}
            />
          </Secao>
        </div>

        <aside aria-label="Foto e ações" className="flex flex-col gap-4 lg:sticky lg:top-6">
          <div className="flex flex-col gap-5 rounded-xl border border-primary-100 bg-surface p-6 shadow-sm">
            <FotoPerfil fotoAtual={fotoAtual} nome={nome} aoEscolher={(foto) => setValue('foto', foto, { shouldDirty: true })} />
            <div className="grid grid-cols-2 gap-2">
              <Button variante="secundario" para={edicao ? '/colaborador' : '/'}>
                Voltar
              </Button>
              <Button type="submit" carregando={isSubmitting} icone={<Save aria-hidden className="size-4" />}>
                Salvar
              </Button>
            </div>
            <Button variante="fantasma" carregando={gerandoPdf} icone={<FileDown aria-hidden className="size-4" />} onClick={gerarPdf}>
              Gerar ficha em PDF
            </Button>
            {isSubmitting && (
              <p role="status" className="rounded-md bg-primary-50 p-3 text-xs text-fg-muted">
                Salvando seus dados na API…
              </p>
            )}
            {isDirty && !isSubmitting && <p className="text-center text-xs text-fg-muted">Você tem alterações não salvas.</p>}
          </div>
          <nav aria-label="Seções do formulário" className="hidden rounded-xl border border-primary-100 bg-surface p-3 lg:block">
            <ul className="flex flex-col">
              {SECOES.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={cx('block rounded-md px-3 py-2 text-sm font-semibold text-fg-muted hover:bg-primary-50 hover:text-primary')}
                  >
                    {s.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </form>
  )
}

/* ───────────────────────────── Rotas ───────────────────────────── */

/** `/cadastro`: novo colaborador. */
export function NovoCadastro() {
  const [inicial] = useState(formularioVazio)
  return <FormularioCadastro inicial={inicial} />
}

/**
 * `/colaborador/editar`. Sem os dados atuais a edição fica bloqueada:
 * salvar um formulário vazio faria o PUT apagar o que já está na API.
 */
export function EdicaoDeCadastro() {
  const { colaborador, erro, carregando, recarregar, recarregando } = useMeusDados()
  const usuarioId = useSessao((s) => s.usuarioId)

  if (carregando) {
    return (
      <LoadingState consultaApi>
        <Skeleton className="h-9 w-72 bg-on-primary-soft" />
        <div className="grid gap-6 *:min-w-0 lg:grid-cols-[minmax(0,1fr)_300px]">
          <Skeleton className="h-[560px] rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </LoadingState>
    )
  }

  if (erro || !colaborador) {
    return (
      <>
        <h1 className="sr-only">Editar meus dados</h1>
        <ErrorState
          titulo="Não foi possível carregar seu cadastro"
          descricao="Sem os dados atuais, salvar agora poderia apagar informações. Tenta de novo?"
          aoTentarDeNovo={recarregar}
          tentando={recarregando}
        />
      </>
    )
  }

  return (
    <FormularioCadastro
      key={colaborador.id}
      edicao
      inicial={formularioDoColaborador(colaborador)}
      original={colaborador}
      usuarioId={usuarioId}
      aoRecarregar={recarregar}
      fotoAtual={colaborador.foto}
    />
  )
}
