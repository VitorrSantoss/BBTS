export const apenasDigitos = (valor = '') => String(valor ?? '').replace(/\D/g, '');

/** 000.000.000-00 */
export function mascararCpf(valor) {
  const digitos = apenasDigitos(valor).slice(0, 11);
  const inicio = [digitos.slice(0, 3), digitos.slice(3, 6), digitos.slice(6, 9)]
    .filter(Boolean)
    .join('.');
  return digitos.length > 9 ? `${inicio}-${digitos.slice(9)}` : inicio;
}

/** Celular ou fixo com DDD. Aceita o formato com DDD de 3 dígitos que a API também guarda. */
export function digitosDoTelefone(valor) {
  const digitos = apenasDigitos(valor);
  return digitos.length === 12 && digitos.startsWith('0') ? digitos.slice(1) : digitos.slice(0, 11);
}

/** (00) 00000-0000 ou (00) 0000-0000 */
export function mascararTelefone(valor) {
  const digitos = digitosDoTelefone(valor);
  if (digitos.length === 0) return '';
  if (digitos.length <= 2) return `(${digitos}`;

  const ddd = digitos.slice(0, 2);
  const numero = digitos.slice(2);
  if (numero.length <= 4) return `(${ddd}) ${numero}`;

  const corte = digitos.length === 11 ? 5 : 4;
  return `(${ddd}) ${numero.slice(0, corte)}-${numero.slice(corte)}`;
}
