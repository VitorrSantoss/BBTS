import { Link, Navigate, useNavigate } from 'react-router';
import { Button, Input } from '@/components/ui';
import { useFormulario } from '@/hooks/useFormulario';
import { usePerfil } from '@/hooks/usePerfil';
import { useToast } from '@/hooks/useToast';
import TelaDividida from '@/layouts/TelaDividida/TelaDividida';
import { simularEnvio } from '@/mocks/simulacao';
import { semErrosVazios, validarEmail, validarObrigatorio } from '@/utils/validacao';
import styles from './Login.module.css';

const INICIAL = { email: '', senha: '' };

const validar = ({ email, senha }) =>
  semErrosVazios({
    email: validarEmail(email),
    senha: validarObrigatorio(senha, 'Informe a senha.'),
  });

export default function Login() {
  const navegar = useNavigate();
  const toast = useToast();
  const { perfil } = usePerfil();

  const { campo, enviar, enviando } = useFormulario({
    inicial: INICIAL,
    validar,
    aoEnviar: async () => {
      await simularEnvio();
      navegar(`/${perfil}`, { replace: true, viewTransition: true });
    },
  });

  // O destino depende do perfil: sem ele, a pessoa precisa escolher primeiro.
  if (!perfil) return <Navigate to="/" replace />;

  return (
    <TelaDividida>
      <div className={styles.painel}>
        <div>
          <h1 className={styles.titulo}>Login</h1>
          <p className={styles.perfil}>
            Entrando como {perfil === 'gestor' ? 'gestor' : 'colaborador'}
          </p>
        </div>

        <form className={styles.formulario} onSubmit={enviar} noValidate>
          <Input
            {...campo('email')}
            label="E-mail"
            type="email"
            icone="email"
            autoComplete="email"
            placeholder="seu.email@empresa.com"
            required
          />
          <Input
            {...campo('senha')}
            label="Senha"
            type="password"
            icone="cadeado"
            autoComplete="current-password"
            placeholder="Sua senha"
            required
          />
          <Button type="submit" carregando={enviando} className={styles.botaoEntrar}>
            Entrar
          </Button>
        </form>

        <div className={styles.links}>
          <Button
            variante="texto"
            onClick={() => toast.info('A recuperação de senha depende do backend.')}
          >
            Esqueci a senha
          </Button>
          <p>
            Não possui uma conta?{' '}
            <Link to="/cadastro" className={styles.cadastro} viewTransition>
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </TelaDividida>
  );
}
