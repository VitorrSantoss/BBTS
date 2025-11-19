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
  
  // ============================================================
  // =====   NOVA FUNCIONALIDADE: GERAR PDF DO CURRÍCULO    =====
  // ============================================================
  const btnGerarPDF = document.getElementById("btnGerarPDF");

  if (btnGerarPDF) {
    btnGerarPDF.addEventListener("click", () => {
      // Verifica se a lib foi carregada
      if (!window.jspdf) {
        alert("Erro: Biblioteca jsPDF não encontrada. Verifique o HTML.");
        return;
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // --- Configurações de Layout ---
      let yPos = 20; // Cursor vertical (Eixo Y)
      const margemEsq = 20;
      const alturaLinha = 8;

      // Função auxiliar para escrever texto e controlar quebra de página
      const escrever = (texto, isTitulo = false) => {
        if (yPos > 280) { // Se chegar no fim da A4
          doc.addPage();
          yPos = 20;
        }

        if (isTitulo) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          yPos += 5;
          doc.text(texto, margemEsq, yPos);
          doc.setLineWidth(0.5);
          doc.line(margemEsq, yPos + 2, 190, yPos + 2); // Linha sublinhada
          yPos += 10;
        } else {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12);
          doc.text(texto, margemEsq, yPos);
          yPos += alturaLinha;
        }
      };

      // --- TÍTULO ---
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Ficha de Colaborador", 105, yPos, null, null, "center");
      yPos += 20;

      // --- 1. DADOS PESSOAIS ---
      escrever("Dados Pessoais", true);
      
      // Usando os IDs do HTML original (mais seguros que placeholders)
      const nome = document.getElementById("inputNome")?.value || document.querySelector('input[placeholder="Digite seu nome completo"]')?.value || "N/A";
      const cpf = document.getElementById("inputCPF")?.value || document.querySelector('input[placeholder="Ex: 000.000.000-00"]')?.value || "N/A";
      const email = document.getElementById("inputEmail")?.value || document.querySelector('input[placeholder="seuEmail@gmail.com"]')?.value || "N/A";
      const area = document.getElementById("inputAreaAtuacao")?.value || "N/A";
      const tel = document.getElementById("inputTelefone")?.value || "N/A";
      
      escrever(`Nome: ${nome}`);
      escrever(`CPF: ${cpf}`);
      escrever(`Email: ${email}`);
      escrever(`Área de Atuação: ${area}`);
      escrever(`Telefone: ${tel}`);

      // --- 2. IDIOMAS ---
      escrever("Idiomas", true);
      const linhasIdiomas = document.querySelectorAll('#idiomasContainer .linha');
      let temIdioma = false;
      
      linhasIdiomas.forEach(linha => {
        const input = linha.querySelector('input[type="text"]');
        const select = linha.querySelector('select');
        if (input && input.value) {
           escrever(`• ${input.value} - Nível: ${select.value}`);
           temIdioma = true;
        }
      });
      if (!temIdioma) escrever("Nenhum idioma adicionado.");

      // --- 3. TECNOLOGIAS ---
      escrever("Tecnologias", true);
      const linhasTech = document.querySelectorAll('#techContainer .linha');
      let temTech = false;

      linhasTech.forEach(linha => {
        const input = linha.querySelector('input[type="text"]');
        const select = linha.querySelector('select');
        if (input && input.value) {
           escrever(`• ${input.value} - Nível: ${select.value}`);
           temTech = true;
        }
      });
      if (!temTech) escrever("Nenhuma tecnologia adicionada.");

      // --- 4. EXPERIÊNCIA ---
      escrever("Experiência Profissional", true);
      const empInput = document.getElementById("inputEmpresa0") || document.querySelector('input[placeholder="Digite o nome da empresa"]');
      const cargoInput = document.getElementById("inputCargo0") || document.querySelector('input[placeholder="Cargo (Ex: Estágio de T.I)"]');
      
      if (empInput && empInput.value) {
         escrever(`Empresa: ${empInput.value}`);
         escrever(`Cargo: ${cargoInput?.value || "N/A"}`);
         
         // Datas
         const dataInicio = document.getElementById("vigenciaInicio0")?.value || "Início não inf.";
         const dataFim = document.getElementById("vigenciaFim0")?.value;
         const isAtual = document.getElementById("empregoAtual0")?.checked || document.getElementById("empregoAtual")?.checked;
         
         const periodo = isAtual ? `${dataInicio} até Atualmente` : `${dataInicio} até ${dataFim || "?"}`;
         escrever(`Período: ${periodo}`);
      } else {
         escrever("Não informada.");
      }

      // Salva o PDF
      doc.save(`Ficha_${nome.split(" ")[0] || "Cadastro"}.pdf`);
    });
  }
});