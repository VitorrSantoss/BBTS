import { useEffect, useState } from 'react'

const prefereMenosMovimento = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Anima um número de 0 até `alvo` (ease-out). Com reduced-motion, vai direto ao valor. */
export function useValorAnimado(alvo: number, duracaoMs = 900): number {
  const reduzir = prefereMenosMovimento()
  const [valor, setValor] = useState(0)

  useEffect(() => {
    if (reduzir) return
    let quadro = 0
    const inicio = performance.now()
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / duracaoMs)
      setValor(Math.round(alvo * (1 - (1 - t) ** 3)))
      if (t < 1) quadro = requestAnimationFrame(passo)
    }
    quadro = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(quadro)
  }, [alvo, duracaoMs, reduzir])

  return reduzir ? alvo : valor
}
