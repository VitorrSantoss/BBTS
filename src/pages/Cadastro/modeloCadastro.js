import { mascararCpf, mascararTelefone } from '@/utils/mascaras';
import {
  semErrosVazios,
  validarCpf,
  validarEmail,
  validarObrigatorio,
  validarTelefone,
} from '@/utils/validacao';

let ultimaChave = 0;

/** Chave estável de uma linha dinâmica, independente do id que vem da API. */
const novaChave = () => {
  ultimaChave += 1;
  return ultimaChave;
};

export const novoIdioma = () => ({ chave: novaChave(), nome: '', nivel: 'INTERMEDIARIO' });

export const novaTecnologia = () => ({ chave: novaChave(), nome: '', nivel: 'PLENO' });

export const novaExperiencia = () => ({
  chave: novaChave(),
  empresa: '',
  cargo: '',
  dataInicio: '',
  dataFim: '',
  empregoAtual: false,
});

export const novoCertificado = () => ({ chave: novaChave(), arquivo: null });

export const formularioVazio = () => ({
  nome: '',
  cpf: '',
  area: '',
  email: '',
  telefone: '',
  dataNascimento: '',
  idiomas: [novoIdioma()],
  tecnologias: [novaTecnologia()],
  experiencias: [novaExperiencia()],
  certificados: [novoCertificado()],
});

/** A persona fixa usa a escala de idiomas nas habilidades. O select só conhece a da API. */
const NIVEL_TECNOLOGIA_DO_MOCK = { BASICO: 'JUNIOR', INTERMEDIARIO: 'PLENO', AVANCADO: 'SENIOR' };

const comChave = (item) => ({ ...item, chave: novaChave() });

/** Preenche o formulário com os dados existentes, para a edição. */
export const formularioDoColaborador = (colaborador) => ({
  nome: colaborador.nome ?? '',
  cpf: mascararCpf(colaborador.cpf),
  area: colaborador.area ?? '',
  email: colaborador.email ?? '',
  telefone: mascararTelefone(colaborador.telefone),
  dataNascimento: colaborador.dataNascimento ?? '',
  idiomas: colaborador.idiomas.map(comChave),
  tecnologias: colaborador.tecnologias.map((tecnologia) => ({
    ...comChave(tecnologia),
    nivel: NIVEL_TECNOLOGIA_DO_MOCK[tecnologia.nivel] ?? tecnologia.nivel,
  })),
  experiencias: colaborador.experiencias.map((experiencia) => ({
    ...comChave(experiencia),
    dataFim: experiencia.dataFim ?? '',
    empregoAtual: Boolean(experiencia.empregoAtual),
  })),
  certificados: colaborador.certificacoes.map((certificado) => ({
    ...comChave(certificado),
    arquivo: null,
  })),
});

/** Chave do erro de um campo de linha. É também o `name` do input. */
export const campoDaLinha = (lista, chave, campo) => `${lista}.${chave}.${campo}`;

/** Linhas novas em branco são ignoradas. Linha existente sem nome pede a remoção. */
const validarLinhasDeNome = (lista, linhas, mensagem) =>
  Object.fromEntries(
    linhas
      .filter(({ id, nome }) => id && !nome.trim())
      .map(({ chave }) => [campoDaLinha(lista, chave, 'nome'), mensagem]),
  );

function validarExperiencia(experiencia) {
  const { chave, empresa, cargo, dataInicio, dataFim, empregoAtual } = experiencia;
  const emBranco = !empresa.trim() && !cargo.trim() && !dataInicio;
  if (emBranco && !experiencia.id) return {};

  const erro = (campo, mensagem) => [campoDaLinha('experiencias', chave, campo), mensagem];
  const fimAntesDoInicio = !empregoAtual && dataFim && dataInicio && dataFim < dataInicio;

  return Object.fromEntries([
    erro('empresa', validarObrigatorio(empresa, 'Informe a empresa.')),
    erro('cargo', validarObrigatorio(cargo, 'Informe o cargo.')),
    erro('dataInicio', validarObrigatorio(dataInicio, 'Informe a data de início.')),
    erro('dataFim', fimAntesDoInicio ? 'O fim não pode ser antes do início.' : ''),
  ]);
}

/** Valida o que a API exige, para o erro aparecer no campo e não como falha no envio. */
export function validarCadastro(valores) {
  const { nome, cpf, email, telefone, dataNascimento, idiomas, tecnologias, experiencias } =
    valores;

  return semErrosVazios({
    nome: validarObrigatorio(nome, 'Informe o nome completo.'),
    cpf: validarCpf(cpf),
    email: validarEmail(email),
    telefone: validarTelefone(telefone),
    dataNascimento: validarObrigatorio(dataNascimento, 'Informe a data de nascimento.'),
    ...validarLinhasDeNome('idiomas', idiomas, 'Informe o idioma ou remova a linha.'),
    ...validarLinhasDeNome('tecnologias', tecnologias, 'Informe a tecnologia ou remova a linha.'),
    ...Object.assign({}, ...experiencias.map(validarExperiencia)),
  });
}
