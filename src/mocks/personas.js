import fotoCarla from '@/assets/images/personas/PersonaGestoraCarla.png';
import fotoCarolina from '@/assets/images/personas/PersonaCarolina.png';
import fotoFernanda from '@/assets/images/personas/PersonaFernanda.png';
import fotoGabriel from '@/assets/images/personas/PersonaGabriel.png';
import fotoGuilherme from '@/assets/images/personas/PersonaGuilherme.png';
import fotoPedro from '@/assets/images/personas/PersonaColabPedro.png';
import fotoRenata from '@/assets/images/personas/PersonaRenata.png';
import fotoRicardo from '@/assets/images/personas/PersonaRicardo.png';
import { competencia } from './competencias';

/** Conteúdo do dashboard que a API não tem. Vale para todo colaborador. */
const LACUNAS = [
  'Gestão de projetos',
  'Data Science',
  'Design Thinking',
  'Comunicação',
  'Espírito de equipe',
];

const JORNADA = ['Cursos de Projetos Ágeis', 'Introdução a Ciência de Dados', 'Design Thinking'];

const BASE = { lacunas: LACUNAS, jornada: JORNADA, certificacoes: [] };

/** Pedro é a persona padrão do colaborador. Os dados dele vêm das telas antigas. */
export const PEDRO = {
  ...BASE,
  id: 1,
  nome: 'Pedro Henrique',
  email: 'pedro.henrique@bbts.com.br',
  cpf: '123.456.789-09',
  telefone: '(81) 91234-5678',
  dataNascimento: '1999-05-14',
  foto: fotoPedro,
  area: 'Análise de Sistemas',
  areas: ['Cibersegurança', 'Análise de Sistemas', 'Suporte de T.I'],
  competencias: [
    competencia('PRMG', 7),
    competencia('ITSP', 5),
    competencia('TEST', 6),
    competencia('PORT', 4),
    competencia('URCH', 4),
  ],
  formacoes: [
    {
      periodo: '2025 - 2027',
      status: 'Cursando',
      instituicao: 'Faculdade Senac PE',
      curso: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
    },
    {
      periodo: '2022 - 2023',
      status: 'Concluído',
      instituicao: 'IFPE',
      curso: 'Técnico em Tecnologia da Informação',
    },
  ],
  experiencias: [
    {
      id: 1,
      empresa: 'Rede Globo (Recife)',
      cargo: 'Estágio de T.I',
      dataInicio: '2023-08-01',
      dataFim: '2024-06-30',
      empregoAtual: false,
    },
  ],
  idiomas: [
    { id: 1, nome: 'Português', nivel: 'NATIVO' },
    { id: 2, nome: 'Inglês', nivel: 'AVANCADO' },
    { id: 3, nome: 'Espanhol', nivel: 'BASICO' },
  ],
  tecnologias: [
    { id: 1, nome: 'Java', nivel: 'AVANCADO' },
    { id: 2, nome: 'Suporte Técnico', nivel: 'AVANCADO' },
    { id: 3, nome: 'Figma', nivel: 'INTERMEDIARIO' },
    { id: 4, nome: 'Excel', nivel: 'BASICO' },
  ],
};

/** A gestora só precisa de identidade: nome e foto. */
export const CARLA = { id: 8, nome: 'Carla Souza', foto: fotoCarla };

/**
 * Colaboradores vistos pela gestora. Nome e foto vêm das telas antigas, o restante é fictício.
 * Carolina fica sem experiências de propósito: é o estado vazio do perfil.
 */
export const COLABORADORES = [
  PEDRO,
  {
    ...BASE,
    id: 2,
    nome: 'Gabriel Arruda',
    foto: fotoGabriel,
    area: 'Desenvolvimento Front-End',
    areas: ['Front-End', 'UX/UI'],
    competencias: [
      competencia('URCH', 4),
      competencia('GRDN', 4),
      competencia('TEST', 3),
      competencia('DESN', 5),
      competencia('UNAN', 3),
    ],
    formacoes: [
      {
        periodo: '2021 - 2024',
        status: 'Concluído',
        instituicao: 'Faculdade Senac PE',
        curso: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
      },
    ],
    experiencias: [
      {
        id: 1,
        empresa: 'BBTS',
        cargo: 'Desenvolvedor Front-End',
        dataInicio: '2024-02-01',
        dataFim: null,
        empregoAtual: true,
      },
    ],
    idiomas: [
      { id: 1, nome: 'Português', nivel: 'NATIVO' },
      { id: 2, nome: 'Inglês', nivel: 'INTERMEDIARIO' },
    ],
    tecnologias: [
      { id: 1, nome: 'React', nivel: 'PLENO' },
      { id: 2, nome: 'JavaScript', nivel: 'PLENO' },
    ],
  },
  {
    ...BASE,
    id: 3,
    nome: 'Guilherme Silva',
    foto: fotoGuilherme,
    area: 'Desenvolvimento Front-End',
    areas: ['Front-End', 'Acessibilidade'],
    competencias: [
      competencia('URCH', 3),
      competencia('GRDN', 5),
      competencia('TEST', 4),
      competencia('DESN', 4),
      competencia('UNAN', 4),
    ],
    formacoes: [
      {
        periodo: '2020 - 2023',
        status: 'Concluído',
        instituicao: 'IFPE',
        curso: 'Tecnólogo em Sistemas para Internet',
      },
    ],
    experiencias: [
      {
        id: 1,
        empresa: 'BBTS',
        cargo: 'Desenvolvedor Front-End',
        dataInicio: '2023-03-01',
        dataFim: null,
        empregoAtual: true,
      },
    ],
    idiomas: [
      { id: 1, nome: 'Português', nivel: 'NATIVO' },
      { id: 2, nome: 'Inglês', nivel: 'AVANCADO' },
    ],
    tecnologias: [
      { id: 1, nome: 'CSS', nivel: 'SENIOR' },
      { id: 2, nome: 'React', nivel: 'PLENO' },
    ],
  },
  {
    ...BASE,
    id: 4,
    nome: 'Renata Lima',
    foto: fotoRenata,
    area: 'Design de Produto',
    areas: ['UX/UI', 'Pesquisa'],
    competencias: [
      competencia('URCH', 5),
      competencia('GRDN', 5),
      competencia('TEST', 3),
      competencia('DESN', 5),
      competencia('UNAN', 4),
    ],
    formacoes: [
      {
        periodo: '2019 - 2022',
        status: 'Concluído',
        instituicao: 'UFPE',
        curso: 'Design',
      },
    ],
    experiencias: [
      {
        id: 1,
        empresa: 'BBTS',
        cargo: 'Designer de Produto',
        dataInicio: '2022-09-01',
        dataFim: null,
        empregoAtual: true,
      },
    ],
    idiomas: [
      { id: 1, nome: 'Português', nivel: 'NATIVO' },
      { id: 2, nome: 'Inglês', nivel: 'FLUENTE' },
    ],
    tecnologias: [{ id: 1, nome: 'Figma', nivel: 'SENIOR' }],
  },
  {
    ...BASE,
    id: 5,
    nome: 'Carolina Rocha',
    foto: fotoCarolina,
    area: 'Identidade Visual',
    areas: ['Design Gráfico', 'Front-End'],
    competencias: [
      competencia('URCH', 4),
      competencia('GRDN', 5),
      competencia('TEST', 2),
      competencia('DESN', 4),
      competencia('UNAN', 3),
    ],
    formacoes: [
      {
        periodo: '2023 - 2026',
        status: 'Cursando',
        instituicao: 'Faculdade Senac PE',
        curso: 'Tecnólogo em Design Gráfico',
      },
    ],
    experiencias: [],
    idiomas: [{ id: 1, nome: 'Português', nivel: 'NATIVO' }],
    tecnologias: [{ id: 1, nome: 'Illustrator', nivel: 'PLENO' }],
  },
  {
    ...BASE,
    id: 6,
    nome: 'Fernanda',
    foto: fotoFernanda,
    area: 'Planejamento Estratégico',
    areas: ['Planejamento', 'Gestão'],
    competencias: [competencia('PRMG', 6), competencia('DESN', 4), competencia('URCH', 4)],
    formacoes: [
      {
        periodo: '2016 - 2020',
        status: 'Concluído',
        instituicao: 'UFPE',
        curso: 'Administração',
      },
    ],
    experiencias: [
      {
        id: 1,
        empresa: 'BBTS',
        cargo: 'Analista de Planejamento',
        dataInicio: '2021-01-01',
        dataFim: null,
        empregoAtual: true,
      },
    ],
    idiomas: [
      { id: 1, nome: 'Português', nivel: 'NATIVO' },
      { id: 2, nome: 'Inglês', nivel: 'AVANCADO' },
    ],
    tecnologias: [{ id: 1, nome: 'Excel', nivel: 'SENIOR' }],
  },
  {
    ...BASE,
    id: 7,
    nome: 'Ricardo',
    foto: fotoRicardo,
    area: 'Segurança da Informação',
    areas: ['Cibersegurança', 'Infraestrutura'],
    competencias: [
      competencia('PRMG', 4),
      competencia('ITSP', 5),
      competencia('TEST', 4),
      competencia('PORT', 4),
      competencia('URCH', 3),
    ],
    formacoes: [
      {
        periodo: '2017 - 2021',
        status: 'Concluído',
        instituicao: 'UPE',
        curso: 'Sistemas de Informação',
      },
    ],
    experiencias: [
      {
        id: 1,
        empresa: 'BBTS',
        cargo: 'Analista de Segurança',
        dataInicio: '2022-04-01',
        dataFim: null,
        empregoAtual: true,
      },
    ],
    idiomas: [
      { id: 1, nome: 'Português', nivel: 'NATIVO' },
      { id: 2, nome: 'Inglês', nivel: 'AVANCADO' },
    ],
    tecnologias: [
      { id: 1, nome: 'Python', nivel: 'PLENO' },
      { id: 2, nome: 'Linux', nivel: 'SENIOR' },
    ],
  },
];

/** Monta a versão fixa de um usuário real: dados da API sobre o conteúdo que só existe em mock. */
export function colaboradorDaApi(usuario) {
  return {
    ...BASE,
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    cpf: usuario.cpf,
    telefone: usuario.telefone,
    dataNascimento: usuario.dataNascimento,
    foto: null,
    area: null,
    areas: [],
    competencias: PEDRO.competencias,
    formacoes: [],
    experiencias: [],
    idiomas: [],
    tecnologias: [],
  };
}
