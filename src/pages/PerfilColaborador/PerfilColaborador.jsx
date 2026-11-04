import { useParams } from 'react-router';
import { AvisoApi, CartaoColaborador, PainelCompetencias } from '@/components/colaborador';
import { Button, Card, EmptyState, LoadingState, Skeleton } from '@/components/ui';
import { useDadosColaborador } from '@/hooks/useDadosColaborador';
import { minimosDaEquipe } from '@/mocks/consultas';
import { periodoDaExperiencia, rotuloNivel } from '@/utils/formatadores';
import styles from './PerfilColaborador.module.css';

function EsqueletoDoPerfil() {
  return (
    <>
      <Skeleton altura="152px" forma="bloco" />
      <div className={styles.colunas}>
        <Skeleton altura="320px" forma="bloco" />
        <Skeleton altura="320px" forma="bloco" />
      </div>
      <Skeleton altura="280px" forma="bloco" />
    </>
  );
}

function ListaDeNiveis({ itens }) {
  return (
    <dl className={styles.niveis}>
      {itens.map(({ id, nome, nivel }) => (
        <div key={id} className={styles.nivel}>
          <dt>{nome}</dt>
          <dd>{rotuloNivel(nivel)}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Perfil completo. Mesma tela para o colaborador e para a visão do gestor:
 * o layout de cada perfil vem da rota, e o gestor vê também o mínimo esperado da equipe.
 */
export default function PerfilColaborador({ visaoDoGestor = false }) {
  const { id } = useParams();
  const { colaborador, equipe, origem, erro, carregando, recarregar, consultaApi } =
    useDadosColaborador(visaoDoGestor ? { colaboradorId: id } : undefined);

  if (carregando) {
    return (
      <LoadingState consultaApi={consultaApi}>
        <EsqueletoDoPerfil />
      </LoadingState>
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

  const { formacoes, experiencias, idiomas, tecnologias, competencias } = colaborador;

  return (
    <div className={styles.pagina}>
      {erro && <AvisoApi origem={origem} aoTentarDeNovo={recarregar} />}

      <CartaoColaborador colaborador={colaborador} equipe={equipe} />

      <div className={styles.colunas}>
        <div className={styles.coluna}>
          <Card titulo="Formação Acadêmica">
            {formacoes.length === 0 ? (
              <EmptyState titulo="Nenhuma formação cadastrada" />
            ) : (
              <ul className={styles.blocos}>
                {formacoes.map(({ periodo, status, instituicao, curso }) => (
                  <li key={curso}>
                    <p className={styles.periodo}>
                      {periodo} <span className={styles.status}>{status}</span>
                    </p>
                    <p>
                      <strong>Instituição:</strong> {instituicao}
                    </p>
                    <p>
                      <strong>Curso:</strong> {curso}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card titulo="Experiência Profissional">
            {experiencias.length === 0 ? (
              <EmptyState titulo="Nenhuma experiência cadastrada" />
            ) : (
              <ul className={styles.blocos}>
                {experiencias.map((experiencia) => (
                  <li key={experiencia.id}>
                    <p className={styles.periodo}>{periodoDaExperiencia(experiencia)}</p>
                    <p>
                      <strong>Empresa:</strong> {experiencia.empresa}
                    </p>
                    <p>
                      <strong>Cargo:</strong> {experiencia.cargo}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className={styles.coluna}>
          <Card titulo="Idiomas">
            {idiomas.length === 0 ? (
              <EmptyState titulo="Nenhum idioma cadastrado" />
            ) : (
              <ListaDeNiveis itens={idiomas} />
            )}
          </Card>

          <Card titulo="Habilidades">
            {tecnologias.length === 0 ? (
              <EmptyState titulo="Nenhuma habilidade cadastrada" />
            ) : (
              <ListaDeNiveis itens={tecnologias} />
            )}
          </Card>
        </div>
      </div>

      <PainelCompetencias
        competencias={competencias}
        minimos={visaoDoGestor ? minimosDaEquipe(equipe) : undefined}
      />
    </div>
  );
}
