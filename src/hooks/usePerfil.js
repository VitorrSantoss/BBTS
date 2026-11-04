import { useContext } from 'react';
import { PerfilContext } from '@/app/providers/contextos';

export const usePerfil = () => useContext(PerfilContext);
