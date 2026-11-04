import { useId } from 'react';
import { Link, useParams } from 'react-router';
import { CompetencyList } from '@/components/competencias';
import { FormConvite, FormFeedback } from '@/components/gestor';
import {
  Avatar,
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Skeleton,
  Tag,
} from '@/components/ui';
import { useEquipe } from '@/hooks/useEquipes';
import { minimosDaEquipe, tituloEquipe } from '@/mocks/consultas';
import styles from './GestorEquipe.module.css';

function EsqueletoDaEquipe() {
  return (
    <div className={styles.colunas}>
      <div className={styles.principal}>
        <Skeleton altura="136px" forma="bloco" />
        <Skeleton altura="240px" forma="bloco" />
        <Skeleton altura="280px" forma="bloco" />
      </div>
      <Skeleton altura="520px" forma="bloco" />
    </div>
  );
}

export default function GestorEquipe() {
  const { id } = useParams();
  const tituloCompetenciasId = useId();
  const { dados, erro, carregando, recarregar } = useEquipe(id);

  if (carregando) {
    return (
      <LoadingState>
        <EsqueletoDaEquipe />
      </LoadingState>
    );
  }

  if (erro) {
    return (
      <>
        <h1 className="sr-only">Equipe</h1>
        <ErrorState aoTentarDeNovo={recarregar} />
      </>
    );
  }

  if (!dados) {
    return (
      <>
        <h1 className="sr-only">Equipe não encontrada</h1>
        <EmptyState
          titulo="Equipe não encontrada"
          descricao="Volte para a home e escolha uma das suas equipes."
        >
          <Button para="/gestor">Ir para a home</Button>
        </EmptyState>
      </>
    );
  }

  const { equipe, membros } = dados;

  return (
    <div className={styles.colunas}>
      <div className={styles.principal}>
        <section className={styles.cabecalho} aria-label="Dados da equipe">
          <img src={equipe.foto} alt="" width="160" height="160" className={styles.foto} />
          <div className={styles.identificacao}>
            <h1 className={styles.nome}>{tituloEquipe(equipe)}</h1>
            <Tag>{equipe.foco}</Tag>
            <p className={styles.descricao}>{equipe.descricao}</p>
          </div>
        </section>

        <Card titulo="Membros">
          {membros.length === 0 ? (
            <EmptyState
              titulo="Esta equipe ainda não tem membros"
              descricao="Use o formulário de convite para chamar o primeiro colaborador."
            />
          ) : (
            <ul className={styles.membros}>
              {membros.map(({ id: membroId, nome, foto }) => (
                <li key={membroId}>
                  <Link
                    to={`/gestor/colaboradores/${membroId}`}
                    className={styles.membro}
                    viewTransition
                  >
                    <Avatar src={foto} alt="" tamanho={96} />
                    <Tag variante="chip">{nome}</Tag>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <section className={styles.competencias} aria-labelledby={tituloCompetenciasId}>
          <h2 id={tituloCompetenciasId} className={styles.tituloCompetencias}>
            Competências mínimas esperadas
          </h2>
          <CompetencyList
            competencias={equipe.competenciasMinimas}
            minimos={minimosDaEquipe(equipe)}
          />
        </section>
      </div>

      <aside className={styles.lateral}>
        <Card titulo="Convidar para equipe">
          <FormConvite />
        </Card>
        <Card titulo="Feedback">
          <FormFeedback />
        </Card>
      </aside>
    </div>
  );
}
