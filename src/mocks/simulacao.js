/**
 * Espera curta para as ações que o backend ainda não atende (login, convites, feedback e
 * nova competência). Mantém o mesmo fluxo de envio de um formulário real.
 */
export const simularEnvio = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));
