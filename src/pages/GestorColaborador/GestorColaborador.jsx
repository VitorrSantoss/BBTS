import { useParams } from 'react-router';
import { CartaoColaborador, PainelCompetencias } from '@/components/colaborador';
import { FormFeedback } from '@/components/gestor';
import { Button, Card, EmptyState, ErrorState, LoadingState, Skeleton } from '@/components/ui';
import { useDadosColaborador } from '@/hooks/useDadosColaborador';
import { minimosDaEquipe } from '@/mocks/consultas';
import FormCompetencia from './FormCompetencia';
import styles from './GestorColaborador.module.css';

export default function GestorColaborador() {
  const { id } = useParams();
  const { colaborador, equipe, erro, carregando, recarregar } = useDadosColaborador({
    colaboradorId: id,
  });

  if (carregando) {
    return (
      <LoadingState>
        <div className={styles.colunas}>
          <div className={styles.principal}>
            <Skeleton altura="152px" forma="bloco" />
            <Skeleton altura="320px" forma="bloco" />
          </div>
          <Skeleton altura="480px" forma="bloco" />
        </div>
      </LoadingState>
    );
  }

  if (erro) {
    return (
      <>
        <h1 className="sr-only">Colaborador</h1>
        <ErrorState aoTentarDeNovo={recarregar} />
      </>
    );
  }

  if (!colaborador) {
    return (
      <>
        <h1 className="sr-only">Colaborador não encontrado</h1>
        <EmptyState
          titulo="Colaborador não encontrado"
          descricao="Volte para a home e escolha uma equipe ou conversa."
        >
          <Button para="/gestor">Ir para a home</Button>
        </EmptyState>
      </>
    );
  }

  return (
    <div className={styles.colunas}>
      <div className={styles.principal}>
        <CartaoColaborador colaborador={colaborador} equipe={equipe} />
        <PainelCompetencias
          competencias={colaborador.competencias}
          minimos={minimosDaEquipe(equipe)}
        />
        <FormCompetencia />
      </div>

      <aside className={styles.lateral}>
        <Button variante="secundario" para={`/gestor/colaboradores/${id}/perfil`} viewTransition>
          Ver perfil completo
        </Button>
        <Card titulo="Feedback">
          <FormFeedback />
        </Card>
      </aside>
    </div>
  );
}
