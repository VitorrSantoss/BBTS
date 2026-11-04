import { useCallback } from 'react';
import { colaboradorDaApi, PEDRO } from '@/mocks/personas';
import { UsuarioAPI } from '@/services/api';
import { lerUsuarioId } from '@/services/sessao';
import { useRecurso } from './useRecurso';

/** Usuário logado no dashboard: API quando há `usuarioId`, com queda para a persona fixa. */
export function useUsuario() {
  const usuarioId = lerUsuarioId();

  const carregar = useCallback(async () => {
    if (!usuarioId) return { usuario: PEDRO, erro: null };

    try {
      return { usuario: colaboradorDaApi(await UsuarioAPI.buscarPorId(usuarioId)), erro: null };
    } catch (erro) {
      return { usuario: PEDRO, erro };
    }
  }, [usuarioId]);

  const { dados, erro, carregando, recarregar } = useRecurso(carregar);

  return {
    usuario: dados?.usuario ?? null,
    erro: dados?.erro ?? erro,
    carregando,
    recarregar,
    consultaApi: Boolean(usuarioId),
  };
}
