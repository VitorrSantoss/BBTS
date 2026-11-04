import { Button, Input, Textarea } from '@/components/ui';
import { useFormulario } from '@/hooks/useFormulario';
import { useToast } from '@/hooks/useToast';
import { simularEnvio } from '@/mocks/simulacao';
import { semErrosVazios, validarEmail, validarObrigatorio } from '@/utils/validacao';
import styles from './FormFeedback.module.css';

const INICIAL = { remetente: '', destinatario: '', mensagem: '' };

const validar = ({ remetente, destinatario, mensagem }) =>
  semErrosVazios({
    remetente: validarEmail(remetente),
    destinatario: validarEmail(destinatario),
    mensagem: validarObrigatorio(mensagem, 'Digite a mensagem.'),
  });

/** Feedback por e-mail. Sem endpoint na API, o envio é simulado como na versão antiga. */
export default function FormFeedback() {
  const toast = useToast();

  const { campo, enviar, enviando } = useFormulario({
    inicial: INICIAL,
    validar,
    aoEnviar: async (_valores, { resetar }) => {
      await simularEnvio();
      toast.sucesso('Feedback enviado com sucesso! (Simulação)');
      resetar();
    },
  });

  return (
    <form className={styles.formulario} onSubmit={enviar} noValidate>
      <Input
        {...campo('remetente')}
        label="Seu e-mail"
        type="email"
        autoComplete="email"
        required
      />
      <Input {...campo('destinatario')} label="E-mail do colaborador" type="email" required />
      <Textarea {...campo('mensagem')} label="Mensagem" required />
      <Button type="submit" icone="seta" carregando={enviando} className={styles.enviar}>
        Enviar feedback
      </Button>
    </form>
  );
}
