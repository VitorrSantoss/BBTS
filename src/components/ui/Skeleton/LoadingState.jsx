import styles from './LoadingState.module.css';

const AVISO_API = 'A API no Render pode levar até 1 minuto para acordar no primeiro acesso.';

/**
 * Envolve os skeletons de uma tela. `consultaApi` avisa sobre a demora do Render,
 * que só faz sentido quando os dados vêm mesmo da API.
 */
export default function LoadingState({ consultaApi = false, children }) {
  return (
    <div className={styles.estado} aria-busy="true">
      <p className={consultaApi ? styles.aviso : 'sr-only'} role="status">
        Carregando seus dados. {consultaApi && AVISO_API}
      </p>
      {children}
    </div>
  );
}
