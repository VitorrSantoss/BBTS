import { ErrorState } from '@/components/ui';

/** Faixa de erro com nova tentativa. Com origem `mock`, a tela está mostrando dados de exemplo. */
export default function AvisoApi({ origem = 'mock', aoTentarDeNovo }) {
  const dadosParciais = origem === 'api';

  return (
    <ErrorState
      variante="aviso"
      titulo={dadosParciais ? 'Alguns dados não carregaram' : 'Não conseguimos falar com a API'}
      descricao={
        dadosParciais
          ? 'Parte das informações pode estar faltando nesta tela.'
          : 'Mostrando dados de exemplo até a conexão voltar.'
      }
      aoTentarDeNovo={aoTentarDeNovo}
    />
  );
}
