import { Link } from 'react-router';
import { FormConvite } from '@/components/gestor';
import {
  Avatar,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Icon,
  LoadingState,
  PageHeader,
  Skeleton,
  Tag,
} from '@/components/ui';
import { usePainelGestor } from '@/hooks/useEquipes';
import { useToast } from '@/hooks/useToast';
import { tituloEquipe } from '@/mocks/consultas';
import { CARLA } from '@/mocks/personas';
import { primeiroNome } from '@/utils/formatadores';
import styles from './GestorHome.module.css';

function rotuloDeMembros({ membros }) {
  if (membros.length === 0) return 'Sem membros';
  return membros.length === 1 ? '1 membro' : `${membros.length} membros`;
}

function EsqueletoDoPainel() {
  return (
    <>
      <Skeleton largura="240px" altura="2.5rem" />
      <div className={styles.colunas}>
        <div className={styles.principal}>
          <Skeleton altura="280px" forma="bloco" />
          <Skeleton altura="280px" forma="bloco" />
        </div>
        <Skeleton altura="480px" forma="bloco" />
      </div>
    </>
  );
}

export default function GestorHome() {
  const toast = useToast();
  const { dados, erro, carregando, recarregar } = usePainelGestor();

  if (carregando) {
    return (
      <LoadingState>
        <EsqueletoDoPainel />
      </LoadingState>
    );
  }

  if (erro) {
    return (
      <>
        <h1 className="sr-only">Home do gestor</h1>
        <ErrorState aoTentarDeNovo={recarregar} />
      </>
    );
  }

  const { equipes, conversas } = dados;

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={`Olá, ${primeiroNome(CARLA.nome)}!`}
        descricao="Acompanhe suas equipes e retome as conversas recentes."
      />

      <div className={styles.colunas}>
        <div className={styles.principal}>
          <Card titulo="Suas Equipes">
            {equipes.length === 0 ? (
              <EmptyState titulo="Nenhuma equipe por aqui ainda" />
            ) : (
              <ul className={styles.gradeEquipes}>
                {equipes.map((equipe) => (
                  <li key={equipe.id}>
                    <Link
                      to={`/gestor/equipes/${equipe.id}`}
                      className={styles.equipe}
                      viewTransition
                    >
                      <span className={styles.fotoEquipe}>
                        <img src={equipe.foto} alt="" width="320" height="240" />
                      </span>
                      <span className={styles.nomeEquipe}>{tituloEquipe(equipe)}</span>
                      <span className={styles.membrosEquipe}>{rotuloDeMembros(equipe)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card titulo="Conversas Recentes">
            {conversas.length === 0 ? (
              <EmptyState titulo="Nenhuma conversa recente" />
            ) : (
              <ul className={styles.gradeConversas}>
                {conversas.map(({ id, nome, foto, area }) => (
                  <li key={id}>
                    <Link
                      to={`/gestor/colaboradores/${id}`}
                      className={styles.conversa}
                      viewTransition
                    >
                      <Avatar src={foto} alt="" tamanho={56} />
                      <span className={styles.textoConversa}>
                        <span className={styles.nomeConversa}>Chat de {primeiroNome(nome)}</span>
                        <span className={styles.areaConversa}>{area}</span>
                      </span>
                      <Icon nome="seta" className={styles.setaConversa} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <aside>
          <Card titulo="Criar Nova Equipe">
            <div className={styles.novaEquipe}>
              <div className={styles.imagemVazia}>
                <Icon nome="imagem" tamanho={40} />
              </div>
              <Tag variante="chip">Equipe 05</Tag>
            </div>

            <h3 className={styles.subtitulo}>Membros</h3>
            <FormConvite />

            <Button
              icone="mais"
              somenteIcone
              className={styles.adicionarMembro}
              onClick={() =>
                toast.info('Adicionar novo membro é uma simulação: a busca depende do backend.')
              }
            >
              Adicionar novo membro
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
