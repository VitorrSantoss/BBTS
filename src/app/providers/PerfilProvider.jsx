import { useCallback, useMemo, useState } from 'react';
import { lerPerfil, salvarPerfil } from '@/services/sessao';
import { PerfilContext } from './contextos';

/** Perfil escolhido na tela inicial, guardado no localStorage. */
export default function PerfilProvider({ children }) {
  const [perfil, setPerfil] = useState(lerPerfil);

  const escolherPerfil = useCallback((novoPerfil) => {
    salvarPerfil(novoPerfil);
    setPerfil(novoPerfil);
  }, []);

  const valor = useMemo(() => ({ perfil, escolherPerfil }), [perfil, escolherPerfil]);

  return <PerfilContext.Provider value={valor}>{children}</PerfilContext.Provider>;
}
