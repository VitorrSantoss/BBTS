import { useCallback } from 'react';
import { buscarEquipe, conversasRecentes, membrosDaEquipe } from '@/mocks/consultas';
import { EQUIPES } from '@/mocks/equipes';
import { useRecurso } from './useRecurso';

/* Equipes e conversas não têm endpoint. Assíncronos para a tela já tratar loading e erro. */

const carregarPainel = async () => ({ equipes: EQUIPES, conversas: conversasRecentes() });

export function usePainelGestor() {
  return useRecurso(carregarPainel);
}

export function useEquipe(id) {
  const carregar = useCallback(async () => {
    const equipe = buscarEquipe(id);
    return equipe ? { equipe, membros: membrosDaEquipe(equipe) } : null;
  }, [id]);

  return useRecurso(carregar);
}
