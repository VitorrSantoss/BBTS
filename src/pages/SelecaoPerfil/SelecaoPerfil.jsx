import { useNavigate } from 'react-router';
import { Icon } from '@/components/ui';
import { usePerfil } from '@/hooks/usePerfil';
import TelaDividida from '@/layouts/TelaDividida/TelaDividida';
import styles from './SelecaoPerfil.module.css';

const PERFIS = [
  {
    valor: 'colaborador',
    rotulo: 'Colaborador',
    descricao: 'Veja seus níveis, lacunas e sua jornada de capacitação.',
    icone: 'colaborador',
  },
  {
    valor: 'gestor',
    rotulo: 'Gestor',
    descricao: 'Acompanhe equipes, competências mínimas e feedbacks.',
    icone: 'equipe',
  },
];

export default function SelecaoPerfil() {
  const navegar = useNavigate();
  const { escolherPerfil } = usePerfil();

  const escolher = (perfil) => {
    escolherPerfil(perfil);
    navegar('/login', { viewTransition: true });
  };

  return (
    <TelaDividida>
      <div className={styles.escolha}>
        <h1 className={styles.titulo}>Qual tipo de perfil deseja acessar?</h1>
        <div className={styles.opcoes}>
          {PERFIS.map(({ valor, rotulo, descricao, icone }) => (
            <button
              key={valor}
              type="button"
              className={styles.opcao}
              onClick={() => escolher(valor)}
            >
              <span className={styles.icone}>
                <Icon nome={icone} tamanho={28} />
              </span>
              <span className={styles.texto}>
                <span className={styles.rotulo}>{rotulo}</span>
                <span className={styles.descricao}>{descricao}</span>
              </span>
              <Icon nome="seta" className={styles.seta} />
            </button>
          ))}
        </div>
      </div>
    </TelaDividida>
  );
}
