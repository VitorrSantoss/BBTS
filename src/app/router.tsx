import { createBrowserRouter, Navigate } from 'react-router'
import type { HandleRota } from '@/hooks/useNavegacao'
import { AppLayout, PublicLayout } from '@/layouts/Layouts'
import { ErroDeRota, RequireProfile, Raiz } from './RotasBase'

const h = (handle: HandleRota) => handle

/**
 * Cada tela é carregada sob demanda. `handle.titulo` alimenta o cabeçalho e a aba;
 * `handle.trilha` diz qual breadcrumb do gestor montar.
 */
export const router = createBrowserRouter([
  {
    element: <Raiz />,
    errorElement: <ErroDeRota />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: '/',
            lazy: async () => ({ Component: (await import('@/pages/Entrada')).SelecaoPerfil }),
            handle: h({ titulo: 'Seleção de perfil' }),
          },
          { path: '/login', lazy: async () => ({ Component: (await import('@/pages/Entrada')).Login }), handle: h({ titulo: 'Login' }) },
          {
            path: '/cadastro',
            lazy: async () => ({ Component: (await import('@/pages/Cadastro')).NovoCadastro }),
            handle: h({ titulo: 'Cadastro', comCabecalho: true }),
          },
        ],
      },
      {
        path: '/colaborador',
        element: (
          <RequireProfile perfil="colaborador">
            <AppLayout perfil="colaborador" />
          </RequireProfile>
        ),
        children: [
          {
            index: true,
            lazy: async () => ({ Component: (await import('@/pages/Colaborador')).ColaboradorHome }),
            handle: h({ titulo: 'Início' }),
          },
          {
            path: 'perfil',
            lazy: async () => ({ Component: (await import('@/pages/Colaborador')).MeuPerfil }),
            handle: h({ titulo: 'Perfil' }),
          },
          {
            path: 'editar',
            lazy: async () => ({ Component: (await import('@/pages/Cadastro')).EdicaoDeCadastro }),
            handle: h({ titulo: 'Editar competências' }),
          },
        ],
      },
      {
        path: '/gestor',
        element: (
          <RequireProfile perfil="gestor">
            <AppLayout perfil="gestor" />
          </RequireProfile>
        ),
        children: [
          {
            index: true,
            lazy: async () => ({ Component: (await import('@/pages/Gestor')).GestorHome }),
            handle: h({ titulo: 'Dashboard' }),
          },
          {
            path: 'equipes/:id',
            lazy: async () => ({ Component: (await import('@/pages/Gestor')).GestorEquipe }),
            handle: h({ titulo: 'Equipe', trilha: 'equipe' }),
          },
          {
            path: 'colaboradores/:id',
            lazy: async () => ({ Component: (await import('@/pages/Gestor')).GestorColaborador }),
            handle: h({ titulo: 'Colaborador', trilha: 'colaborador' }),
          },
          {
            path: 'colaboradores/:id/perfil',
            lazy: async () => ({ Component: (await import('@/pages/Colaborador')).PerfilVistoPeloGestor }),
            handle: h({ titulo: 'Perfil do colaborador', trilha: 'perfil' }),
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
