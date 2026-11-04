import { Button, Input } from '@/components/ui';
import { useFormulario } from '@/hooks/useFormulario';
import { useToast } from '@/hooks/useToast';
import { simularEnvio } from '@/mocks/simulacao';
import { semErrosVazios, validarEmail } from '@/utils/validacao';
import styles from './FormConvite.module.css';

const INICIAL = { email: '' };

const validar = ({ email }) => semErrosVazios({ email: validarEmail(email) });

/** Convite por e-mail. Sem endpoint na API, o envio é simulado como na versão antiga. */
export default function FormConvite() {
  const toast = useToast();

  const { campo, enviar, enviando } = useFormulario({
    inicial: INICIAL,
    validar,
    aoEnviar: async ({ email }, { resetar }) => {
      await simularEnvio();
      toast.sucesso(`Convite enviado para ${email}! (Simulação)`);
      resetar();
    },
  });

  return (
    <form className={styles.formulario} onSubmit={enviar} noValidate>
      <Input
        {...campo('email')}
        className={styles.campo}
        label="E-mail do colaborador"
        type="email"
        placeholder="nome@bbts.com.br"
        dica="Envie um convite para o endereço de e-mail do colaborador desejado."
        required
      />
      <Button
        type="submit"
        icone="seta"
        somenteIcone
        carregando={enviando}
        className={styles.enviar}
      >
        Enviar convite
      </Button>
    </form>
  );
}
