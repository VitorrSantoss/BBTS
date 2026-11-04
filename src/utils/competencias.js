/** Percentual do nível total: soma dos níveis atuais sobre a soma dos níveis máximos. */
export function calcularNivelTotal(competencias) {
  const maximo = competencias.reduce((soma, { nivelMax }) => soma + nivelMax, 0);
  if (maximo === 0) return 0;
  const atual = competencias.reduce((soma, { nivel }) => soma + nivel, 0);
  return Math.round((atual / maximo) * 100);
}
