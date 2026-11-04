import { useRef } from 'react';
import { Button, Card, Input } from '@/components/ui';
import { useFormulario } from '@/hooks/useFormulario';
import { useToast } from '@/hooks/useToast';
import { simularEnvio } from '@/mocks/simulacao';
import {
  semErrosVazios,
  validarEmail,
  validarNivel,
  validarObrigatorio,
  validarSigla,
} from '@/utils/validacao';
import styles from './GestorColaborador.module.css';

const INICIAL = {
  nome: '',
  sigla: '',
  categoria: '',
  nivelMinimo: '',
  nivelMaximo: '',
  emails: [{ chave: 0, email: '' }],
};

const campoDoEmail = (chave) => `emails.${chave}`;

function validar({ nome, sigla, categoria, nivelMinimo, nivelMaximo, emails }) {
  const erroMinimo = validarNivel(nivelMinimo, 'Informe o nível mínimo.');
  const erroMaximo = validarNivel(nivelMaximo, 'Informe o nível máximo.');
  const fora = !erroMinimo && !erroMaximo && Number(nivelMinimo) > Number(nivelMaximo);

  return semErrosVazios({
    nome: validarObrigatorio(nome, 'Informe o nome.'),
    sigla: validarSigla(sigla),
    categoria: validarObrigatorio(categoria, 'Informe a categoria.'),
    nivelMinimo: fora ? 'O mínimo não pode passar do máximo.' : erroMinimo,
    nivelMaximo: erroMaximo,
    ...Object.fromEntries(
      emails.map(({ chave, email }) => [
        campoDoEmail(chave),
        validarEmail(email, { obrigatorio: false }),
      ]),
    ),
  });
}

/** Sem endpoint de competências na API, o envio é simulado como na versão antiga. */
export default function FormCompetencia() {
  const toast = useToast();
  const proximaChave = useRef(1);

  const { valores, erros, enviando, alterar, limparErro, aoSair, campo, enviar } = useFormulario({
    inicial: INICIAL,
    validar,
    aoEnviar: async (_valores, { resetar }) => {
      await simularEnvio();
      toast.sucesso('Nova competência adicionada com sucesso! (Simulação)');
      resetar();
    },
  });

  const adicionarEmail = () => {
    const chave = proximaChave.current;
    proximaChave.current += 1;
    alterar('emails', (atuais) => [...atuais, { chave, email: '' }]);
  };

  const removerEmail = (chave) => {
    alterar('emails', (atuais) => atuais.filter((item) => item.chave !== chave));
    limparErro(campoDoEmail(chave));
  };

  const alterarEmail = (chave, email) => {
    alterar('emails', (atuais) =>
      atuais.map((item) => (item.chave === chave ? { ...item, email } : item)),
    );
    limparErro(campoDoEmail(chave));
  };

  return (
    <Card titulo="Adicionar Nova Competência" tituloCentralizado>
      <form className={styles.formulario} onSubmit={enviar} noValidate>
        <Input {...campo('nome')} label="Nome" required />
        <div className={styles.linhaDupla}>
          <Input
            {...campo('sigla')}
            label="Sigla"
            maxLength={4}
            placeholder="Ex: PRMG"
            required
            onChange={(evento) => alterar('sigla', evento.target.value.toUpperCase())}
          />
          <Input {...campo('categoria')} label="Categoria" required />
        </div>
        <div className={styles.linhaDupla}>
          <Input
            {...campo('nivelMinimo')}
            label="Nível mínimo"
            type="number"
            min="1"
            max="7"
            required
          />
          <Input
            {...campo('nivelMaximo')}
            label="Nível máximo"
            type="number"
            min="1"
            max="7"
            required
          />
        </div>

        <h3 className={styles.subtitulo}>Colaboradores</h3>
        <p className={styles.dica}>
          Envie um convite para o endereço de e-mail do colaborador desejado.
        </p>

        {valores.emails.map(({ chave, email }, indice) => (
          <div key={chave} className={styles.linhaEmail}>
            <Input
              name={campoDoEmail(chave)}
              label={`E-mail do colaborador ${indice + 1}`}
              type="email"
              className={styles.campoEmail}
              value={email}
              erro={erros[campoDoEmail(chave)]}
              onBlur={aoSair}
              onChange={(evento) => alterarEmail(chave, evento.target.value)}
            />
            <Button
              variante="texto"
              icone="lixeira"
              somenteIcone
              className={styles.removerEmail}
              onClick={() => removerEmail(chave)}
            >
              {`Remover e-mail ${indice + 1}`}
            </Button>
          </div>
        ))}

        <Button variante="texto" icone="mais" className={styles.adicionar} onClick={adicionarEmail}>
          Adicionar colaborador
        </Button>

        <Button type="submit" icone="mais" carregando={enviando} className={styles.enviar}>
          Adicionar competência
        </Button>
      </form>
    </Card>
  );
}
