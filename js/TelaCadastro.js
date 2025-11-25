document.addEventListener("DOMContentLoaded", () => {

  let usuarioIdCadastrado = null; // Armazena o ID do usuário após cadastro

  // === SALVAR CADASTRO COMPLETO COM API ===
  const btnSalvar = document.getElementById("btnSalvar");
  const loadingScreen = document.getElementById("loadingScreen");

  if (btnSalvar && loadingScreen) {
    btnSalvar.addEventListener("click", async () => {
      try {
        loadingScreen.style.display = "flex";

        // 1. VALIDAÇÃO
        const nome = document.querySelector('input[placeholder="Digite seu nome completo"]').value;
        const cpf = document.querySelector('input[placeholder="Ex: 000.000.000-00"]').value;
        const email = document.querySelector('input[placeholder="seuEmail@gmail.com"]').value;

        if (!nome || !email || !cpf) {
          throw new Error("Campos obrigatórios (Nome, Email, CPF) não preenchidos.");
        }

        // ===== PASSO 1: CADASTRAR USUÁRIO =====
        const usuario = {
          nome: nome,
          cpf: cpf,
          email: email,
          senha: "senha123",
          telefone: document.querySelector('input[placeholder="(00) 00000-0000"]').value,
          dataNascimento: document.querySelector('input[type="date"]').value
        };

        console.log('📤 Cadastrando usuário...');
        const responseUsuario = await fetch('https://bbts-api.onrender.com/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuario)
        });

        if (!responseUsuario.ok) {
          const erroMsg = await responseUsuario.text();
          throw new Error(`Falha ao cadastrar usuário: ${erroMsg}`);
        }

        const usuarioCadastrado = await responseUsuario.json();
        usuarioIdCadastrado = usuarioCadastrado.id;
        console.log('✅ Usuário cadastrado com ID:', usuarioIdCadastrado);

        localStorage.setItem('usuarioId', usuarioIdCadastrado);

        // ===== CADASTROS RELACIONADOS =====
        await cadastrarIdiomas(usuarioIdCadastrado);
        await cadastrarTecnologias(usuarioIdCadastrado);
        await cadastrarExperiencia(usuarioIdCadastrado);
        await cadastrarCertificacoes(usuarioIdCadastrado);

        console.log('🎉 Cadastro completo!');

        setTimeout(() => {
          window.location.href = "TelaColaborador.html";
        }, 1000);

      } catch (erro) {
        console.error('❌ Erro:', erro);
        alert(erro.message);
        loadingScreen.style.display = "none";
      }
    });
  }

  // ===== CADASTRAR IDIOMAS =====
  async function cadastrarIdiomas(usuarioId) {
    const idiomasLinhas = document.querySelectorAll('#idiomasContainer .linha');

    for (const linha of idiomasLinhas) {
      const nomeInput = linha.querySelector('input[type="text"]');
      const nivelSelect = linha.querySelector('select');

      if (nomeInput && nivelSelect && nomeInput.value.trim()) {
        const idioma = {
          nome: nomeInput.value.trim(),
          nivel: nivelSelect.value,
          usuario: { id: usuarioId }
        };

        await fetch('https://bbts-api.onrender.com/idiomas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(idioma)
        });
      }
    }
  }

  // ===== CADASTRAR TECNOLOGIAS =====
  async function cadastrarTecnologias(usuarioId) {
    const techLinhas = document.querySelectorAll('#techContainer .linha');

    for (const linha of techLinhas) {
      const nomeInput = linha.querySelector('input[type="text"]');
      const nivelSelect = linha.querySelector('select');

      if (nomeInput && nivelSelect && nomeInput.value.trim()) {
        const tecnologia = {
          nome: nomeInput.value.trim(),
          nivel: nivelSelect.value,
          usuario: { id: usuarioId }
        };

        await fetch('https://bbts-api.onrender.com/tecnologias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tecnologia)
        });
      }
    }
  }

  // ===== CADASTRAR EXPERIÊNCIA PROFISSIONAL =====
  async function cadastrarExperiencia(usuarioId) {
    const empresaInput = document.querySelector('input[placeholder="Digite o nome da empresa"]');
    const cargoInput = document.querySelector('input[placeholder="Cargo (Ex: Estágio de T.I)"]');
    const datasInputs = document.querySelectorAll('input[type="date"]');

    const dataInicioInput = datasInputs[1];
    const dataFimInput = datasInputs[2];
    const empregoAtualCheck = document.getElementById('empregoAtual');

    if (empresaInput && cargoInput && empresaInput.value.trim() && cargoInput.value.trim()) {
      const experiencia = {
        empresa: empresaInput.value.trim(),
        cargo: cargoInput.value.trim(),
        dataInicio: dataInicioInput ? dataInicioInput.value : null,
        dataFim: (empregoAtualCheck && empregoAtualCheck.checked) ? null : (dataFimInput ? dataFimInput.value : null),
        empregoAtual: empregoAtualCheck ? empregoAtualCheck.checked : false,
        usuario: { id: usuarioId }
      };

      await fetch('https://bbts-api.onrender.com/experienciaProfissional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experiencia)
      });
    }
  }

  // ===== CADASTRAR CERTIFICAÇÕES =====
  async function cadastrarCertificacoes(usuarioId) {
    const certificadosInputs = document.querySelectorAll('#certificadosContainer input[type="file"]');

    for (const fileInput of certificadosInputs) {
      if (fileInput.files && fileInput.files[0]) {
        const arquivo = fileInput.files[0];
        const nomeArquivo = arquivo.name.split('.')[0];

        const formData = new FormData();

        const dadosCertificacao = {
          nomeCurso: nomeArquivo,
          dataConclusao: new Date().toISOString().split('T')[0],
          usuario: { id: usuarioId }
        };

        formData.append("dados", new Blob([JSON.stringify(dadosCertificacao)], {
          type: "application/json"
        }));

        formData.append("arquivo", arquivo);

        console.log(`📤 Enviando certificação: ${nomeArquivo}`);

        try {
          const response = await fetch('https://bbts-api.onrender.com/certificacoes', {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            console.log('✅ Certificação salva com sucesso!');
          } else {
            console.error('❌ Falha ao salvar certificação:', await response.text());
          }
        } catch (error) {
          console.error('❌ Erro de rede na certificação:', error);
        }
      }
    }
  }

  // ... (restante do seu arquivo permanece igual)

});
