import iconePerfil from '@/assets/images/personas/IconePerfil.png';
import { cx } from '@/utils/classes';
import styles from './Avatar.module.css';

/** Foto circular. Sem `src`, usa o ícone de perfil padrão: a API não guarda fotos. */
export default function Avatar({ src, alt, tamanho = 48, borda = 'nenhuma', className }) {
  return (
    <img
      src={src ?? iconePerfil}
      alt={alt}
      width={tamanho}
      height={tamanho}
      decoding="async"
      className={cx(styles.avatar, styles[borda], className)}
    />
  );
}
