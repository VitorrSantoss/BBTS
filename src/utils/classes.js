/** Junta nomes de classe, ignorando valores vazios. */
export const cx = (...classes) => classes.filter(Boolean).join(' ');
