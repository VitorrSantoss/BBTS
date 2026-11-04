import { apenasDigitos, digitosDoTelefone } from './mascaras';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIGLA_SFIA = /^[A-Za-z]{4}$/;

export const validarObrigatorio = (valor, mensagem) => (String(valor ?? '').trim() ? '' : mensagem);

export function validarEmail(valor, { obrigatorio = true } = {}) {
  const email = String(valor ?? '').trim();
  if (!email) return obrigatorio ? 'Informe o e-mail.' : '';
  return EMAIL.test(email) ? '' : 'Digite um e-mail válido, como nome@empresa.com.';
}

export function validarCpf(valor) {
  const digitos = apenasDigitos(valor);
  if (!digitos) return 'Informe o CPF.';
  return digitos.length === 11 ? '' : 'O CPF precisa ter 11 dígitos.';
}

export function validarTelefone(valor) {
  const digitos = digitosDoTelefone(valor);
  if (!digitos) return '';
  return digitos.length >= 10 ? '' : 'Informe o DDD e o número completo.';
}

export function validarSigla(valor) {
  if (!String(valor ?? '').trim()) return 'Informe a sigla.';
  return SIGLA_SFIA.test(valor) ? '' : 'A sigla SFIA tem exatamente 4 letras.';
}

/** Níveis SFIA vão de 1 a 7. */
export function validarNivel(valor, mensagem) {
  if (String(valor ?? '').trim() === '') return mensagem;
  const nivel = Number(valor);
  return Number.isInteger(nivel) && nivel >= 1 && nivel <= 7
    ? ''
    : 'Use um número inteiro de 1 a 7.';
}

/** Mantém no objeto só os campos com erro. */
export const semErrosVazios = (erros) =>
  Object.fromEntries(Object.entries(erros).filter(([, mensagem]) => mensagem));
