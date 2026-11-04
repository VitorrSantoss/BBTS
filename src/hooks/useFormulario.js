import { useCallback, useState } from 'react';

/**
 * Estado, validação inline e envio de um formulário.
 * `validar(valores)` devolve um mapa de campo para mensagem. Mapa vazio libera o envio.
 * `aoEnviar(valores, { resetar })` pode ser assíncrono: `enviando` cobre toda a espera.
 */
export function useFormulario({ inicial, validar, aoEnviar }) {
  const [valores, setValores] = useState(inicial);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  const limparErro = useCallback((nome) => {
    setErros((atuais) => {
      if (!atuais[nome]) return atuais;
      const { [nome]: _removido, ...restantes } = atuais;
      return restantes;
    });
  }, []);

  /** Aceita um valor ou uma função que recebe o valor anterior. */
  const alterar = useCallback(
    (nome, valor) => {
      setValores((atuais) => ({
        ...atuais,
        [nome]: typeof valor === 'function' ? valor(atuais[nome]) : valor,
      }));
      limparErro(nome);
    },
    [limparErro],
  );

  const resetar = useCallback(() => {
    setValores(inicial);
    setErros({});
  }, [inicial]);

  /** Ao sair de um campo preenchido, confere só ele. Campos vazios esperam o envio. */
  const aoSair = (evento) => {
    const { name, value } = evento.target;
    if (!value) return;
    const mensagem = validar(valores)[name];
    if (mensagem) setErros((atuais) => ({ ...atuais, [name]: mensagem }));
  };

  const campo = (nome) => ({
    name: nome,
    value: valores[nome],
    erro: erros[nome],
    onChange: (evento) => alterar(nome, evento.target.value),
    onBlur: aoSair,
  });

  const enviar = async (evento) => {
    evento.preventDefault();
    const formulario = evento.currentTarget;

    const encontrados = validar(valores);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) {
      requestAnimationFrame(() => formulario.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    setEnviando(true);
    try {
      await aoEnviar(valores, { resetar });
    } finally {
      setEnviando(false);
    }
  };

  return { valores, erros, enviando, alterar, limparErro, aoSair, campo, enviar, resetar };
}
