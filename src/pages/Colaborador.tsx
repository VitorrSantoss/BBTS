import { useParams } from 'react-router'
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Download,
  Gauge,
  GraduationCap,
  Languages,
  Layers,
  MessageSquare,
  PencilLine,
  Sparkles,
  Target,
  Wrench,
} from 'lucide-react'
import { CartaoColaborador, PainelCompetencias } from '@/components/colaborador'
import { CompetencyList, DonutChart } from '@/components/competencias'
import { Avatar, Button, Card, EmptyState, ErrorState, LoadingState, PageHeader, Skeleton, StatCard, Tag, toast } from '@/components/ui'
import { useColaborador, useFeedbacksRecebidos, useMeusDados } from '@/hooks/useColaborador'
import { ErroApi } from '@/services/api'
import { useSessao } from '@/services/sessao'
import type { Colaborador, ItemComNivel } from '@/types/dominio'
import { calcularNivelTotal, type Minimos } from '@/utils/competencias'
import { minimosDe, rotuloEquipe } from '@/utils/equipes'
import { formatarData, periodoDaExperiencia, periodoDaFormacao, primeiroNome, proporcaoDoNivel, rotuloNivel } from '@/utils/formatadores'

/** Falha ao carregar os dados do próprio colaborador: sem eles, a tela não tem o que mostrar. */
function ErroAoCarregar({ titulo, aoTentarDeNovo, tentando }: { titulo: string; aoTentarDeNovo: () => void; tentando: boolean }) {
  return (
    <>
      <h1 className="sr-only">{titulo}</h1>
      <ErrorState
        titulo="Não conseguimos carregar seus dados"
        descricao="Confira se a API está no ar e tente de novo."
        aoTentarDeNovo={aoTentarDeNovo}
        tentando={tentando}
      />
    </>
  )
}

/* ───────────────────────────── /colaborador ───────────────────────────── */

function EsqueletoInicio() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-9 w-64 bg-on-primary-soft" />
        <Skeleton className="h-4 w-96 max-w-full bg-on-primary-soft" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 *:min-w-0 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </>
  )
}

/** Feedbacks que o colaborador recebeu dos gestores. */
function FeedbacksRecebidos() {
  const usuarioId = useSessao((s) => s.usuarioId)
  const { data, isPending, error, refetch, isFetching } = useFeedbacksRecebidos(usuarioId)

  return (
    <Card titulo="Feedbacks recebidos" acoes={<MessageSquare aria-hidden className="size-5 text-primary" />}>
      {isPending ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
      ) : error ? (
        <ErrorState
          variante="aviso"
          titulo="Não conseguimos carregar seus feedbacks"
          aoTentarDeNovo={() => void refetch()}
          tentando={isFetching}
        />
      ) : data.length === 0 ? (
        <EmptyState
          compacto
          icone={<MessageSquare />}
          titulo="Nenhum feedback por enquanto"
          descricao="Quando seu gestor enviar um, ele aparece aqui."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {data.map((f) => (
            <li key={f.id} className="flex gap-3 rounded-lg border border-primary-100 p-4">
              <Avatar src={f.autor?.foto} alt="" tamanho={40} />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <p className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-fg">{f.autor?.nome ?? 'Gestor'}</span>
                  <Tag variante={f.tipo === 'POSITIVO' ? 'primaria' : 'chip'}>
                    {f.tipo === 'POSITIVO' ? 'Reconhecimento' : 'Desenvolvimento'}
                  </Tag>
                  <span className="text-xs text-fg-muted tabular">{formatarData(f.dataEnvio)}</span>
                </p>
                <p className="text-sm leading-relaxed text-fg">{f.mensagem}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

export function ColaboradorHome() {
  const { colaborador, erro, carregando, recarregando, recarregar } = useMeusDados()

  if (carregando) {
    return (
      <LoadingState consultaApi>
        <EsqueletoInicio />
      </LoadingState>
    )
  }

  if (erro || !colaborador) return <ErroAoCarregar titulo="Início" aoTentarDeNovo={recarregar} tentando={recarregando} />

  const { nome, foto, area, equipe, tecnologias, competencias, lacunas, jornada } = colaborador
  const nivelTotal = calcularNivelTotal(competencias)
  const noMaximo = competencias.filter((c) => c.nivel >= c.nivelMax).length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        titulo={`Olá, ${primeiroNome(nome)}!`}
        descricao="Veja onde você está e qual é o próximo passo da sua jornada."
        acoes={
          <Button variante="destaque" para="/colaborador/editar" icone={<PencilLine aria-hidden className="size-4" />}>
            Atualizar meus dados
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard rotulo="Nível total" valor={nivelTotal} sufixo="%" icone={<Gauge />} apoio="Soma dos níveis sobre o máximo" />
        <StatCard rotulo="Competências" valor={competencias.length} icone={<Layers />} apoio={`${noMaximo} no nível máximo`} />
        <StatCard
          rotulo="Lacunas"
          valor={lacunas.length}
          icone={<Target />}
          apoio={equipe ? 'Abaixo do mínimo da equipe' : 'Sem equipe vinculada'}
          destaque={lacunas.length > 0}
        />
        <StatCard rotulo="Jornada" valor={jornada.length} icone={<GraduationCap />} apoio="Cursos sugeridos" />
      </div>

      <div className="grid gap-6 *:min-w-0 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card
          titulo="Níveis de competências"
          descricao="Nível atual sobre o máximo de cada competência SFIA."
          acoes={
            <Button
              variante="fantasma"
              tamanho="sm"
              para="/colaborador/perfil"
              iconeDireita={<ArrowRight aria-hidden className="size-4" />}
            >
              Ver perfil
            </Button>
          }
        >
          <div className="grid items-center gap-8 *:min-w-0 md:grid-cols-[auto_minmax(0,1fr)]">
            <div className="flex flex-col items-center gap-2">
              <DonutChart valor={nivelTotal} tamanho={160} legenda="nível total" />
            </div>
            <CompetencyList competencias={competencias} minimos={minimosDe(equipe?.competenciasMinimas)} compacta />
          </div>
        </Card>

        <section
          aria-label="Seu perfil"
          className="flex flex-col overflow-hidden rounded-xl border border-primary-100 bg-surface shadow-xs"
        >
          <div className="flex flex-1 flex-col items-center gap-3 px-6 pt-8 pb-6 text-center">
            <Avatar src={foto} alt={`Foto de ${nome}`} tamanho={104} borda="azul" />
            <div>
              <h2 className="text-xl font-bold text-fg">{nome}</h2>
              {area && <p className="text-fg-muted">{area}</p>}
            </div>
            {(equipe || tecnologias.length > 0) && (
              <ul className="flex flex-wrap justify-center gap-1.5" aria-label="Equipe e tecnologias">
                {equipe && (
                  <li>
                    <Tag variante="chip" title={equipe.nome}>
                      {rotuloEquipe(equipe)}
                    </Tag>
                  </li>
                )}
                {tecnologias.slice(0, 4).map((t) => (
                  <li key={t.id}>
                    <Tag variante="primaria">{t.nome}</Tag>
                  </li>
                ))}
              </ul>
            )}
            {equipe && <p className="text-sm text-fg-muted">{equipe.nome}</p>}
          </div>
          <p className="bg-accent py-3 text-center text-sm font-bold tracking-[0.12em] text-primary uppercase">Colaborador</p>
        </section>
      </div>

      <div className="grid gap-6 *:min-w-0 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card titulo="Lacunas de conhecimento" descricao="Competências em que você ainda está abaixo do mínimo da sua equipe.">
          {lacunas.length === 0 ? (
            <EmptyState
              compacto
              icone={<Sparkles />}
              titulo={equipe ? 'Nenhuma lacuna identificada' : 'Você ainda não está em uma equipe'}
              descricao={
                equipe
                  ? 'Você atende todos os mínimos da sua equipe. Bom trabalho!'
                  : 'Quando entrar em uma, comparamos seus níveis com os mínimos dela.'
              }
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] md:items-center">
              <p data-surface="primary" className="rounded-lg bg-primary p-5 text-lg leading-snug text-white">
                Descubra as <strong className="text-accent">áreas mais importantes</strong> para você no momento!
              </p>
              <ul className="flex flex-wrap gap-2">
                {lacunas.map((lacuna, i) => (
                  <li
                    key={lacuna.sigla}
                    title={`${lacuna.sigla}: nível ${lacuna.nivel}, mínimo ${lacuna.minimo}`}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-primary-100 bg-primary-50 pr-4 pl-1.5 text-sm font-semibold text-primary"
                  >
                    <span className="flex size-6 items-center justify-center rounded-full bg-surface text-xs tabular">{i + 1}</span>
                    {lacuna.nome}
                    <span className="text-xs font-normal text-fg-muted tabular">
                      {lacuna.nivel}/{lacuna.minimo}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card titulo="Jornada de capacitação" descricao="Cursos sugeridos para fechar suas lacunas.">
          {jornada.length === 0 ? (
            <EmptyState
              compacto
              icone={<BookOpen />}
              titulo="Nenhum curso sugerido"
              descricao="Quando houver uma lacuna, o curso dela aparece aqui."
            />
          ) : (
            <ol className="relative flex flex-col gap-2">
              {jornada.map((curso, i) => (
                <li key={curso.id}>
                  <button
                    type="button"
                    onClick={() => toast.info(`A página de "${curso.titulo}" ainda não está disponível.`)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-primary-100 p-3 text-left transition-colors hover:border-primary-300 hover:bg-primary-50"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white tabular">
                      {i + 1}
                    </span>
                    <span className="flex flex-1 flex-col">
                      <span className="text-sm font-semibold text-fg">{curso.titulo}</span>
                      <span className="text-xs text-fg-muted">{curso.sigla}</span>
                    </span>
                    <ArrowRight aria-hidden className="size-4 text-primary transition-transform group-hover:translate-x-0.5" />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <FeedbacksRecebidos />
    </div>
  )
}

/* ───────────────────────────── Perfil completo ───────────────────────────── */

function EsqueletoPerfil() {
  return (
    <>
      <Skeleton className="h-36 rounded-xl" />
      <Skeleton className="h-96 rounded-xl" />
      <div className="grid gap-6 *:min-w-0 md:grid-cols-2">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </>
  )
}

function ListaDeNiveis({ itens }: { itens: ItemComNivel[] }) {
  return (
    <dl className="flex flex-col divide-y divide-primary-100">
      {itens.map(({ id, nome, nivel }) => (
        <div key={id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
          <dt className="flex-1 font-semibold text-fg">{nome}</dt>
          <dd className="flex w-40 shrink-0 flex-col items-end gap-1.5">
            <span className="text-sm font-semibold text-primary">{rotuloNivel(nivel)}</span>
            <span aria-hidden className="h-1.5 w-full overflow-hidden rounded-full bg-primary-100">
              <span className="block h-full rounded-full bg-progress" style={{ width: `${proporcaoDoNivel(nivel) * 100}%` }} />
            </span>
          </dd>
        </div>
      ))}
    </dl>
  )
}

function LinhaDoTempo({ itens }: { itens: Array<{ chave: string; periodo: string; selo?: string; titulo: string; subtitulo: string }> }) {
  return (
    <ol className="relative flex flex-col gap-6 border-l-2 border-primary-100 pl-6">
      {itens.map(({ chave, periodo, selo, titulo, subtitulo }) => (
        <li key={chave} className="relative">
          <span
            aria-hidden
            className="absolute top-1 -left-[31px] size-3 rounded-full border-2 border-surface bg-primary ring-2 ring-primary-200"
          />
          <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-primary tabular">
            {periodo}
            {selo && <Tag variante={selo === 'Cursando' ? 'chip' : 'primaria'}>{selo}</Tag>}
          </p>
          <p className="mt-1 font-semibold text-fg">{titulo}</p>
          <p className="text-sm text-fg-muted">{subtitulo}</p>
        </li>
      ))}
    </ol>
  )
}

function ConteudoPerfil({ colaborador, minimos }: { colaborador: Colaborador; minimos?: Minimos }) {
  const { formacoes, experiencias, idiomas, tecnologias, competencias, certificacoes } = colaborador
  return (
    <>
      <PainelCompetencias competencias={competencias} minimos={minimos} />

      <div className="grid gap-6 *:min-w-0 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Card titulo="Formação acadêmica" acoes={<GraduationCap aria-hidden className="size-5 text-primary" />}>
            {formacoes.length === 0 ? (
              <EmptyState compacto titulo="Nenhuma formação cadastrada" />
            ) : (
              <LinhaDoTempo
                itens={formacoes.map((f) => ({
                  chave: String(f.id),
                  periodo: periodoDaFormacao(f),
                  selo: f.status === 'CURSANDO' ? 'Cursando' : 'Concluído',
                  titulo: f.curso,
                  subtitulo: f.instituicao,
                }))}
              />
            )}
          </Card>
          <Card titulo="Experiência profissional" acoes={<Briefcase aria-hidden className="size-5 text-primary" />}>
            {experiencias.length === 0 ? (
              <EmptyState
                compacto
                titulo="Nenhuma experiência cadastrada"
                descricao="As experiências aparecem aqui depois de adicionadas no cadastro."
              />
            ) : (
              <LinhaDoTempo
                itens={experiencias.map((e) => ({
                  chave: String(e.id),
                  periodo: periodoDaExperiencia(e),
                  selo: e.empregoAtual ? 'Atual' : undefined,
                  titulo: e.cargo,
                  subtitulo: e.empresa,
                }))}
              />
            )}
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card titulo="Idiomas" acoes={<Languages aria-hidden className="size-5 text-primary" />}>
            {idiomas.length === 0 ? <EmptyState compacto titulo="Nenhum idioma cadastrado" /> : <ListaDeNiveis itens={idiomas} />}
          </Card>
          <Card titulo="Habilidades" acoes={<Wrench aria-hidden className="size-5 text-primary" />}>
            {tecnologias.length === 0 ? (
              <EmptyState compacto titulo="Nenhuma habilidade cadastrada" />
            ) : (
              <ListaDeNiveis itens={tecnologias} />
            )}
          </Card>
          {certificacoes.length > 0 && (
            <Card titulo="Certificados">
              <ul className="flex flex-col gap-2">
                {certificacoes.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 rounded-md bg-primary-50 px-3 py-2 text-sm font-semibold text-primary">
                    <BookOpen aria-hidden className="size-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{c.nomeCurso}</span>
                    {c.arquivo && (
                      <a
                        href={c.arquivo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-sm text-xs underline-offset-4 hover:underline"
                      >
                        <Download aria-hidden className="size-3.5" />
                        Abrir<span className="sr-only"> o certificado {c.nomeCurso}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

/** `/colaborador/perfil`: o próprio colaborador. */
export function MeuPerfil() {
  const { colaborador, erro, carregando, recarregando, recarregar } = useMeusDados()

  if (carregando) {
    return (
      <LoadingState consultaApi>
        <EsqueletoPerfil />
      </LoadingState>
    )
  }

  if (erro || !colaborador) return <ErroAoCarregar titulo="Perfil" aoTentarDeNovo={recarregar} tentando={recarregando} />

  return (
    <div className="flex flex-col gap-6">
      <CartaoColaborador
        colaborador={colaborador}
        acoes={
          <Button variante="secundario" para="/colaborador/editar" icone={<PencilLine aria-hidden className="size-4" />}>
            Editar
          </Button>
        }
      />
      <ConteudoPerfil
        colaborador={colaborador}
        minimos={colaborador.equipe ? minimosDe(colaborador.equipe.competenciasMinimas) : undefined}
      />
    </div>
  )
}

/** `/gestor/colaboradores/:id/perfil`: perfil visto pelo gestor, com os mínimos da equipe. */
export function PerfilVistoPeloGestor() {
  const { id } = useParams()
  const { colaborador, carregando, erro, recarregar, recarregando } = useColaborador(id)

  if (carregando) {
    return (
      <LoadingState>
        <EsqueletoPerfil />
      </LoadingState>
    )
  }
  if (erro instanceof ErroApi && erro.status === 404) return <ColaboradorNaoEncontrado />
  if (erro || !colaborador) {
    return (
      <>
        <h1 className="sr-only">Perfil do colaborador</h1>
        <ErrorState titulo="Não conseguimos carregar este perfil" aoTentarDeNovo={recarregar} tentando={recarregando} />
      </>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <CartaoColaborador colaborador={colaborador} />
      <ConteudoPerfil
        colaborador={colaborador}
        minimos={colaborador.equipe ? minimosDe(colaborador.equipe.competenciasMinimas) : undefined}
      />
    </div>
  )
}

export function ColaboradorNaoEncontrado() {
  return (
    <>
      <h1 className="sr-only">Colaborador não encontrado</h1>
      <EmptyState
        className="bg-surface"
        titulo="Colaborador não encontrado"
        descricao="Volte para o dashboard e escolha uma equipe ou conversa."
      >
        <Button para="/gestor">Ir para o dashboard</Button>
      </EmptyState>
    </>
  )
}
