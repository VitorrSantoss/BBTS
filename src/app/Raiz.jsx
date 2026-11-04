import { useEffect } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';
import { useTituloDaRota } from '@/hooks/useTituloDaRota';

/** Rota raiz: mantém o título da aba em dia com a rota e restaura a rolagem. */
export default function Raiz() {
  const titulo = useTituloDaRota();

  useEffect(() => {
    document.title = titulo ? `${titulo} | BBTS` : 'BBTS';
  }, [titulo]);

  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
