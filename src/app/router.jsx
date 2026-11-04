import { createBrowserRouter, Navigate } from 'react-router';
import AppLayout from '@/layouts/AppLayout/AppLayout';
import PublicLayout from '@/layouts/PublicLayout/PublicLayout';
import Cadastro from '@/pages/Cadastro/Cadastro';
import ColaboradorHome from '@/pages/ColaboradorHome/ColaboradorHome';
import GestorColaborador from '@/pages/GestorColaborador/GestorColaborador';
import GestorEquipe from '@/pages/GestorEquipe/GestorEquipe';
import GestorHome from '@/pages/GestorHome/GestorHome';
import Login from '@/pages/Login/Login';
import PerfilColaborador from '@/pages/PerfilColaborador/PerfilColaborador';
import SelecaoPerfil from '@/pages/SelecaoPerfil/SelecaoPerfil';
import ErroDeRota from './ErroDeRota';
import Raiz from './Raiz';
import RequireProfile from './RequireProfile';
import { trilhaColaborador, trilhaEquipe, trilhaPerfilColaborador } from './trilhas';

/**
 * `handle.titulo` alimenta o cabeçalho e a aba do navegador.
 * `handle.trilha` monta o breadcrumb do gestor.
 */
export const router = createBrowserRouter([
  {
    element: <Raiz />,
    errorElement: <ErroDeRota />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <SelecaoPerfil />, handle: { titulo: 'Seleção de perfil' } },
          { path: '/login', element: <Login />, handle: { titulo: 'Login' } },
          {
            path: '/cadastro',
            element: <Cadastro />,
            handle: { titulo: 'Cadastro', comCabecalho: true },
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
          { index: true, element: <ColaboradorHome />, handle: { titulo: 'Início' } },
          { path: 'perfil', element: <PerfilColaborador />, handle: { titulo: 'Perfil' } },
          {
            path: 'editar',
            element: <Cadastro edicao />,
            handle: { titulo: 'Editar competências' },
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
          { index: true, element: <GestorHome />, handle: { titulo: 'Home Gestor' } },
          {
            path: 'equipes/:id',
            element: <GestorEquipe />,
            handle: { titulo: 'Equipe', trilha: trilhaEquipe },
          },
          {
            path: 'colaboradores/:id',
            element: <GestorColaborador />,
            handle: { titulo: 'Colaborador', trilha: trilhaColaborador },
          },
          {
            path: 'colaboradores/:id/perfil',
            element: <PerfilColaborador visaoDoGestor />,
            handle: { titulo: 'Perfil do colaborador', trilha: trilhaPerfilColaborador },
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
