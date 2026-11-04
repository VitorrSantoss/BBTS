import { Link, Navigate, useNavigate } from 'react-router';
import logo from '@/assets/images/Logo.png';
import { Button, Input } from '@/components/ui';
import { useFormulario } from '@/hooks/useFormulario';
import { usePerfil } from '@/hooks/usePerfil';
import { useToast } from '@/hooks/useToast';
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
      navegar(`/${perfil}`, { replace: true });
    },
  });

  // O destino depende do perfil: sem ele, a pessoa precisa escolher primeiro.
  if (!perfil) return <Navigate to="/" replace />;

  return (
    <div className={styles.pagina}>
      <div className={styles.painel} data-surface="primary">
        <img src={logo} alt="Banco do Brasil" width="560" height="556" className={styles.logo} />
        <h1 className={styles.titulo}>Login</h1>

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
          <Button
            type="submit"
            variante="destaque"
            carregando={enviando}
            className={styles.botaoEntrar}
          >
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
          <p>Não possui uma conta?</p>
          <Link to="/cadastro" className={styles.cadastro}>
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
