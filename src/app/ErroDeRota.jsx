import { ErrorState } from '@/components/ui';
import styles from './ErroDeRota.module.css';

/** Último recurso para falhas inesperadas de renderização. */
export default function ErroDeRota() {
  return (
    <main className={styles.erro}>
      <h1 className="sr-only">Erro</h1>
      <ErrorState
        titulo="Algo deu errado nesta tela"
        descricao="Recarregue a página para continuar."
        aoTentarDeNovo={() => window.location.reload()}
      />
    </main>
  );
}
