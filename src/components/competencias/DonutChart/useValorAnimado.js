import { useEffect, useState } from 'react';

const prefereMenosMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Anima de 0 até `alvo` com requestAnimationFrame, ou vai direto se o usuário pede menos movimento. */
export function useValorAnimado(alvo, duracao = 900) {
  const [valor, setValor] = useState(() => (prefereMenosMovimento() ? alvo : 0));

  useEffect(() => {
    const tempoTotal = prefereMenosMovimento() ? 0 : duracao;
    let inicio;

    let quadro = requestAnimationFrame(function passo(agora) {
      inicio ??= agora;
      const progresso = tempoTotal === 0 ? 1 : Math.min((agora - inicio) / tempoTotal, 1);
      const suavizado = 1 - (1 - progresso) ** 3;
      setValor(Math.round(alvo * suavizado));
      if (progresso < 1) quadro = requestAnimationFrame(passo);
    });

    return () => cancelAnimationFrame(quadro);
  }, [alvo, duracao]);

  return valor;
}
