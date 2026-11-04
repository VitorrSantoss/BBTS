import { useRef } from 'react';
import { Outlet, useMatch } from 'react-router';
import { useFocoAoNavegar } from '@/hooks/useFocoAoNavegar';
import { useTituloDaRota } from '@/hooks/useTituloDaRota';
import { equipeDoColaborador } from '@/mocks/consultas';
import { CARLA, PEDRO } from '@/mocks/personas';
import { lerUsuarioId } from '@/services/sessao';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import Cabecalho from '../Cabecalho/Cabecalho';
import styles from './AppLayout.module.css';

const LINKS_COLABORADOR = [
  { para: '/colaborador', rotulo: 'Início', exato: true },
  { para: '/colaborador/perfil', rotulo: 'Perfil' },
  { para: '/colaborador/editar', rotulo: 'Editar competências' },
];

/** Sem lista geral de equipes, o link "Equipe" acompanha a equipe em contexto. */
function useLinksGestor() {
  const rotaEquipe = useMatch('/gestor/equipes/:id');
  const rotaColaborador = useMatch('/gestor/colaboradores/:id/*');

  const equipeId =
    rotaEquipe?.params.id ?? equipeDoColaborador(rotaColaborador?.params.id)?.id ?? 1;

  return [
    { para: '/gestor', rotulo: 'Dashboard', exato: true },
    { para: `/gestor/equipes/${equipeId}`, rotulo: 'Equipe' },
  ];
}

/** A API não guarda foto: usuário real aparece com o ícone de perfil padrão. */
function usuarioDoCabecalho(perfil) {
  if (perfil === 'gestor') return CARLA;
  return lerUsuarioId() ? { nome: 'Colaborador', foto: null } : PEDRO;
}

/** Layout autenticado: cabeçalho por perfil, breadcrumb no gestor e conteúdo da rota. */
export default function AppLayout({ perfil }) {
  const refConteudo = useRef(null);
  const titulo = useTituloDaRota();
  const linksGestor = useLinksGestor();
  const gestor = perfil === 'gestor';

  useFocoAoNavegar(refConteudo);

  return (
    <>
      <a
        href="#conteudo"
        className="skip-link"
        onClick={(evento) => {
          evento.preventDefault();
          refConteudo.current?.focus();
        }}
      >
        Pular para o conteúdo
      </a>
      <Cabecalho
        titulo={titulo}
        links={gestor ? linksGestor : LINKS_COLABORADOR}
        usuario={usuarioDoCabecalho(perfil)}
      />
      {gestor && <Breadcrumb />}
      <main id="conteudo" ref={refConteudo} tabIndex={-1} className={styles.conteudo}>
        <Outlet />
      </main>
    </>
  );
}
