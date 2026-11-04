import { useRef } from 'react';
import { Outlet, useMatches } from 'react-router';
import { useFocoAoNavegar } from '@/hooks/useFocoAoNavegar';
import { useTituloDaRota } from '@/hooks/useTituloDaRota';
import Cabecalho from '../Cabecalho/Cabecalho';
import styles from './PublicLayout.module.css';

/** Telas públicas. Seleção de perfil e login ocupam a página inteira, o cadastro tem cabeçalho. */
export default function PublicLayout() {
  const refConteudo = useRef(null);
  const titulo = useTituloDaRota();
  const comCabecalho = useMatches().some(({ handle }) => handle?.comCabecalho);

  useFocoAoNavegar(refConteudo);

  return (
    <>
      {comCabecalho && <Cabecalho titulo={titulo} />}
      <main id="conteudo" ref={refConteudo} tabIndex={-1} className={styles.conteudo}>
        <Outlet />
      </main>
    </>
  );
}
