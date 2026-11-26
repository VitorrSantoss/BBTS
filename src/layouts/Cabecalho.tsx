import { useEffect, useId, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import { ChevronDown, LogOut, Menu as IconeMenu, PencilLine, Repeat, User, Users, X } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import logoBbts from '@/assets/images/logo-bbts.webp'
import { Avatar, Menu, MenuConteudo, MenuGatilho, MenuItem, MenuRotulo, MenuSeparador } from '@/components/ui'
import { useMinhasEquipes } from '@/hooks/useEquipes'
import { useSessao } from '@/services/sessao'
import type { Perfil } from '@/types/dominio'
import { cx } from '@/utils/classes'
import { tituloEquipe } from '@/utils/equipes'

export interface UsuarioCabecalho {
  nome: string
  foto: string | null
  descricao: string
}

interface LinkNav {
  para: string
  rotulo: string
  exato?: boolean
}

const LINKS: Record<Perfil, LinkNav[]> = {
  colaborador: [
    { para: '/colaborador', rotulo: 'Início', exato: true },
    { para: '/colaborador/perfil', rotulo: 'Perfil' },
    { para: '/colaborador/editar', rotulo: 'Editar competências' },
  ],
  gestor: [{ para: '/gestor', rotulo: 'Dashboard', exato: true }],
}

const classeLink = (ativo: boolean) =>
  cx(
    'flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-(--dur-rapida)',
    ativo ? 'bg-accent text-primary' : 'text-white hover:bg-on-primary-soft',
  )

/** Equipes do gestor: no desktop é um menu; no mobile, lista dentro do painel. */
function MenuEquipes() {
  const { pathname } = useLocation()
  const navegar = useNavigate()
  const ativo = pathname.startsWith('/gestor/equipes') || pathname.startsWith('/gestor/colaboradores')
  const { data: equipes = [], isPending } = useMinhasEquipes()
  return (
    <Menu>
      <MenuGatilho className={classeLink(ativo)}>
        Equipes
        <ChevronDown aria-hidden className="size-4" />
      </MenuGatilho>
      <MenuConteudo align="start">
        <MenuRotulo>Suas equipes</MenuRotulo>
        {equipes.length === 0 && <p className="px-3 py-2 text-sm text-fg-muted">{isPending ? 'Carregando…' : 'Nenhuma equipe ainda.'}</p>}
        {equipes.map(({ equipe: e }) => (
          <MenuItem key={e.id} onSelect={() => navegar(`/gestor/equipes/${e.id}`, { viewTransition: true })}>
            <Users aria-hidden />
            <span className="flex-1">{tituloEquipe(e)}</span>
            <span className="text-xs font-normal text-fg-muted tabular">{e.membros.length}</span>
          </MenuItem>
        ))}
      </MenuConteudo>
    </Menu>
  )
}

/**
 * Barra azul com o logo, o nome da página e a navegação do perfil.
 * Sem `perfil`, mostra só a marca (cadastro público).
 */
export function Cabecalho({ titulo, perfil, usuario }: { titulo?: string; perfil?: Perfil; usuario?: UsuarioCabecalho }) {
  const navId = useId()
  const navegar = useNavigate()
  const { pathname } = useLocation()
  const sair = useSessao((s) => s.sair)
  const queryClient = useQueryClient()
  const { data: equipesDoGestor = [] } = useMinhasEquipes(perfil === 'gestor')

  // O menu mobile lembra a rota em que foi aberto: ao navegar, ele fecha sozinho.
  const [abertoEm, setAbertoEm] = useState<string | null>(null)
  const menuAberto = abertoEm === pathname
  const setMenuAberto = (aberto: boolean | ((a: boolean) => boolean)) =>
    setAbertoEm((atual) => ((typeof aberto === 'function' ? aberto(atual === pathname) : aberto) ? pathname : null))

  // Esc fecha o menu mobile
  useEffect(() => {
    if (!menuAberto) return
    const aoTeclar = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && setAbertoEm(null)
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [menuAberto])

  // Sair esquece a sessão e o cache: o próximo login não vê dados de quem saiu.
  const trocarPerfil = () => {
    sair()
    queryClient.clear()
    navegar('/', { viewTransition: true })
  }

  const links = perfil ? LINKS[perfil] : []

  return (
    <header data-surface="primary" className="relative z-20 bg-primary text-white">
      <div className="mx-auto flex h-16 max-w-layout items-center gap-4 px-4 sm:px-6 md:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link to={perfil ? `/${perfil}` : '/'} viewTransition className="shrink-0 rounded-sm">
            <img src={logoBbts} alt="BB Tecnologia e Serviços" width={967} height={84} className="h-4 w-auto sm:h-5" />
            <span className="sr-only">, ir para o início</span>
          </Link>
          {titulo && (
            <p className="hidden min-w-0 items-center gap-3 truncate text-sm font-semibold text-accent sm:flex">
              <span aria-hidden className="h-5 w-px bg-on-primary-line" />
              {titulo}
            </p>
          )}
        </div>

        {perfil && (
          <>
            <nav aria-label="Navegação principal" className="hidden md:block">
              <ul className="flex items-center gap-1 rounded-full bg-on-primary-soft p-1">
                {links.map(({ para, rotulo, exato }) => (
                  <li key={para}>
                    <NavLink to={para} end={exato} viewTransition className={({ isActive }) => classeLink(isActive)}>
                      {rotulo}
                    </NavLink>
                  </li>
                ))}
                {perfil === 'gestor' && (
                  <li>
                    <MenuEquipes />
                  </li>
                )}
              </ul>
            </nav>

            {usuario && (
              <Menu>
                <MenuGatilho
                  className="flex items-center gap-2 rounded-full p-0.5 hover:bg-on-primary-soft md:pr-3"
                  aria-label={`Conta de ${usuario.nome}`}
                >
                  <Avatar src={usuario.foto} alt="" tamanho={36} borda="amarelo" />
                  <span className="hidden text-left leading-tight lg:block">
                    <span className="block text-sm font-semibold">{usuario.nome}</span>
                    <span className="block text-xs text-fg-inverse-muted">{usuario.descricao}</span>
                  </span>
                  <ChevronDown aria-hidden className="hidden size-4 md:block" />
                </MenuGatilho>
                <MenuConteudo>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <Avatar src={usuario.foto} alt="" tamanho={40} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-fg">{usuario.nome}</p>
                      <p className="text-xs text-fg-muted">{perfil === 'gestor' ? 'Gestor' : 'Colaborador'}</p>
                    </div>
                  </div>
                  <MenuSeparador />
                  {perfil === 'colaborador' && (
                    <>
                      <MenuItem onSelect={() => navegar('/colaborador/perfil', { viewTransition: true })}>
                        <User aria-hidden /> Meu perfil
                      </MenuItem>
                      <MenuItem onSelect={() => navegar('/colaborador/editar', { viewTransition: true })}>
                        <PencilLine aria-hidden /> Editar meus dados
                      </MenuItem>
                      <MenuSeparador />
                    </>
                  )}
                  <MenuItem onSelect={trocarPerfil}>
                    <Repeat aria-hidden /> Trocar perfil
                  </MenuItem>
                  <MenuItem onSelect={trocarPerfil}>
                    <LogOut aria-hidden /> Sair
                  </MenuItem>
                </MenuConteudo>
              </Menu>
            )}

            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-md hover:bg-on-primary-soft md:hidden"
              aria-expanded={menuAberto}
              aria-controls={navId}
              onClick={() => setMenuAberto((a) => !a)}
            >
              {menuAberto ? <X aria-hidden className="size-5" /> : <IconeMenu aria-hidden className="size-5" />}
              <span className="sr-only">{menuAberto ? 'Fechar menu' : 'Abrir menu'}</span>
            </button>
          </>
        )}
      </div>

      {perfil && menuAberto && (
        <nav id={navId} aria-label="Navegação principal" className="border-t border-on-primary-line px-4 pt-2 pb-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map(({ para, rotulo, exato }) => (
              <li key={para}>
                <NavLink to={para} end={exato} viewTransition className={({ isActive }) => cx(classeLink(isActive), 'h-11')}>
                  {rotulo}
                </NavLink>
              </li>
            ))}
            {perfil === 'gestor' && (
              <>
                <li className="px-4 pt-3 pb-1 text-xs font-semibold text-fg-inverse-muted">Equipes</li>
                {equipesDoGestor.map(({ equipe: e }) => (
                  <li key={e.id}>
                    <NavLink to={`/gestor/equipes/${e.id}`} viewTransition className={({ isActive }) => cx(classeLink(isActive), 'h-11')}>
                      {tituloEquipe(e)}
                    </NavLink>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
