import { useMatches } from 'react-router';

/** Nome da página definido em `handle.titulo` na rota mais específica. */
export function useTituloDaRota() {
  const rotas = useMatches();
  return rotas.findLast(({ handle }) => handle?.titulo)?.handle.titulo ?? '';
}
