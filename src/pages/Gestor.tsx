import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronRight,
  Gauge,
  Layers,
  MessageSquare,
  Plus,
  Save,
  Send,
  UserPlus,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { CartaoColaborador, PainelCompetencias } from '@/components/colaborador'
import { CompetencyBar } from '@/components/competencias'
import { FormConvite, FormFeedback, FormNovaEquipe } from '@/components/gestor'
import {
  Avatar,
  AvatarStack,
  BarraProgresso,
  Button,
  Card,
  Dialog,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Select,
  Skeleton,
  StatCard,
  Tag,
  toast,
} from '@/components/ui'
import { chaves, useCatalogo, useColaborador, useFeedbacksEnviados, useUsuarioLogado } from '@/hooks/useColaborador'
import { useEquipe, useMinhasEquipes, type ResumoEquipe } from '@/hooks/useEquipes'
import { ErroApi, mensagemDaApi, UsuarioAPI } from '@/services/api'
import { useSessao } from '@/services/sessao'
import type { Competencia, Membro, Pessoa } from '@/types/dominio'
import { aderenciaAoMinimo, calcularNivelTotal, competenciasAbaixoDoMinimo, membrosQueAtendem, type Minimos } from '@/utils/competencias'
import { minimosDe, tituloEquipe } from '@/utils/equipes'
import { primeiroNome, rotuloDeMembros } from '@/utils/formatadores'
import { ColaboradorNaoEncontrado } from './Colaborador'

/** Quantas pessoas aparecem em "Conversas recentes". */
const CONVERSAS_RECENTES = 5

const naoEncontrado = (erro: unknown) => erro instanceof ErroApi && erro.status === 404

/* ───────────────────────────── /gestor ───────────────────────────── */

function CartaoEquipe({ resumo }: { resumo: ResumoEquipe }) {
  const { equipe, aderencia, abaixoDoMinimo } = resumo
  const { membros } = equipe
  return (
    <Link
      to={`/gestor/equipes/${equipe.id}`}
      viewTransition
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-primary-100 bg-surface transition-[border-color,box-shadow] duration-(--dur-base) hover:border-primary-300 hover:shadow-md"
    >
      <span className="relative block aspect-[16/9] overflow-hidden bg-primary-50">
        <img
          src={equipe.foto}
          alt=""
          width={800}
          height={600}
          loading="lazy"
          className="size-full object-cover transition-transform duration-(--dur-lenta) ease-(--ease-saida) group-hover:scale-[1.03]"
        />
        <Tag variante="chip" className="absolute top-3 left-3">
          {tituloEquipe(equipe)}
        </Tag>
      </span>
      <span className="flex flex-1 flex-col gap-4 p-4">
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-fg">{equipe.foco}</span>
          <span className="text-xs text-fg-muted">{rotuloDeMembros(membros.length)}</span>
        </span>
        <span className="mt-auto flex flex-col gap-3">
          {aderencia === null ? (
            <span className="text-xs text-fg-muted">Convide membros para acompanhar a aderência.</span>
          ) : (
            <span className="flex flex-col gap-1.5">
              <span className="flex items-center justify-between text-xs">
                <span className="font-semibold text-fg-muted">Aderência aos mínimos</span>
                <span className="font-bold text-primary tabular">{aderencia}%</span>
              </span>
              <BarraProgresso valor={aderencia} rotulo={`Aderência da equipe ${equipe.nome}`} />
            </span>
          )}
          <span className="flex items-center justify-between gap-2">
            <AvatarStack pessoas={membros} tamanho={28} />
            {abaixoDoMinimo > 0 ? (
              <Tag variante="chip">
                <ArrowDown aria-hidden className="size-3" />
                {abaixoDoMinimo} abaixo
              </Tag>
            ) : membros.length > 0 ? (
              <Tag variante="primaria">
                <Check aria-hidden className="size-3" />
                Todos atendem
              </Tag>
            ) : null}
          </span>
        </span>
      </span>
    </Link>
  )
}

/** Pessoas que receberam os feedbacks mais recentes do gestor, sem repetir. */
function conversasRecentes(destinatarios: Pessoa[]): Pessoa[] {
  const vistas = new Set<number>()
  return destinatarios.filter(({ id }) => !vistas.has(id) && vistas.add(id)).slice(0, CONVERSAS_RECENTES)
}

export function GestorHome() {
  const navegar = useNavigate()
  const { data: equipes, isPending, error, refetch, isFetching } = useMinhasEquipes()
  const { data: usuario } = useUsuarioLogado()
  const usuarioId = useSessao((s) => s.usuarioId)
  const enviados = useFeedbacksEnviados(usuarioId)
  const [novaEquipe, setNovaEquipe] = useState(false)

  if (isPending) {
    return (
      <LoadingState>
        <Skeleton className="h-9 w-64 bg-on-primary-soft" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 *:min-w-0 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Skeleton className="h-[480px] rounded-xl" />
          <Skeleton className="h-[480px] rounded-xl" />
        </div>
      </LoadingState>
    )
  }

  if (error || !equipes) {
    return (
      <>
        <h1 className="sr-only">Dashboard do gestor</h1>
        <ErrorState titulo="Não conseguimos carregar suas equipes" aoTentarDeNovo={() => void refetch()} tentando={isFetching} />
      </>
    )
  }

  const conversas = conversasRecentes((enviados.data ?? []).map((f) => f.destinatario))
  const pessoas = new Set(equipes.flatMap((e) => e.equipe.membros.map((m) => m.id)))
  const comAderencia = equipes.filter((e) => e.aderencia !== null)
  const aderenciaMedia = comAderencia.length
    ? Math.round(comAderencia.reduce((s, e) => s + (e.aderencia ?? 0), 0) / comAderencia.length)
    : 0
  const abaixo = equipes.reduce((s, e) => s + e.abaixoDoMinimo, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        titulo={usuario ? `Olá, ${primeiroNome(usuario.nome)}!` : 'Olá!'}
        descricao="Acompanhe suas equipes e retome as conversas recentes."
        acoes={
          <Button variante="destaque" icone={<Plus aria-hidden className="size-4" />} onClick={() => setNovaEquipe(true)}>
            Nova equipe
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard rotulo="Equipes" valor={equipes.length} icone={<UsersRound />} apoio={`${comAderencia.length} com membros`} />
        <StatCard rotulo="Colaboradores" valor={pessoas.size} icone={<UserRound />} apoio="Nas suas equipes" />
        <StatCard rotulo="Aderência média" valor={aderenciaMedia} sufixo="%" icone={<Gauge />} apoio="Competências mínimas atendidas" />
        <StatCard
          rotulo="Abaixo do mínimo"
          valor={abaixo}
          icone={<ArrowDown />}
          apoio="Pessoas com ao menos uma lacuna"
          destaque={abaixo > 0}
        />
      </div>

      <div className="grid gap-6 *:min-w-0 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card titulo="Suas equipes" descricao="Clique em uma equipe para ver membros e competências mínimas.">
          {equipes.length === 0 ? (
            <EmptyState titulo="Nenhuma equipe por aqui ainda" descricao="Crie a primeira e convide os colaboradores.">
              <Button icone={<Plus aria-hidden className="size-4" />} onClick={() => setNovaEquipe(true)}>
                Nova equipe
              </Button>
            </EmptyState>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {equipes.map((r) => (
                <li key={r.equipe.id}>
                  <CartaoEquipe resumo={r} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card titulo="Conversas recentes" acoes={<MessageSquare aria-hidden className="size-5 text-primary" />}>
          {enviados.isPending ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : enviados.error ? (
            <ErrorState
              variante="aviso"
              titulo="Não conseguimos carregar as conversas"
              aoTentarDeNovo={() => void enviados.refetch()}
              tentando={enviados.isFetching}
            />
          ) : conversas.length === 0 ? (
            <EmptyState
              compacto
              icone={<MessageSquare />}
              titulo="Nenhuma conversa recente"
              descricao="Quem receber um feedback seu aparece aqui."
            />
          ) : (
            <ul className="-mx-2 flex flex-col">
              {conversas.map(({ id, nome, foto, area }) => (
                <li key={id}>
                  <Link
                    to={`/gestor/colaboradores/${id}`}
                    viewTransition
                    className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-primary-50"
                  >
                    <Avatar src={foto} alt="" tamanho={44} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-semibold text-fg">{nome}</span>
                      <span className="truncate text-sm text-fg-muted">{area}</span>
                    </span>
                    <ChevronRight aria-hidden className="size-4 text-primary transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Dialog
        aberto={novaEquipe}
        aoMudar={setNovaEquipe}
        titulo="Nova equipe"
        descricao="Dê um nome, defina o foco e, se quiser, já adicione os membros."
      >
        <FormNovaEquipe
          aoCancelar={() => setNovaEquipe(false)}
          aoConcluir={(equipe) => {
            setNovaEquipe(false)
            navegar(`/gestor/equipes/${equipe.id}`, { viewTransition: true })
          }}
        />
      </Dialog>
    </div>
  )
}

/* ───────────────────────────── /gestor/equipes/:id ───────────────────────────── */

function TabelaMembros({ membros, minimos }: { membros: Membro[]; minimos: Minimos }) {
  return (
    <>
      {/* Desktop: tabela */}
      <div className="-mx-5 hidden overflow-x-auto sm:-mx-6 md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Membros da equipe e aderência às competências mínimas</caption>
          <thead>
            <tr className="border-y border-primary-100 bg-primary-50/60 text-xs font-semibold text-fg-muted">
              <th scope="col" className="px-6 py-3 font-semibold">
                Colaborador
              </th>
              <th scope="col" className="w-48 px-3 py-3 font-semibold">
                Aderência
              </th>
              <th scope="col" className="px-3 py-3 font-semibold">
                Situação
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-100">
            {membros.map((m) => {
              const abaixo = competenciasAbaixoDoMinimo(m.competencias, minimos)
              const aderencia = aderenciaAoMinimo(m.competencias, minimos)
              return (
                <tr key={m.id} className="transition-colors hover:bg-primary-50/50">
                  <th scope="row" className="px-6 py-3 font-normal">
                    <span className="flex items-center gap-3">
                      <Avatar src={m.foto} alt="" tamanho={40} />
                      <span className="flex flex-col">
                        <span className="font-semibold text-fg">{m.nome}</span>
                        <span className="text-xs text-fg-muted">{m.area}</span>
                      </span>
                    </span>
                  </th>
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-3">
                      <BarraProgresso valor={aderencia} rotulo={`Aderência de ${m.nome}`} />
                      <span className="w-10 text-right font-bold text-primary tabular">{aderencia}%</span>
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {abaixo.length === 0 ? (
                      <Tag variante="primaria">
                        <Check aria-hidden className="size-3" />
                        Atende todos
                      </Tag>
                    ) : (
                      <span className="flex flex-wrap gap-1">
                        {abaixo.map((a) => (
                          <Tag key={a.sigla} variante="chip" title={`${a.sigla}: nível ${a.nivel}, mínimo ${a.minimo}`}>
                            {a.sigla} {a.nivel}/{a.minimo}
                          </Tag>
                        ))}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Button
                      variante="fantasma"
                      tamanho="sm"
                      para={`/gestor/colaboradores/${m.id}`}
                      iconeDireita={<ChevronRight aria-hidden className="size-4" />}
                    >
                      <span>
                        Ver<span className="sr-only"> {m.nome}</span>
                      </span>
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: lista */}
      <ul className="flex flex-col gap-2 md:hidden">
        {membros.map((m) => {
          const abaixo = competenciasAbaixoDoMinimo(m.competencias, minimos)
          return (
            <li key={m.id}>
              <Link
                to={`/gestor/colaboradores/${m.id}`}
                viewTransition
                className="flex items-center gap-3 rounded-lg border border-primary-100 p-3 hover:bg-primary-50"
              >
                <Avatar src={m.foto} alt="" tamanho={44} />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-semibold text-fg">{m.nome}</span>
                  <span className="text-xs text-fg-muted">
                    Aderência {aderenciaAoMinimo(m.competencias, minimos)}% ·{' '}
                    {abaixo.length === 0 ? 'atende todos' : `${abaixo.length} abaixo do mínimo`}
                  </span>
                </span>
                <ChevronRight aria-hidden className="size-4 text-primary" />
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export function GestorEquipe() {
  const { id } = useParams()
  const { data, isPending, error, refetch, isFetching } = useEquipe(id)
  const [convite, setConvite] = useState(false)

  if (isPending) {
    return (
      <LoadingState>
        <Skeleton className="h-16 w-80 bg-on-primary-soft" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </LoadingState>
    )
  }

  if (error && !naoEncontrado(error)) {
    return (
      <>
        <h1 className="sr-only">Equipe</h1>
        <ErrorState titulo="Não conseguimos carregar a equipe" aoTentarDeNovo={() => void refetch()} tentando={isFetching} />
      </>
    )
  }

  if (!data) {
    return (
      <>
        <h1 className="sr-only">Equipe não encontrada</h1>
        <EmptyState
          className="bg-surface"
          titulo="Equipe não encontrada"
          descricao="Volte para o dashboard e escolha uma das suas equipes."
        >
          <Button para="/gestor">Ir para o dashboard</Button>
        </EmptyState>
      </>
    )
  }

  const { equipe, aderencia, abaixoDoMinimo } = data
  const { membros } = equipe
  const minimos = minimosDe(equipe.competenciasMinimas)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        antes={
          <img
            src={equipe.foto}
            alt=""
            width={64}
            height={64}
            className="size-14 shrink-0 rounded-lg object-cover ring-2 ring-on-primary-line sm:size-16"
          />
        }
        titulo={tituloEquipe(equipe)}
        descricao={equipe.foco}
        acoes={
          <Button variante="destaque" icone={<UserPlus aria-hidden className="size-4" />} onClick={() => setConvite(true)}>
            Adicionar membros
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard rotulo="Membros" valor={membros.length} icone={<UsersRound />} apoio={rotuloDeMembros(membros.length)} />
        <StatCard
          rotulo="Aderência média"
          valor={aderencia ?? '—'}
          sufixo={aderencia === null ? undefined : '%'}
          icone={<Gauge />}
          apoio="Mínimos atendidos"
        />
        <StatCard
          rotulo="Abaixo do mínimo"
          valor={abaixoDoMinimo}
          icone={<ArrowDown />}
          apoio="Pessoas com lacuna"
          destaque={abaixoDoMinimo > 0}
        />
        <StatCard rotulo="Competências mínimas" valor={equipe.competenciasMinimas.length} icone={<Layers />} apoio="Exigidas na equipe" />
      </div>

      <div className="grid gap-6 *:min-w-0 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card titulo="Membros" descricao="Aderência de cada pessoa às competências mínimas da equipe.">
            {membros.length === 0 ? (
              <EmptyState titulo="Esta equipe ainda não tem membros" descricao="Adicione o primeiro colaborador para começar a acompanhar.">
                <Button icone={<UserPlus aria-hidden className="size-4" />} onClick={() => setConvite(true)}>
                  Adicionar membros
                </Button>
              </EmptyState>
            ) : (
              <TabelaMembros membros={membros} minimos={minimos} />
            )}
          </Card>

          <Card titulo="Competências mínimas esperadas" descricao="Nível mínimo de cada competência e quantos membros atendem.">
            {equipe.competenciasMinimas.length === 0 && (
              <EmptyState compacto icone={<Layers />} titulo="Nenhuma competência mínima definida para esta equipe" />
            )}
            <ul className="flex flex-col gap-5">
              {equipe.competenciasMinimas.map((c) => {
                const atendem = membrosQueAtendem(membros, c.sigla, c.nivel)
                return (
                  <li key={c.sigla} className="flex flex-col gap-2">
                    <CompetencyBar {...c} compacta />
                    {membros.length > 0 && (
                      <p className="text-xs text-fg-muted">
                        <strong className="font-semibold text-fg tabular">
                          {atendem} de {membros.length}
                        </strong>{' '}
                        {membros.length === 1 ? 'membro atende' : 'membros atendem'} o nível {c.nivel}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>

        <aside className="flex flex-col gap-6" aria-label="Sobre a equipe e feedback">
          <Card titulo="Sobre a equipe">
            <p className="text-sm leading-relaxed text-fg-muted">{equipe.descricao || equipe.foco}</p>
          </Card>
          <Card titulo="Feedback" descricao="Reconheça uma entrega ou aponte um ponto de desenvolvimento.">
            <FormFeedback />
          </Card>
        </aside>
      </div>

      <Dialog
        aberto={convite}
        aoMudar={setConvite}
        titulo={`Adicionar à equipe ${equipe.nome}`}
        descricao="Informe o e-mail de colaboradores já cadastrados. Quem estiver em outra equipe muda para esta."
      >
        <FormConvite equipeId={equipe.id} nomeEquipe={equipe.nome} aoConcluir={() => setConvite(false)} />
      </Dialog>
    </div>
  )
}

/* ───────────────────────────── /gestor/colaboradores/:id ───────────────────────────── */

const esquemaNivel = z.object({
  sigla: z.string().min(1, 'Escolha a competência.'),
  nivel: z.string().min(1, 'Escolha o nível.'),
})
type NovoNivel = z.infer<typeof esquemaNivel>

/** Registra (ou atualiza) o nível do colaborador numa competência do catálogo SFIA. */
function FormNivelCompetencia({ colaboradorId, competencias }: { colaboradorId: number; competencias: Competencia[] }) {
  const queryClient = useQueryClient()
  const catalogo = useCatalogo()
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NovoNivel>({ resolver: zodResolver(esquemaNivel), defaultValues: { sigla: '', nivel: '' } })

  const sigla = useWatch({ control, name: 'sigla' })
  const escolhida = catalogo.data?.find((c) => c.sigla === sigla)
  const atual = competencias.find((c) => c.sigla === sigla)

  const salvar = async ({ sigla: s, nivel }: NovoNivel) => {
    try {
      await UsuarioAPI.definirCompetencia(colaboradorId, s, Number(nivel))
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: chaves.colaborador(colaboradorId) }),
        queryClient.invalidateQueries({ queryKey: chaves.equipes }),
      ])
      toast.sucesso(`${s} ${atual ? 'atualizada' : 'registrada'} no nível ${nivel}.`)
      reset({ sigla: '', nivel: '' })
    } catch (e) {
      toast.erro(mensagemDaApi(e))
    }
  }

  return (
    <Card
      titulo="Registrar competência"
      descricao="Avalie o colaborador numa competência do catálogo SFIA. Se ela já existe no perfil, o nível é atualizado."
    >
      {catalogo.error ? (
        <ErrorState
          variante="aviso"
          titulo="Não conseguimos carregar o catálogo de competências"
          aoTentarDeNovo={() => void catalogo.refetch()}
          tentando={catalogo.isFetching}
        />
      ) : (
        <form noValidate onSubmit={handleSubmit(salvar)} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
            <Select
              {...register('sigla', { onChange: () => setValue('nivel', '') })}
              label="Competência"
              required
              disabled={catalogo.isPending}
              erro={errors.sigla?.message}
              opcoes={[
                { valor: '', rotulo: catalogo.isPending ? 'Carregando…' : 'Escolha' },
                ...(catalogo.data ?? []).map((c) => ({ valor: c.sigla, rotulo: `${c.sigla} · ${c.nome}` })),
              ]}
            />
            <Select
              {...register('nivel')}
              label="Nível"
              required
              disabled={!escolhida}
              erro={errors.nivel?.message}
              opcoes={[
                { valor: '', rotulo: 'Escolha' },
                ...Array.from({ length: escolhida?.nivelMax ?? 0 }, (_, i) => ({
                  valor: String(i + 1),
                  rotulo: `${i + 1} de ${escolhida?.nivelMax}`,
                })),
              ]}
            />
          </div>
          {escolhida && (
            <p className="text-sm text-fg-muted">
              {escolhida.categoria && <>{escolhida.categoria} · </>}
              {atual ? `Nível atual: ${atual.nivel} de ${atual.nivelMax}.` : 'Ainda não registrada no perfil.'}
            </p>
          )}
          <Button type="submit" icone={<Save aria-hidden className="size-4" />} carregando={isSubmitting} className="self-start">
            Salvar nível
          </Button>
        </form>
      )}
    </Card>
  )
}

export function GestorColaborador() {
  const { id } = useParams()
  const { colaborador, erro, carregando, recarregar, recarregando } = useColaborador(id)

  const irParaFeedback = () => {
    const secao = document.getElementById('feedback')
    secao?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    secao?.querySelector('textarea')?.focus({ preventScroll: true })
  }

  if (carregando) {
    return (
      <LoadingState>
        <Skeleton className="h-36 rounded-xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </LoadingState>
    )
  }

  if (erro && !naoEncontrado(erro)) {
    return (
      <>
        <h1 className="sr-only">Colaborador</h1>
        <ErrorState titulo="Não conseguimos carregar este colaborador" aoTentarDeNovo={recarregar} tentando={recarregando} />
      </>
    )
  }

  if (!colaborador) return <ColaboradorNaoEncontrado />

  const { equipe } = colaborador
  const minimos = minimosDe(equipe?.competenciasMinimas)
  const abaixo = competenciasAbaixoDoMinimo(colaborador.competencias, minimos)

  return (
    <div className="flex flex-col gap-6">
      <CartaoColaborador
        colaborador={colaborador}
        acoes={
          <>
            <Button
              variante="secundario"
              para={`/gestor/colaboradores/${colaborador.id}/perfil`}
              iconeDireita={<ArrowRight aria-hidden className="size-4" />}
            >
              Perfil completo
            </Button>
            <Button icone={<Send aria-hidden className="size-4" />} onClick={irParaFeedback}>
              Enviar feedback
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          rotulo="Nível total"
          valor={calcularNivelTotal(colaborador.competencias)}
          sufixo="%"
          icone={<Gauge />}
          apoio="Soma dos níveis sobre o máximo"
        />
        <StatCard
          rotulo="Aderência à equipe"
          valor={equipe ? aderenciaAoMinimo(colaborador.competencias, minimos) : '—'}
          sufixo={equipe ? '%' : undefined}
          icone={<Check />}
          apoio={equipe ? `Mínimos de ${tituloEquipe(equipe)}` : 'Sem equipe vinculada'}
        />
        <StatCard
          rotulo="Abaixo do mínimo"
          valor={abaixo.length}
          icone={<ArrowDown />}
          apoio={abaixo.length ? abaixo.map((a) => a.sigla).join(', ') : 'Atende todos os mínimos'}
          destaque={abaixo.length > 0}
        />
      </div>

      <div className="grid gap-6 *:min-w-0 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <PainelCompetencias competencias={colaborador.competencias} minimos={equipe ? minimos : undefined} />
          <FormNivelCompetencia colaboradorId={colaborador.id} competencias={colaborador.competencias} />
        </div>
        <aside id="feedback" aria-label="Feedback" className="scroll-mt-6">
          <Card titulo="Feedback" descricao={`Mensagem direta para ${primeiroNome(colaborador.nome)}.`} className="lg:sticky lg:top-6">
            <FormFeedback destinatario={colaborador.email} />
          </Card>
        </aside>
      </div>
    </div>
  )
}
