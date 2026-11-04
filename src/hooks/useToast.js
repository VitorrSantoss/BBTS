import { useContext } from 'react';
import { ToastContext } from '@/app/providers/contextos';

/** Retorna `{ sucesso, erro, info }`. Cada função recebe a mensagem. */
export const useToast = () => useContext(ToastContext);
