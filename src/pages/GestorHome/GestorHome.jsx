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
  Skeleton,
  Tag,
} from '@/components/ui';
import { usePainelGestor } from '@/hooks/useEquipes';
import { useToast } from '@/hooks/useToast';
import { tituloEquipe } from '@/mocks/consultas';
import { CARLA } from '@/mocks/personas';
import { primeiroNome } from '@/utils/formatadores';
import styles from './GestorHome.module.css';

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
      <h1 className={styles.saudacao}>Olá, {primeiroNome(CARLA.nome)}!</h1>

      <div className={styles.colunas}>
        <div className={styles.principal}>
          <Card titulo="Suas Equipes" tituloCentralizado>
            {equipes.length === 0 ? (
              <EmptyState titulo="Nenhuma equipe por aqui ainda" />
            ) : (
              <ul className={styles.gradeEquipes}>
                {equipes.map((equipe) => (
                  <li key={equipe.id}>
                    <Link to={`/gestor/equipes/${equipe.id}`} className={styles.equipe}>
                      <img src={equipe.foto} alt="" width="320" height="240" />
                      <span className={styles.rotuloEquipe}>{tituloEquipe(equipe)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card titulo="Conversas Recentes" tituloCentralizado>
            {conversas.length === 0 ? (
              <EmptyState titulo="Nenhuma conversa recente" />
            ) : (
              <ul className={styles.gradeConversas}>
                {conversas.map(({ id, nome, foto }) => (
                  <li key={id}>
                    <Link to={`/gestor/colaboradores/${id}`} className={styles.conversa}>
                      <Avatar src={foto} alt="" tamanho={120} borda="azul" />
                      <Tag variante="chip">Chat de {primeiroNome(nome)}</Tag>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <aside>
          <Card titulo="Criar Nova Equipe" tituloCentralizado>
            <div className={styles.novaEquipe}>
              <div className={styles.imagemVazia}>
                <Icon nome="imagem" tamanho={64} />
              </div>
              <p className={styles.rotuloEquipe}>Equipe 05</p>
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
