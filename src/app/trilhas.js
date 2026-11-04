import {
  buscarColaborador,
  buscarEquipe,
  equipeDoColaborador,
  tituloEquipe,
} from '@/mocks/consultas';

const HOME = { rotulo: 'Home', para: '/gestor' };

const itemEquipe = (equipe) =>
  equipe ? [{ rotulo: tituloEquipe(equipe), para: `/gestor/equipes/${equipe.id}` }] : [];

/** Home › Equipe */
export const trilhaEquipe = ({ id }) => [HOME, ...itemEquipe(buscarEquipe(id))];

/** Home › Equipe › Colaborador */
export function trilhaColaborador({ id }) {
  const colaborador = buscarColaborador(id);
  return [
    HOME,
    ...itemEquipe(equipeDoColaborador(id)),
    { rotulo: colaborador?.nome ?? 'Colaborador', para: `/gestor/colaboradores/${id}` },
  ];
}

/** Home › Equipe › Colaborador › Perfil */
export const trilhaPerfilColaborador = (params) => [
  ...trilhaColaborador(params),
  { rotulo: 'Perfil', para: `/gestor/colaboradores/${params.id}/perfil` },
];
