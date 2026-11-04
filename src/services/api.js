/**
 * Comunicação com a API. Port de js/apiService.js, com os mesmos endpoints e o mesmo retry.
 * Toda chamada de rede do app passa por aqui.
 */
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

const CABECALHOS_JSON = { 'Content-Type': 'application/json' };
const ESPERA_ENTRE_TENTATIVAS_MS = 2000;

export class ErroApi extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
  }
}

async function tratarResposta(resposta) {
  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({
      message: `Erro HTTP ${resposta.status}: ${resposta.statusText}`,
    }));
    throw new ErroApi(erro.message || `Erro: ${resposta.status}`, resposta.status);
  }

  // Alguns endpoints, como o DELETE, respondem sem corpo.
  const tipo = resposta.headers.get('content-type');
  return tipo?.includes('application/json') ? resposta.json() : null;
}

/** Repete em falha de rede, comum enquanto o serviço do Render acorda. */
async function fetchComRetry(url, opcoes = {}, tentativas = 3) {
  try {
    return await fetch(url, opcoes);
  } catch (erro) {
    if (tentativas > 0 && erro.name === 'TypeError') {
      await new Promise((resolve) => setTimeout(resolve, ESPERA_ENTRE_TENTATIVAS_MS));
      return fetchComRetry(url, opcoes, tentativas - 1);
    }
    throw erro;
  }
}

const requisitar = async (caminho, opcoes) =>
  tratarResposta(await fetchComRetry(`${API_BASE_URL}${caminho}`, opcoes));

const enviarJson = (caminho, method, corpo) =>
  requisitar(caminho, { method, headers: CABECALHOS_JSON, body: JSON.stringify(corpo) });

async function excluir(caminho, recurso) {
  const resposta = await fetchComRetry(`${API_BASE_URL}${caminho}`, { method: 'DELETE' });
  if (!resposta.ok) {
    throw new ErroApi(`Erro ao excluir ${recurso}: ${resposta.status}`, resposta.status);
  }
  return true;
}

/** Operações comuns de um recurso JSON. */
const recurso = (caminho, nome) => ({
  listar: () => requisitar(caminho),
  buscarPorId: (id) => requisitar(`${caminho}/${id}`),
  cadastrar: (dados) => enviarJson(caminho, 'POST', dados),
  atualizar: (id, dados) => enviarJson(`${caminho}/${id}`, 'PUT', dados),
  excluir: (id) => excluir(`${caminho}/${id}`, nome),
});

/** Multipart com `dados` em JSON e `arquivo` opcional. O navegador define o Content-Type. */
function corpoDaCertificacao(certificacao, arquivo) {
  const corpo = new FormData();
  corpo.append('dados', new Blob([JSON.stringify(certificacao)], { type: 'application/json' }));
  if (arquivo) corpo.append('arquivo', arquivo);
  return corpo;
}

const usuarios = recurso('/usuarios', 'usuário');
const idiomas = recurso('/idiomas', 'idioma');
const tecnologias = recurso('/tecnologias', 'tecnologia');
const certificacoes = recurso('/certificacoes', 'certificação');
const experiencias = recurso('/experienciaProfissional', 'experiência');

export const UsuarioAPI = { ...usuarios, listarTodos: usuarios.listar };
export const IdiomaAPI = { ...idiomas, listarTodos: idiomas.listar };
export const TecnologiaAPI = { ...tecnologias, listarTodas: tecnologias.listar };
export const ExperienciaAPI = { ...experiencias, listarTodas: experiencias.listar };

export const CertificacaoAPI = {
  ...certificacoes,
  listarTodas: certificacoes.listar,
  cadastrar: (certificacao, arquivo = null) =>
    requisitar('/certificacoes', {
      method: 'POST',
      body: corpoDaCertificacao(certificacao, arquivo),
    }),
  atualizar: (id, certificacao, arquivo = null) =>
    requisitar(`/certificacoes/${id}`, {
      method: 'PUT',
      body: corpoDaCertificacao(certificacao, arquivo),
    }),
};

export async function verificarConexaoAPI() {
  try {
    const resposta = await fetchComRetry(`${API_BASE_URL}/usuarios`);
    return resposta.ok;
  } catch {
    return false;
  }
}

export const getAPIBaseURL = () => API_BASE_URL;
