import { digitosDoTelefone } from '@/utils/mascaras';
import { CertificacaoAPI, ExperienciaAPI, IdiomaAPI, TecnologiaAPI, UsuarioAPI } from './api';

/** O usuário foi salvo, mas algum dado relacionado falhou. O cadastro já não pode ser repetido. */
export class ErroSalvamentoParcial extends Error {
  constructor(usuarioId, causa) {
    super('Salvamento parcial', { cause: causa });
    this.name = 'ErroSalvamentoParcial';
    this.usuarioId = usuarioId;
  }
}

export function mensagemDeErro(erro) {
  if (erro.status) {
    return `A API recusou os dados (erro ${erro.status}). Confira se o CPF e o e-mail já não estão em uso e tente de novo.`;
  }
  return 'Não conseguimos falar com a API. Tente de novo em instantes.';
}

const dataDeHoje = () => new Date().toLocaleDateString('sv-SE');
const semExtensao = (nomeArquivo) => nomeArquivo.replace(/\.[^.]+$/, '');

/**
 * A senha fica de fora: não há campo para ela e o valor fixo saiu do código.
 * Telefone vai só com dígitos, ou null: a regex da API não aceita a máscara nem texto vazio.
 */
const montarUsuario = ({ nome, cpf, email, telefone, dataNascimento }) => ({
  nome: nome.trim(),
  cpf,
  email: email.trim(),
  telefone: digitosDoTelefone(telefone) || null,
  dataNascimento,
});

const preenchidoNome = ({ id, nome }) => id || nome.trim();
const preenchidaExperiencia = ({ id, empresa, cargo }) => id || empresa.trim() || cargo.trim();

const montarNivel = ({ nome, nivel }) => ({ nome: nome.trim(), nivel });

const montarExperiencia = ({ empresa, cargo, dataInicio, dataFim, empregoAtual }) => ({
  empresa: empresa.trim(),
  cargo: cargo.trim(),
  dataInicio,
  dataFim: empregoAtual ? null : dataFim || null,
  empregoAtual,
});

const mudou = (dados, original) =>
  Object.keys(dados).some((campo) => dados[campo] !== original[campo]);

/**
 * Aplica as linhas do formulário na API: exclui o que saiu, atualiza o que mudou e cria o novo.
 * Campos que a tela não mostra, como `descricao`, são preservados a partir do original.
 */
async function sincronizar({ api, linhas, originais, montar, dono }) {
  const mantidos = new Set(linhas.map(({ id }) => id).filter(Boolean));

  for (const original of originais) {
    if (!mantidos.has(original.id)) await api.excluir(original.id);
  }

  for (const linha of linhas) {
    const dados = montar(linha);
    const original = originais.find(({ id }) => id === linha.id);

    if (!original) await api.cadastrar({ ...dados, ...dono });
    else if (mudou(dados, original))
      await api.atualizar(linha.id, { ...original, ...dados, ...dono });
  }
}

/** Certificados não são editados: o PUT da API apagaria o arquivo enviado sem um novo. */
async function sincronizarCertificados({ linhas, originais, dono }) {
  const mantidos = new Set(linhas.map(({ id }) => id).filter(Boolean));

  for (const original of originais) {
    if (!mantidos.has(original.id)) await CertificacaoAPI.excluir(original.id);
  }

  for (const { arquivo } of linhas) {
    if (arquivo) {
      const dados = {
        nomeCurso: semExtensao(arquivo.name),
        dataConclusao: dataDeHoje(),
        ...dono,
      };
      await CertificacaoAPI.cadastrar(dados, arquivo);
    }
  }
}

/**
 * Sem `usuarioId` cria o usuário com POST. Com `usuarioId`, usa PUT e nunca duplica o cadastro.
 * `original` traz o que veio da API, para comparar as linhas.
 */
export async function salvarCadastro({ usuarioId, valores, original }) {
  let id = usuarioId;

  if (id) await UsuarioAPI.atualizar(id, montarUsuario(valores));
  else id = (await UsuarioAPI.cadastrar(montarUsuario(valores))).id;

  const dono = { usuario: { id: Number(id) } };

  try {
    await sincronizar({
      api: IdiomaAPI,
      linhas: valores.idiomas.filter(preenchidoNome),
      originais: original?.idiomas ?? [],
      montar: montarNivel,
      dono,
    });
    await sincronizar({
      api: TecnologiaAPI,
      linhas: valores.tecnologias.filter(preenchidoNome),
      originais: original?.tecnologias ?? [],
      montar: montarNivel,
      dono,
    });
    await sincronizar({
      api: ExperienciaAPI,
      linhas: valores.experiencias.filter(preenchidaExperiencia),
      originais: original?.experiencias ?? [],
      montar: montarExperiencia,
      dono,
    });
    await sincronizarCertificados({
      linhas: valores.certificados,
      originais: original?.certificacoes ?? [],
      dono,
    });
  } catch (causa) {
    throw new ErroSalvamentoParcial(id, causa);
  }

  return id;
}
