import { useNavigate } from 'react-router';
import iconePerfil from '@/assets/images/foto_perfil.png';
import logoBbts from '@/assets/images/LogoBBTS.png';
import { Button } from '@/components/ui';
import { usePerfil } from '@/hooks/usePerfil';
import styles from './SelecaoPerfil.module.css';

const PERFIS = [
  { valor: 'colaborador', rotulo: 'Colaborador' },
  { valor: 'gestor', rotulo: 'Gestor' },
];

export default function SelecaoPerfil() {
  const navegar = useNavigate();
  const { escolherPerfil } = usePerfil();

  const escolher = (perfil) => {
    escolherPerfil(perfil);
    navegar('/login');
  };

  return (
    <div className={styles.pagina}>
      <div className={styles.faixa} data-surface="primary">
        <div className={styles.conteudo}>
          <img
            src={logoBbts}
            alt="BB Tecnologia e Serviços"
            width="967"
            height="84"
            className={styles.logo}
          />

          <div className={styles.escolha}>
            <div className={styles.icone}>
              <img src={iconePerfil} alt="" width="486" height="513" />
            </div>
            <h1 className={styles.titulo}>Qual tipo de perfil deseja acessar?</h1>
            <div className={styles.botoes}>
              {PERFIS.map(({ valor, rotulo }) => (
                <Button
                  key={valor}
                  variante="destaque"
                  className={styles.botao}
                  onClick={() => escolher(valor)}
                >
                  {rotulo}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
