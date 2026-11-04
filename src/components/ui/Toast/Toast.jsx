import { cx } from '@/utils/classes';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import styles from './Toast.module.css';

const ICONES = { sucesso: 'check', erro: 'alerta', info: 'info' };
const ROTULOS = { sucesso: 'Sucesso', erro: 'Erro', info: 'Informação' };

/**
 * A região fica sempre montada: leitores de tela só anunciam mudanças dentro de uma região
 * `role="status"` que já existia antes de a mensagem aparecer.
 */
export default function ToastRegion({ toasts, aoFechar }) {
  return (
    <div className={styles.regiao} role="status" aria-live="polite">
      {toasts.map(({ id, tipo, mensagem }) => (
        <div
          key={id}
          className={cx(styles.toast, styles[tipo])}
          data-surface={tipo === 'info' ? undefined : 'primary'}
        >
          <Icon nome={ICONES[tipo]} className={styles.icone} />
          <p className={styles.mensagem}>
            <span className="sr-only">{ROTULOS[tipo]}: </span>
            {mensagem}
          </p>
          <Button
            variante="texto"
            icone="fechar"
            somenteIcone
            className={styles.fechar}
            onClick={() => aoFechar(id)}
          >
            Fechar aviso
          </Button>
        </div>
      ))}
    </div>
  );
}
