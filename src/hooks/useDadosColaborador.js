import { useCallback } from 'react';
import { buscarColaborador, equipeDoColaborador } from '@/mocks/consultas';
import { colaboradorDaApi, PEDRO } from '@/mocks/personas';
import {
  CertificacaoAPI,
  ExperienciaAPI,
  IdiomaAPI,
  TecnologiaAPI,
  UsuarioAPI,
} from '@/services/api';
import { lerUsuarioId } from '@/services/sessao';
import { useRecurso } from './useRecurso';

/**
 * Os endpoints de lista devolvem o usuário completo em cada item, inclusive a senha.
 * Só o dono do registro interessa, e o restante é descartado aqui mesmo.
 * `dadosArquivo` também sai: é o PDF inteiro em base64.
 */
const semDadosSensiveis = ({ usuario: _usuario, dadosArquivo: _dadosArquivo, ...item }) => item;

function itensDoUsuario(resultado, usuarioId) {
  if (resultado.status === 'rejected') return [];
  return (resultado.value ?? [])
    .filter((item) => item.usuario?.id === usuarioId)
    .map(semDadosSensiveis);
}

/** Port de buscarDadosCompletos, de js/visualizarDados.js. */
async function buscarDadosCompletos(usuarioId) {
  const id = Number(usuarioId);
  const usuario = await UsuarioAPI.buscarPorId(id);

  const listas = await Promise.allSettled([
    IdiomaAPI.listarTodos(),
    TecnologiaAPI.listarTodas(),
    ExperienciaAPI.listarTodas(),
    CertificacaoAPI.listarTodas(),
  ]);
  const [idiomas, tecnologias, experiencias, certificacoes] = listas;
  const falha = listas.find(({ status }) => status === 'rejected');

  return {
    colaborador: {
      ...colaboradorDaApi(usuario),
      idiomas: itensDoUsuario(idiomas, id),
      tecnologias: itensDoUsuario(tecnologias, id),
      experiencias: itensDoUsuario(experiencias, id),
      certificacoes: itensDoUsuario(certificacoes, id),
    },
    origem: 'api',
    erro: falha?.reason ?? null,
  };
}

/**
 * Dados completos de um colaborador.
 * - Com `colaboradorId`: visão do gestor, sobre as personas fixas.
 * - Sem `colaboradorId`: o próprio colaborador. Usa a API quando há `usuarioId` e cai no mock
 *   se ela falhar. Nesse caso `erro` vem preenchido junto com os dados do mock.
 */
export function useDadosColaborador({ colaboradorId } = {}) {
  const visaoDoGestor = colaboradorId !== undefined;
  const usuarioId = visaoDoGestor ? null : lerUsuarioId();

  const carregar = useCallback(async () => {
    if (colaboradorId !== undefined) {
      return { colaborador: buscarColaborador(colaboradorId) ?? null, origem: 'mock', erro: null };
    }
    if (!usuarioId) return { colaborador: PEDRO, origem: 'mock', erro: null };

    try {
      return await buscarDadosCompletos(usuarioId);
    } catch (erro) {
      return { colaborador: PEDRO, origem: 'mock', erro };
    }
  }, [colaboradorId, usuarioId]);

  const { dados, erro, carregando, recarregar } = useRecurso(carregar);

  const colaborador = dados?.colaborador ?? null;
  const origem = dados?.origem ?? null;

  return {
    colaborador,
    origem,
    // Equipes só existem nos mocks. Id de usuário real não pode ser comparado com id de persona.
    equipe: colaborador && origem === 'mock' ? (equipeDoColaborador(colaborador.id) ?? null) : null,
    erro: dados?.erro ?? erro,
    carregando,
    recarregar,
    consultaApi: Boolean(usuarioId),
  };
}
