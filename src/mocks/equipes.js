import fotoEquipe1 from '@/assets/images/equipes/FotoEquipe1.png';
import fotoEquipe2 from '@/assets/images/equipes/FotoEquipe2.png';
import fotoEquipe3 from '@/assets/images/equipes/FotoEquipe3.png';
import fotoEquipe4 from '@/assets/images/equipes/FotoEquipe4.png';
import { competencia } from './competencias';

/**
 * A Equipe 1 vem da tela antiga. As equipes 2 a 4 só existiam como card na home do gestor,
 * então seu conteúdo é fictício. A Equipe 4 fica sem membros de propósito: é o estado vazio.
 * `membros` guarda ids de personas.
 */
export const EQUIPES = [
  {
    id: 1,
    nome: 'Front-End',
    foto: fotoEquipe1,
    foco: 'Front-End e Identidade Visual BBTS',
    descricao:
      'Desenvolvemos a interface visual e a experiência do usuário (UX/UI) das soluções do Banco do Brasil. Dominamos HTML, CSS, JavaScript e frameworks modernos, com foco em entregar aplicações digitais responsivas, acessíveis e de alta performance. Somos a ponte entre o design e a funcionalidade, garantindo a excelência e a inovação tecnológica da BBTS.',
    membros: [2, 3, 4, 5],
    competenciasMinimas: [
      competencia('URCH', 4),
      competencia('GRDN', 5),
      competencia('TEST', 3),
      competencia('DESN', 5),
      competencia('UNAN', 3),
    ],
  },
  {
    id: 2,
    nome: 'Planejamento',
    foto: fotoEquipe2,
    foco: 'Planejamento e Gestão de Portfólio',
    descricao:
      'Organizamos prioridades, prazos e recursos dos projetos da BBTS, conectando as metas do negócio ao trabalho das equipes técnicas.',
    membros: [6],
    competenciasMinimas: [competencia('PRMG', 5), competencia('DESN', 4), competencia('URCH', 3)],
  },
  {
    id: 3,
    nome: 'Cyber Security',
    foto: fotoEquipe3,
    foco: 'Segurança da Informação BBTS',
    descricao:
      'Protegemos sistemas e dados com análise de riscos, testes de segurança e resposta a incidentes, em apoio às soluções do Banco do Brasil.',
    membros: [1, 7],
    competenciasMinimas: [
      competencia('PRMG', 4),
      competencia('ITSP', 4),
      competencia('TEST', 5),
      competencia('PORT', 3),
      competencia('URCH', 3),
    ],
  },
  {
    id: 4,
    nome: 'Administração',
    foto: fotoEquipe4,
    foco: 'Administração e Processos Internos',
    descricao:
      'Cuidamos dos processos internos que sustentam a operação da BBTS, do acompanhamento de indicadores ao apoio às demais equipes.',
    membros: [],
    competenciasMinimas: [competencia('PRMG', 3), competencia('URCH', 2)],
  },
];

/** Título exibido nos cards e na trilha de navegação. Ex.: "1. Front-End". */
export const tituloEquipe = ({ id, nome }) => `${id}. ${nome}`;

/** Rótulo curto usado na tag do colaborador. Ex.: "Equipe 03". */
export const rotuloEquipe = ({ id }) => `Equipe ${String(id).padStart(2, '0')}`;

/** Ids das personas nas conversas recentes da home do gestor. */
export const CONVERSAS = [1, 6, 7, 4];
