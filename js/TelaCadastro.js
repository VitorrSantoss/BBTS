document.addEventListener("DOMContentLoaded", () => {
  
  let usuarioIdCadastrado = null; // Armazena o ID do usuário após cadastro

  // === SALVAR CADASTRO COMPLETO COM API ===
  const btnSalvar = document.getElementById("btnSalvar");
  const loadingScreen = document.getElementById("loadingScreen");

  if (btnSalvar && loadingScreen) {
    btnSalvar.addEventListener("click", async () => {
      try {
        loadingScreen.style.display = "flex";

        // ===== PASSO 1: CADASTRAR USUÁRIO =====
        const usuario = {
          nome: document.querySelector('input[placeholder="Digite seu nome completo"]').value,
          cpf: document.querySelector('input[placeholder="Ex: 000.000.000-00"]').value,
          email: document.querySelector('input[placeholder="seuEmail@gmail.com"]').value,
          senha: "senha123", // Em produção, adicionar campo de senha
          telefone: document.querySelector('input[placeholder="(00) 00000-0000"]').value,
          dataNascimento: document.querySelector('input[type="date"]').value
        };

        // Validação básica
        if (!usuario.nome || !usuario.email || !usuario.cpf) {
          alert("Por favor, preencha os campos obrigatórios (Nome, Email, CPF)!");
          loadingScreen.style.display = "none";
          return;
        }

        console.log('Cadastrando usuário:', usuario);

        const responseUsuario = await fetch('http://localhost:8080/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuario)
        });

        if (!responseUsuario.ok) {
          throw new Error('Erro ao cadastrar usuário');
        }

        const usuarioCadastrado = await responseUsuario.json();
        usuarioIdCadastrado = usuarioCadastrado.id;
        console.log('✅ Usuário cadastrado com ID:', usuarioIdCadastrado);

        // Salva o ID no localStorage
        localStorage.setItem('usuarioId', usuarioIdCadastrado);

        // ===== PASSO 2: CADASTRAR IDIOMAS =====
        await cadastrarIdiomas(usuarioIdCadastrado);

        // ===== PASSO 3: CADASTRAR TECNOLOGIAS =====
        await cadastrarTecnologias(usuarioIdCadastrado);

        // ===== PASSO 4: CADASTRAR EXPERIÊNCIA PROFISSIONAL =====
        await cadastrarExperiencia(usuarioIdCadastrado);

        // ===== PASSO 5: CADASTRAR CERTIFICAÇÕES =====
        await cadastrarCertificacoes(usuarioIdCadastrado);

        // Sucesso - redireciona
        setTimeout(() => {
          window.location.href = "TelaColaborador.html";
        }, 2000);

      } catch (erro) {
        console.error('❌ Erro:', erro);
        alert('Erro ao cadastrar. Verifique o console e se o backend está rodando.');
        loadingScreen.style.display = "none";
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

        console.log('Cadastrando idioma:', idioma);

        const response = await fetch('http://localhost:8080/idiomas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(idioma)
        });

        if (response.ok) {
          console.log('✅ Idioma cadastrado:', idioma.nome);
        } else {
          console.error('❌ Erro ao cadastrar idioma:', idioma.nome);
        }
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

        console.log('Cadastrando tecnologia:', tecnologia);

        const response = await fetch('http://localhost:8080/tecnologias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tecnologia)
        });

        if (response.ok) {
          console.log('✅ Tecnologia cadastrada:', tecnologia.nome);
        } else {
          console.error('❌ Erro ao cadastrar tecnologia:', tecnologia.nome);
        }
      }
    }
  }

  // ===== FUNÇÃO: CADASTRAR EXPERIÊNCIA PROFISSIONAL =====
  async function cadastrarExperiencia(usuarioId) {
    const empresaInput = document.querySelector('input[placeholder="Digite o nome da empresa"]');
    const cargoInput = document.querySelector('input[placeholder="Cargo (Ex: Estágio de T.I)"]');
    const dataInicioInput = document.querySelectorAll('input[type="date"]')[1]; // Segunda data
    const dataFimInput = document.querySelectorAll('input[type="date"]')[2]; // Terceira data
    const empregoAtualCheck = document.getElementById('empregoAtual');

    if (empresaInput && cargoInput && empresaInput.value.trim() && cargoInput.value.trim()) {
      const experiencia = {
        empresa: empresaInput.value.trim(),
        cargo: cargoInput.value.trim(),
        dataInicio: dataInicioInput.value,
        dataFim: empregoAtualCheck.checked ? null : dataFimInput.value,
        empregoAtual: empregoAtualCheck.checked,
        descricao: null,
        usuario: { id: usuarioId }
      };

      console.log('Cadastrando experiência:', experiencia);

      const response = await fetch('http://localhost:8080/experienciaProfissional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experiencia)
      });

      if (response.ok) {
        console.log('✅ Experiência cadastrada');
      } else {
        console.error('❌ Erro ao cadastrar experiência');
      }
    }
  }

  // ===== FUNÇÃO: CADASTRAR CERTIFICAÇÕES =====
  async function cadastrarCertificacoes(usuarioId) {
    // Nota: Para certificações com arquivo, seria necessário upload de arquivo
    // Por enquanto, vamos cadastrar apenas com nome simulado
    const certificadosInputs = document.querySelectorAll('#certificadosContainer input[type="file"]');
    
    for (const fileInput of certificadosInputs) {
      if (fileInput.files && fileInput.files[0]) {
        const certificacao = {
          nomeCurso: fileInput.files[0].name.split('.')[0], // Nome do arquivo sem extensão
          dataConclusao: new Date().toISOString().split('T')[0], // Data atual
          arquivoCertificado: fileInput.files[0].name,
          usuario: { id: usuarioId }
        };

        console.log('Cadastrando certificação:', certificacao);

        const response = await fetch('http://localhost:8080/certificacoes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certificacao)
        });

        if (response.ok) {
          console.log('✅ Certificação cadastrada');
        } else {
          console.error('❌ Erro ao cadastrar certificação');
        }
      }
    }
  }

  // ===== ADICIONAR IDIOMAS DINAMICAMENTE =====
  const addIdiomaBtn = document.getElementById("addIdiomaBtn");
  const idiomasContainer = document.getElementById("idiomasContainer");

  addIdiomaBtn.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("linha");
    div.style.marginTop = "10px";

    div.innerHTML = `
      <div>
        <label>Idiomas</label>
        <input type="text" placeholder="Ex: Inglês" />
      </div>
      <div>
        <label>Nível</label>
        <select>
          <option value="INICIANTE">Iniciante</option>
          <option value="BASICO">Básico</option>
          <option value="INTERMEDIARIO" selected>Intermediário</option>
          <option value="AVANCADO">Avançado</option>
          <option value="FLUENTE">Fluente</option>
          <option value="NATIVO">Nativo</option>
        </select>
      </div>
    `;

    idiomasContainer.appendChild(div);
  });

  // ===== ADICIONAR TECNOLOGIAS DINAMICAMENTE =====
  const addTechBtn = document.getElementById("addTechBtn");
  const techContainer = document.getElementById("techContainer");

  addTechBtn.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("linha");
    div.style.marginTop = "10px";

    div.innerHTML = `
      <div>
        <label>Tecnologias</label>
        <input type="text" placeholder="Ex: JavaScript, React, Python" />
      </div>
      <div>
        <label>Nível</label>
        <select>
          <option value="JUNIOR">Júnior</option>
          <option value="PLENO" selected>Pleno</option>
          <option value="SENIOR">Sênior</option>
        </select>
      </div>
    `;

    techContainer.appendChild(div);
  });

  // ===== ADICIONAR CERTIFICADOS DINAMICAMENTE =====
  const addCertificadoBtn = document.getElementById("addCertificadoBtn");
  const certificadosContainer = document.getElementById("certificadosContainer");

  addCertificadoBtn.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("linha", "campo-cert");
    div.style.marginTop = "10px";
    div.innerHTML = `<input type="file" accept=".pdf,.jpg,.jpeg,.png" />`;
    certificadosContainer.appendChild(div);
  });

  // ===== PREVIEW DA FOTO =====
  const fotoInput = document.getElementById("fotoInput");
  const fotoContainer = document.querySelector(".foto");

  if (fotoInput) {
    fotoInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          fotoContainer.innerHTML = `<img src="${e.target.result}" alt="Foto de perfil">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }
});