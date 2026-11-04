const ROTULOS_NIVEL = {
  INICIANTE: 'Iniciante',
  BASICO: 'Básico',
  INTERMEDIARIO: 'Intermediário',
  AVANCADO: 'Avançado',
  FLUENTE: 'Fluente',
  NATIVO: 'Nativo',
  JUNIOR: 'Júnior',
  PLENO: 'Pleno',
  SENIOR: 'Sênior',
};

const opcoes = (...niveis) => niveis.map((valor) => ({ valor, rotulo: ROTULOS_NIVEL[valor] }));

/** Valores dos enums NivelIdioma e NivelHabilidades da API. */
export const NIVEIS_IDIOMA = opcoes(
  'INICIANTE',
  'BASICO',
  'INTERMEDIARIO',
  'AVANCADO',
  'FLUENTE',
  'NATIVO',
);
export const NIVEIS_TECNOLOGIA = opcoes('JUNIOR', 'PLENO', 'SENIOR');

export const rotuloNivel = (nivel) => ROTULOS_NIVEL[nivel] ?? nivel;

export const primeiroNome = (nome = '') => nome.trim().split(/\s+/)[0];

/** 2023-08-01 vira 08.2023, o formato das telas de perfil. */
export function formatarMesAno(dataIso) {
  if (!dataIso) return '';
  const [ano, mes] = dataIso.split('-');
  return `${mes}.${ano}`;
}

export function periodoDaExperiencia({ dataInicio, dataFim, empregoAtual }) {
  const fim = empregoAtual ? 'Atual' : formatarMesAno(dataFim);
  return [formatarMesAno(dataInicio), fim].filter(Boolean).join(' - ');
}
