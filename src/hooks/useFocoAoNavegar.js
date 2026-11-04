import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/** Ao trocar de rota, leva o foco para o conteúdo, como aconteceria num carregamento de página. */
export function useFocoAoNavegar(refConteudo) {
  const { pathname } = useLocation();
  const rotaAnterior = useRef(pathname);

  useEffect(() => {
    if (rotaAnterior.current === pathname) return;
    rotaAnterior.current = pathname;
    refConteudo.current?.focus({ preventScroll: true });
  }, [pathname, refConteudo]);
}
