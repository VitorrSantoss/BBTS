import { cx } from '@/utils/classes';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import styles from './ErrorState.module.css';

/**
 * - bloco: substitui o conteúdo, quando não há o que mostrar.
 * - aviso: faixa acima do conteúdo, quando a tela caiu no mock.
 */
export default function ErrorState({
  titulo = 'Não foi possível carregar os dados',
  descricao,
  aoTentarDeNovo,
  variante = 'bloco',
}) {
  return (
    <div className={cx(styles.erro, styles[variante])} role="alert">
      <Icon nome="alerta" tamanho={variante === 'bloco' ? 32 : 24} className={styles.icone} />
      <div className={styles.texto}>
        <p className={styles.titulo}>{titulo}</p>
        {descricao && <p className={styles.descricao}>{descricao}</p>}
      </div>
      {aoTentarDeNovo && (
        <Button variante="primario" onClick={aoTentarDeNovo}>
          Tentar de novo
        </Button>
      )}
    </div>
  );
}
