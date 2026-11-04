import { Navigate } from 'react-router';
import { usePerfil } from '@/hooks/usePerfil';

/** Bloqueia as rotas do outro perfil e manda para a seleção de perfil. */
export default function RequireProfile({ perfil, children }) {
  const { perfil: perfilAtual } = usePerfil();
  return perfilAtual === perfil ? children : <Navigate to="/" replace />;
}
