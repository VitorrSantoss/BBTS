import { useState } from 'react';
import { ErrorState, LoadingState, Skeleton } from '@/components/ui';
import { useDadosColaborador } from '@/hooks/useDadosColaborador';
import { lerUsuarioId } from '@/services/sessao';
import styles from './Cadastro.module.css';
import FormularioCadastro from './FormularioCadastro';
import { formularioDoColaborador, formularioVazio } from './modeloCadastro';

function NovoCadastro() {
  const [inicial] = useState(formularioVazio);

  return (
    <div className={styles.publico}>
      <FormularioCadastro inicial={inicial} />
    </div>
  );
}

function FormularioDeEdicao({ colaborador, origem, recarregar }) {
  const [inicial] = useState(() => formularioDoColaborador(colaborador));

  return (
    <FormularioCadastro
      edicao
      inicial={inicial}
      original={colaborador}
      usuarioId={origem === 'api' ? lerUsuarioId() : null}
      demonstracao={origem === 'mock'}
      aoRecarregar={recarregar}
      fotoAtual={colaborador.foto}
    />
  );
}

/**
 * Sem os dados atuais a edição fica bloqueada. Cair no mock aqui faria o PUT sobrescrever
 * o cadastro real com dados de exemplo.
 */
function EdicaoDeCadastro() {
  const { colaborador, origem, erro, carregando, recarregar, consultaApi } = useDadosColaborador();

  if (carregando) {
    return (
      <LoadingState consultaApi={consultaApi}>
        <Skeleton largura="320px" altura="2.5rem" />
        <Skeleton altura="480px" forma="bloco" />
      </LoadingState>
    );
  }

  if (erro) {
    return (
      <>
        <h1 className="sr-only">Editar competências</h1>
        <ErrorState
          titulo="Não foi possível carregar seu cadastro"
          descricao="Sem os dados atuais, salvar agora poderia apagar informações."
          aoTentarDeNovo={recarregar}
        />
      </>
    );
  }

  return <FormularioDeEdicao colaborador={colaborador} origem={origem} recarregar={recarregar} />;
}

/** Uma tela só para `/cadastro` e `/colaborador/editar`. */
export default function Cadastro({ edicao = false }) {
  return edicao ? <EdicaoDeCadastro /> : <NovoCadastro />;
}
