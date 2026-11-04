/** Catálogo SFIA usado no sistema: cada sigla tem um nível máximo próprio. */
export const CATALOGO_COMPETENCIAS = {
  PRMG: { nome: 'Gestão de Projetos', nivelMax: 7 },
  ITSP: { nome: 'Programação/Desenvolvimento de Software', nivelMax: 6 },
  TEST: { nome: 'Testes Funcionais', nivelMax: 6 },
  PORT: { nome: 'Configuração de Software', nivelMax: 6 },
  URCH: { nome: 'Pesquisa de Usuário', nivelMax: 6 },
  GRDN: { nome: 'Design Gráfico', nivelMax: 5 },
  DESN: { nome: 'Projeto de Sistemas', nivelMax: 6 },
  UNAN: { nome: 'Análise da Experiência do Usuário', nivelMax: 5 },
};

export const competencia = (sigla, nivel) => ({ sigla, nivel, ...CATALOGO_COMPETENCIAS[sigla] });
