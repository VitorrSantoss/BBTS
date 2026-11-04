import { AvisoApi } from '@/components/colaborador';
import { CompetencyList, DonutChart } from '@/components/competencias';
import { Avatar, Button, Card, EmptyState, LoadingState, Skeleton } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { useUsuario } from '@/hooks/useUsuario';
import { calcularNivelTotal } from '@/utils/competencias';
import { primeiroNome } from '@/utils/formatadores';
import styles from './ColaboradorHome.module.css';

function EsqueletoDoPainel() {
  return (
    <>
      <Skeleton largura="240px" altura="2.5rem" />
      <div className={styles.grade}>
        <Skeleton altura="320px" forma="bloco" />
        <Skeleton altura="320px" forma="bloco" />
      </div>
      <div className={styles.grade}>
        <Skeleton altura="220px" forma="bloco" />
        <Skeleton altura="220px" forma="bloco" />
      </div>
    </>
  );
}

export default function ColaboradorHome() {
  const toast = useToast();
  const { usuario, erro, carregando, recarregar, consultaApi } = useUsuario();

  if (carregando) {
    return (
      <LoadingState consultaApi={consultaApi}>
        <EsqueletoDoPainel />
      </LoadingState>
    );
  }

  const { nome, foto, area, competencias, lacunas, jornada } = usuario;

  return (
    <div className={styles.pagina}>
      {erro && <AvisoApi aoTentarDeNovo={recarregar} />}

      <h1 className={styles.saudacao}>Olá, {primeiroNome(nome)}!</h1>

      <div className={styles.grade}>
        <Card className={styles.cardCompetencias} aria-label="Competências">
          <DonutChart valor={calcularNivelTotal(competencias)} tamanho={148} />
          <div className={styles.competencias}>
            <h2 className={styles.tituloCompetencias}>Níveis de Competências</h2>
            <CompetencyList competencias={competencias} />
          </div>
        </Card>

        <Card className={styles.cardPerfil} aria-label="Seu perfil">
          <div className={styles.perfil}>
            <Avatar src={foto} alt={`Foto de ${nome}`} tamanho={100} borda="azul" />
            <h2 className={styles.nome}>{nome}</h2>
            {area && <p className={styles.area}>{area}</p>}
          </div>
          <p className={styles.faixa}>Colaborador</p>
        </Card>
      </div>

      <div className={styles.grade}>
        <Card titulo="Lacunas de Conhecimento">
          {lacunas.length === 0 ? (
            <EmptyState titulo="Nenhuma lacuna identificada" />
          ) : (
            <div className={styles.lacunas}>
              <p className={styles.chamada} data-surface="primary">
                Descubra as <strong>áreas mais importantes</strong> para você no momento!
              </p>
              <ul className={styles.listaLacunas}>
                {lacunas.map((lacuna) => (
                  <li key={lacuna}>{lacuna}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card titulo="Jornada de Capacitação">
          {jornada.length === 0 ? (
            <EmptyState titulo="Nenhum curso sugerido" />
          ) : (
            <ul className={styles.jornada}>
              {jornada.map((curso) => (
                <li key={curso}>
                  <Button
                    variante="secundario"
                    className={styles.curso}
                    onClick={() => toast.info(`A página de "${curso}" ainda não está disponível.`)}
                  >
                    {curso}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
