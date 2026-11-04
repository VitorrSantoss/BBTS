import { Link } from 'react-router';
import { cx } from '@/utils/classes';
import Icon from '../Icon/Icon';
import styles from './Button.module.css';

/**
 * Variantes:
 * - primario: azul com texto branco, o botão padrão.
 * - destaque: amarelo com texto azul, só sobre superfícies azuis.
 * - secundario: contorno azul sobre superfícies claras.
 * - inverso: contorno branco sobre superfícies azuis.
 * - texto: aparência de link, para ações de menor peso.
 *
 * Com `para`, renderiza um Link em vez de um button.
 */
export default function Button({
  variante = 'primario',
  icone,
  somenteIcone = false,
  carregando = false,
  para,
  type = 'button',
  disabled = false,
  className,
  children,
  ...props
}) {
  const classes = cx(
    styles.botao,
    styles[variante],
    somenteIcone && styles.somenteIcone,
    className,
  );

  const conteudo = (
    <>
      {carregando ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        icone && <Icon nome={icone} />
      )}
      {somenteIcone ? <span className="sr-only">{children}</span> : children}
    </>
  );

  if (para) {
    return (
      <Link to={para} className={classes} {...props}>
        {conteudo}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      {...props}
    >
      {conteudo}
    </button>
  );
}
