document.addEventListener("DOMContentLoaded", () => {

  let usuarioIdCadastrado = null; // Armazena o ID do usuário após cadastro

  // === SALVAR CADASTRO COMPLETO COM API ===
  const btnSalvar = document.getElementById("btnSalvar");
  const loadingScreen = document.getElementById("loadingScreen");

  if (btnSalvar && loadingScreen) {
    btnSalvar.addEventListener("click", async () => {
      try {
        // Mostra tela de carregamento
        loadingScreen.style.display = "flex";

        // 1. Validação dos Campos Obrigatórios do Usuário
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
          senha: "senha123", // Senha padrão ou campo de senha se houver
          telefone: document.querySelector('input[placeholder="(00) 00000-0000"]').value,
          dataNascimento: document.querySelector('input[type="date"]').value
        };

        console.log('📤 Cadastrando usuário...');
        const responseUsuario = await fetch('http://localhost:8080/usuarios', {
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

        // Salva o ID no localStorage para uso na próxima tela
        localStorage.setItem('usuarioId', usuarioIdCadastrado);

        // ===== EXECUTAR CADASTROS DEPENDENTES =====
        // Usamos await para garantir que o usuário exista antes de vincular os dados
        await cadastrarIdiomas(usuarioIdCadastrado);
        await cadastrarTecnologias(usuarioIdCadastrado);
        await cadastrarExperiencia(usuarioIdCadastrado);
        await cadastrarCertificacoes(usuarioIdCadastrado); // <--- AQUI ESTAVA O ERRO, AGORA CORRIGIDO

        // ===== SUCESSO =====
        console.log('🎉 Cadastro completo realizado com sucesso!');

        // Redireciona após 1 segundo
        setTimeout(() => {
          window.location.href = "TelaColaborador.html";
        }, 1000);

      } catch (erro) {
        console.error('❌ Erro no processo de cadastro:', erro);
        alert(erro.message); // Mostra a mensagem de erro real para o usuário
        loadingScreen.style.display = "none"; // Esconde tela de carregamento para tentar de novo
      }
    });
  }

  // ===== FUNÇÃO: CADASTRAR IDIOMAS =====
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

        await fetch('http://localhost:8080/idiomas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(idioma)
        });
      }
    }
  }

  // ===== FUNÇÃO: CADASTRAR TECNOLOGIAS =====
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

        await fetch('http://localhost:8080/tecnologias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tecnologia)
        });
      }
    }
  }

  // ===== FUNÇÃO: CADASTRAR EXPERIÊNCIA PROFISSIONAL =====
  async function cadastrarExperiencia(usuarioId) {
    const empresaInput = document.querySelector('input[placeholder="Digite o nome da empresa"]');
    const cargoInput = document.querySelector('input[placeholder="Cargo (Ex: Estágio de T.I)"]');
    const datasInputs = document.querySelectorAll('input[type="date"]');

    // Ajuste conforme a ordem dos inputs no HTML
    // Assumindo: 0=Nascimento, 1=Inicio Exp, 2=Fim Exp
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

      await fetch('http://localhost:8080/experienciaProfissional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experiencia)
      });
    }
  }

  // ===== FUNÇÃO: CADASTRAR CERTIFICAÇÕES (CORRIGIDA PARA PDF/MULTIPART) =====
  async function cadastrarCertificacoes(usuarioId) {
    const certificadosInputs = document.querySelectorAll('#certificadosContainer input[type="file"]');

    for (const fileInput of certificadosInputs) {
      // Verifica se o usuário selecionou um arquivo
      if (fileInput.files && fileInput.files[0]) {
        const arquivo = fileInput.files[0];
        const nomeArquivo = arquivo.name.split('.')[0]; // Nome sem extensão

        // 1. Cria o FormData para enviar arquivo + dados
        const formData = new FormData();

        // 2. Objeto JSON com os dados da certificação (Nome, Data, ID Usuário)
        const dadosCertificacao = {
          nomeCurso: nomeArquivo,
          dataConclusao: new Date().toISOString().split('T')[0], // Data de hoje
          usuario: { id: usuarioId }
        };

        // 3. Adiciona o JSON como "Blob" com tipo application/json
        // Isso satisfaz o @RequestPart("dados") do Spring Boot
        formData.append("dados", new Blob([JSON.stringify(dadosCertificacao)], {
          type: "application/json"
        }));

        // 4. Adiciona o Arquivo PDF real
        // Isso satisfaz o @RequestPart("arquivo")
        formData.append("arquivo", arquivo);

        console.log(`📤 Enviando certificação: ${nomeArquivo}`);

        try {
          // 5. Envia SEM header Content-Type (o navegador define automaticamente o boundary)
          const response = await fetch('http://localhost:8080/certificacoes', {
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

  // ===== LÓGICA DE UI (Adicionar campos dinâmicos) =====
  const addIdiomaBtn = document.getElementById("addIdiomaBtn");
  const idiomasContainer = document.getElementById("idiomasContainer");

  if (addIdiomaBtn) {
    addIdiomaBtn.addEventListener("click", () => {
      const div = document.createElement("div");
      div.classList.add("linha");
      div.style.marginTop = "10px";
      div.innerHTML = `
        <div><label>Idiomas</label><input type="text" placeholder="Ex: Inglês" /></div>
        <div><label>Nível</label>
          <select>
            <option value="INICIANTE">Iniciante</option>
            <option value="BASICO">Básico</option>
            <option value="INTERMEDIARIO" selected>Intermediário</option>
            <option value="AVANCADO">Avançado</option>
            <option value="FLUENTE">Fluente</option>
            <option value="NATIVO">Nativo</option>
          </select>
        </div>`;
      idiomasContainer.appendChild(div);
    });
  }

  const addTechBtn = document.getElementById("addTechBtn");
  const techContainer = document.getElementById("techContainer");

  if (addTechBtn) {
    addTechBtn.addEventListener("click", () => {
      const div = document.createElement("div");
      div.classList.add("linha");
      div.style.marginTop = "10px";
      div.innerHTML = `
        <div><label>Tecnologias</label><input type="text" placeholder="Ex: JavaScript" /></div>
        <div><label>Nível</label>
          <select>
            <option value="JUNIOR">Júnior</option>
            <option value="PLENO" selected>Pleno</option>
            <option value="SENIOR">Sênior</option>
          </select>
        </div>`;
      techContainer.appendChild(div);
    });
  }

  const addCertificadoBtn = document.getElementById("addCertificadoBtn");
  const certificadosContainer = document.getElementById("certificadosContainer");

  if (addCertificadoBtn) {
    addCertificadoBtn.addEventListener("click", () => {
      const div = document.createElement("div");
      div.classList.add("linha", "campo-cert");
      div.style.marginTop = "10px";
      // Restringindo para PDF
      div.innerHTML = `<input type="file" accept="application/pdf" />`;
      certificadosContainer.appendChild(div);
    });
  }

  // Preview da Foto
  const fotoInput = document.getElementById("fotoInput");
  const fotoContainer = document.querySelector(".foto");
  if (fotoInput) {
    fotoInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          fotoContainer.innerHTML = `<img src="${e.target.result}" alt="Foto de perfil" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }
});