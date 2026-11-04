import { useId } from 'react';
import { Avatar, Tag } from '@/components/ui';
import { rotuloEquipe } from '@/mocks/consultas';
import styles from './CartaoColaborador.module.css';

/** Foto, nome e tags de equipe e área. O nome é o título principal da tela. */
export default function CartaoColaborador({ colaborador, equipe }) {
  const tituloId = useId();
  const { nome, foto, areas } = colaborador;
  const tags = [...(equipe ? [rotuloEquipe(equipe)] : []), ...areas];

  return (
    <section className={styles.cartao} aria-labelledby={tituloId}>
      <Avatar src={foto} alt={`Foto de ${nome}`} tamanho={112} borda="azul" />
      <div className={styles.dados}>
        <h1 id={tituloId} className={styles.nome}>
          {nome}
        </h1>
        {tags.length > 0 && (
          <ul className={styles.tags} aria-label="Equipe e áreas de atuação">
            {tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
