import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Checkbox, Icon, Input, Select } from '@/components/ui';
import { useFormulario } from '@/hooks/useFormulario';
import { usePerfil } from '@/hooks/usePerfil';
import { useToast } from '@/hooks/useToast';
import { simularEnvio } from '@/mocks/simulacao';
import { ErroSalvamentoParcial, mensagemDeErro, salvarCadastro } from '@/services/cadastro';
import { gerarFichaPdf } from '@/services/gerarPdf';
import { salvarUsuarioId } from '@/services/sessao';
import { NIVEIS_IDIOMA, NIVEIS_TECNOLOGIA } from '@/utils/formatadores';
import { mascararCpf, mascararTelefone } from '@/utils/mascaras';
import styles from './Cadastro.module.css';
import FotoPerfil from './FotoPerfil';
import {
  campoDaLinha,
  novaExperiencia,
  novaTecnologia,
  novoCertificado,
  novoIdioma,
  validarCadastro,
} from './modeloCadastro';
import SecaoDeLinhas from './SecaoDeLinhas';

/**
 * Formulário de `/cadastro` e `/colaborador/editar`.
 * `demonstracao` marca a persona fixa, que não existe na API: nada é enviado.
 */
export default function FormularioCadastro({
  inicial,
  original,
  usuarioId,
  edicao = false,
  demonstracao = false,
  aoRecarregar,
  fotoAtual,
}) {
  const navegar = useNavigate();
  const toast = useToast();
  const { escolherPerfil } = usePerfil();
  const [gerandoPdf, setGerandoPdf] = useState(false);

  const aoEnviar = async (dados) => {
    if (demonstracao) {
      await simularEnvio();
      toast.info('Modo de demonstração: este perfil não existe na API e nada foi salvo.');
      return;
    }

    try {
      const id = await salvarCadastro({ usuarioId, valores: dados, original });
      salvarUsuarioId(id);
      escolherPerfil('colaborador');
      toast.sucesso(edicao ? 'Alterações salvas com sucesso!' : 'Cadastro salvo com sucesso!');
      navegar('/colaborador');
    } catch (erro) {
      if (!(erro instanceof ErroSalvamentoParcial)) {
        toast.erro(mensagemDeErro(erro));
        return;
      }

      // O usuário já existe: recarregar evita repetir os itens que chegaram a ser salvos.
      salvarUsuarioId(erro.usuarioId);
      escolherPerfil('colaborador');
      toast.erro('Os dados pessoais foram salvos, mas parte do restante falhou. Revise e salve.');
      if (edicao) aoRecarregar();
      else navegar('/colaborador/editar', { replace: true });
    }
  };

  const { valores, erros, enviando, alterar, limparErro, aoSair, campo, enviar } = useFormulario({
    inicial,
    validar: validarCadastro,
    aoEnviar,
  });

  const propsDaLinha = (lista, { chave, ...linha }, nomeDoCampo) => {
    const nome = campoDaLinha(lista, chave, nomeDoCampo);
    return {
      name: nome,
      value: linha[nomeDoCampo],
      erro: erros[nome],
      onBlur: aoSair,
      onChange: (evento) => {
        alterar(lista, (linhas) =>
          linhas.map((atual) =>
            atual.chave === chave ? { ...atual, [nomeDoCampo]: evento.target.value } : atual,
          ),
        );
        limparErro(nome);
      },
    };
  };

  const marcarEmpregoAtual = (chave, marcado) => {
    alterar('experiencias', (linhas) =>
      linhas.map((linha) =>
        linha.chave === chave ? { ...linha, empregoAtual: marcado, dataFim: '' } : linha,
      ),
    );
    limparErro(campoDaLinha('experiencias', chave, 'dataFim'));
  };

  const escolherArquivo = (chave, arquivo) => {
    alterar('certificados', (linhas) =>
      linhas.map((linha) => (linha.chave === chave ? { ...linha, arquivo } : linha)),
    );
  };

  const gerarPdf = async () => {
    setGerandoPdf(true);
    try {
      await gerarFichaPdf(valores);
      toast.sucesso('Ficha em PDF gerada.');
    } catch {
      toast.erro('Não foi possível gerar o PDF. Tente de novo.');
    } finally {
      setGerandoPdf(false);
    }
  };

  return (
    <form className={styles.formulario} onSubmit={enviar} noValidate>
      <div className={styles.dados}>
        <h1 className={styles.titulo}>
          <span className={styles.iconeTitulo} data-surface="primary">
            <Icon nome="documento" tamanho={24} />
          </span>
          Dados de Colaborador
        </h1>

        <section className={styles.secao} aria-labelledby="secao-dados-pessoais">
          <h2 id="secao-dados-pessoais" className={styles.tituloSecao}>
            Dados pessoais
          </h2>
          <div className={styles.grade}>
            <Input
              {...campo('nome')}
              label="Nome completo"
              autoComplete="name"
              maxLength={200}
              placeholder="Digite seu nome completo"
              required
            />
            <Input
              {...campo('cpf')}
              label="CPF"
              inputMode="numeric"
              placeholder="000.000.000-00"
              required
              onChange={(evento) => alterar('cpf', mascararCpf(evento.target.value))}
            />
            <Input
              {...campo('area')}
              label="Área de atuação"
              placeholder="Ex: Desenvolvedor BackEnd"
              dica="Vai para a ficha em PDF. A API ainda não guarda este campo."
            />
            <Input
              {...campo('email')}
              label="E-mail"
              type="email"
              autoComplete="email"
              maxLength={150}
              placeholder="seu.email@empresa.com"
              required
            />
            <Input
              {...campo('telefone')}
              label="Telefone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="(00) 00000-0000"
              onChange={(evento) => alterar('telefone', mascararTelefone(evento.target.value))}
            />
            <Input
              {...campo('dataNascimento')}
              label="Data de nascimento"
              type="date"
              autoComplete="bday"
              required
            />
          </div>
        </section>

        <SecaoDeLinhas
          titulo="Idiomas"
          nomeDoItem="idioma"
          rotuloAdicionar="Adicionar idioma"
          lista="idiomas"
          linhas={valores.idiomas}
          criarLinha={novoIdioma}
          alterar={alterar}
          renderizarLinha={(linha) => (
            <div className={styles.camposNivel}>
              <Input
                {...propsDaLinha('idiomas', linha, 'nome')}
                label="Idioma"
                maxLength={50}
                placeholder="Ex: Inglês"
              />
              <Select
                {...propsDaLinha('idiomas', linha, 'nivel')}
                label="Nível"
                opcoes={NIVEIS_IDIOMA}
              />
            </div>
          )}
        />

        <SecaoDeLinhas
          titulo="Tecnologias"
          nomeDoItem="tecnologia"
          rotuloAdicionar="Adicionar tecnologia"
          lista="tecnologias"
          linhas={valores.tecnologias}
          criarLinha={novaTecnologia}
          alterar={alterar}
          renderizarLinha={(linha) => (
            <div className={styles.camposNivel}>
              <Input
                {...propsDaLinha('tecnologias', linha, 'nome')}
                label="Tecnologia"
                maxLength={30}
                placeholder="Ex: JavaScript"
              />
              <Select
                {...propsDaLinha('tecnologias', linha, 'nivel')}
                label="Nível"
                opcoes={NIVEIS_TECNOLOGIA}
              />
            </div>
          )}
        />

        <SecaoDeLinhas
          titulo="Experiência"
          nomeDoItem="experiência"
          rotuloAdicionar="Adicionar experiência"
          lista="experiencias"
          linhas={valores.experiencias}
          criarLinha={novaExperiencia}
          alterar={alterar}
          renderizarLinha={(linha) => (
            <div className={styles.camposExperiencia}>
              <Input
                {...propsDaLinha('experiencias', linha, 'empresa')}
                label="Empresa"
                maxLength={200}
                placeholder="Digite o nome da empresa"
              />
              <Input
                {...propsDaLinha('experiencias', linha, 'cargo')}
                label="Cargo"
                maxLength={150}
                placeholder="Ex: Estágio de T.I"
              />
              <Input
                {...propsDaLinha('experiencias', linha, 'dataInicio')}
                label="Início"
                type="date"
              />
              <Input
                {...propsDaLinha('experiencias', linha, 'dataFim')}
                label="Fim"
                type="date"
                disabled={linha.empregoAtual}
              />
              <Checkbox
                label="Emprego atual"
                checked={linha.empregoAtual}
                onChange={(evento) => marcarEmpregoAtual(linha.chave, evento.target.checked)}
              />
            </div>
          )}
        />

        <SecaoDeLinhas
          titulo="Certificados"
          nomeDoItem="certificado"
          rotuloAdicionar="Adicionar arquivo"
          lista="certificados"
          linhas={valores.certificados}
          criarLinha={novoCertificado}
          alterar={alterar}
          renderizarLinha={(linha) =>
            linha.id ? (
              <p className={styles.certificado}>
                <Icon nome="documento" />
                {linha.nomeCurso}
              </p>
            ) : (
              <Input
                label="Arquivo do certificado"
                type="file"
                accept="application/pdf"
                className={styles.campoArquivo}
                onChange={(evento) => escolherArquivo(linha.chave, evento.target.files[0] ?? null)}
              />
            )
          }
        />

        <Button
          icone="documento"
          carregando={gerandoPdf}
          className={styles.botaoPdf}
          onClick={gerarPdf}
        >
          Gerar PDF
        </Button>
      </div>

      <aside className={styles.painel} data-surface="primary" aria-label="Foto e ações">
        <div className={styles.painelInterno}>
          <FotoPerfil fotoAtual={fotoAtual} nome={valores.nome} />
          <div className={styles.acoes}>
            <Button variante="inverso" para={edicao ? '/colaborador' : '/login'}>
              Voltar
            </Button>
            <Button type="submit" variante="destaque" carregando={enviando}>
              Salvar
            </Button>
          </div>
          {enviando && !demonstracao && (
            <p className={styles.avisoEnvio} role="status">
              Salvando. A API pode levar até 1 minuto para acordar.
            </p>
          )}
        </div>
      </aside>
    </form>
  );
}
