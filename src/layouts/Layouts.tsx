import { useRef, type ReactNode } from 'react'
import { Link, Outlet, useMatches } from 'react-router'
import { ChevronRight } from 'lucide-react'
import logoBbts from '@/assets/images/logo-bbts.webp'
import simboloBb from '@/assets/images/simbolo-bb.webp'
import { useUsuarioLogado } from '@/hooks/useColaborador'
import { useFocoAoNavegar, useTituloDaRota, useTrilhaDaRota, type HandleRota } from '@/hooks/useNavegacao'
import type { Perfil } from '@/types/dominio'
import { Cabecalho, type UsuarioCabecalho } from './Cabecalho'

/** Faixa azul que continua o cabeçalho. O conteúdo da tela flutua sobre ela. */
function Palco({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex w-full flex-1 flex-col">
      <div aria-hidden className="absolute inset-x-0 top-0 h-64 rounded-b-[28px] bg-primary md:h-72" />
      {children}
    </div>
  )
}

/** Trilha de navegação do gestor: Home › Equipe › Colaborador. */
function Breadcrumb() {
  const trilha = useTrilhaDaRota()
  if (!trilha || trilha.length < 2) return null
  return (
    <nav aria-label="Trilha de navegação" data-surface="primary" className="relative mx-auto w-full max-w-layout px-4 pt-5 sm:px-6 md:px-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {trilha.map(({ rotulo, para }, i) => {
          const ultimo = i === trilha.length - 1
          return (
            <li key={para} className="flex items-center gap-1.5">
              {ultimo ? (
                <span aria-current="page" className="font-semibold text-white">
                  {rotulo}
                </span>
              ) : (
                <>
                  <Link
                    to={para}
                    viewTransition
                    className="rounded-xs text-fg-inverse-muted underline-offset-4 hover:text-white hover:underline"
                  >
                    {rotulo}
                  </Link>
                  <ChevronRight aria-hidden className="size-4 text-fg-inverse-muted" />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function LinkPularConteudo({ alvo }: { alvo: React.RefObject<HTMLElement | null> }) {
  return (
    <a
      href="#conteudo"
      onClick={(e) => {
        e.preventDefault()
        alvo.current?.focus()
      }}
      className="fixed top-2 left-2 z-50 -translate-y-[200%] rounded-md bg-accent px-4 py-2 font-semibold text-primary focus:translate-y-0"
    >
      Pular para o conteúdo
    </a>
  )
}

/** Layout autenticado: cabeçalho por perfil, breadcrumb no gestor e conteúdo da rota. */
export function AppLayout({ perfil }: { perfil: Perfil }) {
  const refConteudo = useRef<HTMLElement>(null)
  const titulo = useTituloDaRota()
  const { data: usuario } = useUsuarioLogado()
  useFocoAoNavegar(refConteudo)

  const rotuloPerfil = perfil === 'gestor' ? 'Gestor' : 'Colaborador'
  // Enquanto a API responde, o menu da conta mostra só o perfil.
  const usuarioCabecalho: UsuarioCabecalho = usuario
    ? { nome: usuario.nome, foto: usuario.foto, descricao: usuario.area ?? rotuloPerfil }
    : { nome: rotuloPerfil, foto: null, descricao: rotuloPerfil }

  return (
    <>
      <LinkPularConteudo alvo={refConteudo} />
      <Cabecalho titulo={titulo} perfil={perfil} usuario={usuarioCabecalho} />
      <Palco>
        {perfil === 'gestor' && <Breadcrumb />}
        <main
          id="conteudo"
          ref={refConteudo}
          tabIndex={-1}
          className="relative mx-auto w-full max-w-layout flex-1 px-4 pt-6 pb-16 sm:px-6 md:px-8 md:pt-8"
        >
          <Outlet />
        </main>
      </Palco>
      <Rodape />
    </>
  )
}

function Rodape() {
  return (
    <footer className="border-t border-primary-100 bg-surface">
      <div className="mx-auto flex max-w-layout flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-fg-muted sm:px-6 md:px-8">
        <span>BBTS · Desenvolvendo competências, construindo futuro.</span>
        <span>Modelo de competências SFIA</span>
      </div>
    </footer>
  )
}

/** Telas públicas. Seleção de perfil e login ocupam a página inteira; o cadastro tem cabeçalho. */
export function PublicLayout() {
  const refConteudo = useRef<HTMLElement>(null)
  const titulo = useTituloDaRota()
  const comCabecalho = useMatches().some(({ handle }) => (handle as HandleRota | undefined)?.comCabecalho)
  useFocoAoNavegar(refConteudo)

  const conteudo = (
    <main
      id="conteudo"
      ref={refConteudo}
      tabIndex={-1}
      className={
        comCabecalho ? 'relative mx-auto w-full max-w-layout flex-1 px-4 pt-6 pb-16 sm:px-6 md:px-8 md:pt-8' : 'flex flex-1 flex-col'
      }
    >
      <Outlet />
    </main>
  )

  if (!comCabecalho) return conteudo

  return (
    <>
      <LinkPularConteudo alvo={refConteudo} />
      <Cabecalho titulo={titulo} />
      <Palco>{conteudo}</Palco>
    </>
  )
}

/** Entrada do sistema: painel azul com a marca de um lado e o conteúdo do outro. */
export function TelaDividida({ children }: { children: ReactNode }) {
  return (
    <div className="grid flex-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div
        data-surface="primary"
        className="relative flex flex-col justify-between gap-10 overflow-hidden bg-primary px-6 py-8 text-white sm:px-10 md:min-h-dvh md:rounded-r-[28px] md:py-12"
      >
        <img src={logoBbts} alt="BB Tecnologia e Serviços" width={967} height={84} className="relative z-10 h-5 w-auto self-start sm:h-6" />
        <img
          src={simboloBb}
          alt=""
          width={640}
          height={627}
          className="pointer-events-none absolute top-1/2 -right-24 hidden w-[420px] max-w-none -translate-y-1/2 opacity-95 md:block lg:-right-16 lg:w-[480px]"
        />
        <div className="relative z-10 flex max-w-sm flex-col gap-3">
          <p className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Gestão de competências</p>
          <p className="text-fg-inverse-muted">Níveis, lacunas e evolução das equipes em um só lugar.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-10 sm:px-10 md:py-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
