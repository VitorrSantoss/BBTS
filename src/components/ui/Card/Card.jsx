import { useId } from 'react';
import { cx } from '@/utils/classes';
import styles from './Card.module.css';

/** Superfície branca da interface. Com `titulo`, a seção fica nomeada para leitores de tela. */
export default function Card({
  as: Elemento = 'section',
  titulo,
  nivelTitulo = 2,
  tituloCentralizado = false,
  className,
  children,
  ...props
}) {
  const tituloId = useId();
  const Titulo = `h${nivelTitulo}`;

  return (
    <Elemento
      className={cx(styles.card, className)}
      aria-labelledby={titulo ? tituloId : undefined}
      {...props}
    >
      {titulo && (
        <Titulo
          id={tituloId}
          className={cx(styles.titulo, tituloCentralizado && styles.centralizado)}
        >
          {titulo}
        </Titulo>
      )}
      {children}
    </Elemento>
  );
}
