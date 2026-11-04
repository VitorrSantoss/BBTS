import { CONVERSAS, EQUIPES, rotuloEquipe, tituloEquipe } from './equipes';
import { COLABORADORES } from './personas';

const mesmoId = (a, b) => String(a) === String(b);

export const buscarColaborador = (id) =>
  COLABORADORES.find((colaborador) => mesmoId(colaborador.id, id));

export const buscarEquipe = (id) => EQUIPES.find((equipe) => mesmoId(equipe.id, id));

export const equipeDoColaborador = (colaboradorId) =>
  EQUIPES.find(({ membros }) => membros.some((id) => mesmoId(id, colaboradorId)));

export const membrosDaEquipe = (equipe) => equipe.membros.map(buscarColaborador);

export const conversasRecentes = () => CONVERSAS.map(buscarColaborador);

/** Mapa de sigla para nível mínimo, no formato que o CompetencyList recebe. */
export const minimosDaEquipe = (equipe) =>
  Object.fromEntries((equipe?.competenciasMinimas ?? []).map(({ sigla, nivel }) => [sigla, nivel]));

export { rotuloEquipe, tituloEquipe };
