import { useCallback, useEffect, useState } from 'react';

/**
 * Executa `carregar` (estável, via useCallback) e expõe loading, erro e dados.
 * O carregamento é derivado do resultado: troca de `carregar` ou nova tentativa voltam a
 * carregar sem estado intermediário, e respostas antigas são descartadas.
 */
export function useRecurso(carregar) {
  const [tentativa, setTentativa] = useState(0);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    let ativo = true;

    Promise.resolve()
      .then(carregar)
      .then(
        (dados) => ativo && setResultado({ carregar, tentativa, dados, erro: null }),
        (erro) => ativo && setResultado({ carregar, tentativa, dados: null, erro }),
      );

    return () => {
      ativo = false;
    };
  }, [carregar, tentativa]);

  const recarregar = useCallback(() => setTentativa((atual) => atual + 1), []);
  const carregando = resultado?.carregar !== carregar || resultado?.tentativa !== tentativa;

  return {
    dados: carregando ? null : resultado.dados,
    erro: carregando ? null : resultado.erro,
    carregando,
    recarregar,
  };
}
