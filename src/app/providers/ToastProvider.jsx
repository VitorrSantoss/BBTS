import { useCallback, useMemo, useRef, useState } from 'react';
import { ToastRegion } from '@/components/ui';
import { ToastContext } from './contextos';

const DURACAO_MS = { sucesso: 5000, info: 6000, erro: 9000 };
const MAXIMO_VISIVEL = 3;

/** Substitui todos os alert() da versão antiga. */
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const proximoId = useRef(0);

  const fechar = useCallback((id) => {
    setToasts((atuais) => atuais.filter((toast) => toast.id !== id));
  }, []);

  const mostrar = useCallback(
    (tipo, mensagem) => {
      proximoId.current += 1;
      const id = proximoId.current;
      setToasts((atuais) => [...atuais, { id, tipo, mensagem }].slice(-MAXIMO_VISIVEL));
      setTimeout(() => fechar(id), DURACAO_MS[tipo]);
    },
    [fechar],
  );

  const valor = useMemo(
    () => ({
      sucesso: (mensagem) => mostrar('sucesso', mensagem),
      erro: (mensagem) => mostrar('erro', mensagem),
      info: (mensagem) => mostrar('info', mensagem),
    }),
    [mostrar],
  );

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <ToastRegion toasts={toasts} aoFechar={fechar} />
    </ToastContext.Provider>
  );
}
