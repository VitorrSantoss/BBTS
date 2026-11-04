import { useId, useRef } from 'react';
import { Button } from '@/components/ui';
import styles from './Cadastro.module.css';

/**
 * Seção com linhas dinâmicas. Ao adicionar, o foco vai para a nova linha.
 * Ao remover, vai para o botão de adicionar, para o teclado não perder o lugar.
 */
export default function SecaoDeLinhas({
  titulo,
  nomeDoItem,
  rotuloAdicionar,
  lista,
  linhas,
  criarLinha,
  alterar,
  renderizarLinha,
}) {
  const tituloId = useId();
  const refLista = useRef(null);
  const refAdicionar = useRef(null);

  const adicionar = () => {
    alterar(lista, (atuais) => [...atuais, criarLinha()]);
    requestAnimationFrame(() => {
      refLista.current?.querySelector('li:last-child input')?.focus();
    });
  };

  const remover = (chave) => {
    alterar(lista, (atuais) => atuais.filter((linha) => linha.chave !== chave));
    refAdicionar.current?.focus();
  };

  return (
    <section className={styles.secao} aria-labelledby={tituloId}>
      <h2 id={tituloId} className={styles.tituloSecao}>
        {titulo}
      </h2>

      {linhas.length > 0 && (
        <ul ref={refLista} className={styles.linhas}>
          {linhas.map((linha, indice) => (
            <li key={linha.chave} className={styles.linha}>
              {renderizarLinha(linha)}
              <Button
                variante="texto"
                icone="lixeira"
                somenteIcone
                className={styles.remover}
                onClick={() => remover(linha.chave)}
              >
                {`Remover ${nomeDoItem} ${indice + 1}`}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Button
        ref={refAdicionar}
        variante="texto"
        icone="mais"
        className={styles.adicionar}
        onClick={adicionar}
      >
        {rotuloAdicionar}
      </Button>
    </section>
  );
}
