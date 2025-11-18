document.addEventListener("DOMContentLoaded", async () => {

  // --- CARREGAR DADOS DO USUÁRIO ---
  const usuarioId = localStorage.getItem('usuarioId');

  if (usuarioId) {
    try {
      // Busca os dados do usuário na API
      const response = await fetch(`http://localhost:8080/usuarios/${usuarioId}`);

      if (response.ok) {
        const usuario = await response.json();

        // Atualiza o nome na saudação
        const welcomeTitle = document.querySelector('.welcome-title');
        if (welcomeTitle) {
          welcomeTitle.textContent = `Olá, ${usuario.nome.split(' ')[0]}!`;
        }

        // Atualiza o nome no card de perfil
        const profileName = document.querySelector('.profile-card h3');
        if (profileName) {
          profileName.textContent = usuario.nome;
        }

        console.log('Dados do usuário carregados:', usuario);
      }
    } catch (erro) {
      console.error('Erro ao carregar dados do usuário:', erro);
    }
  }

  // --- CARREGAR TECNOLOGIAS/COMPETÊNCIAS ---
  try {
    const response = await fetch('http://localhost:8080/tecnologias');

    if (response.ok) {
      const tecnologias = await response.json();
      console.log('Tecnologias cadastradas:', tecnologias);

      // Aqui você pode atualizar a lista de competências na tela
      // Por exemplo, criar dinamicamente as barras de progresso
    }
  } catch (erro) {
    console.error('Erro ao carregar tecnologias:', erro);
  }

  // --- 1. Animação das Barras de Progresso ---
  const progressBars = document.querySelectorAll(".progress-fill");

  progressBars.forEach(bar => {
    const targetWidth = bar.style.width; // Salva a largura alvo
    bar.style.width = "0%"; // Começa em 0
    bar.style.transition = "width 1.5s ease-out"; // Adiciona transição

    // Força o navegador a redesenhar antes de aplicar a largura alvo
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 100);
  });

  // --- 2. Animação do Gráfico Radial (Rosca) ---
  const radialProgress = document.querySelector(".radial-progress");
  const progressText = document.querySelector(".progress-inner-circle span");

  if (radialProgress && progressText) {
    // Pega o valor alvo da variável CSS (ex: 80)
    const targetPercentage = parseInt(radialProgress.style.getPropertyValue("--progress-value"), 10);
    let currentPercentage = 0;

    // Zera os valores iniciais
    progressText.textContent = "0%";
    radialProgress.style.setProperty("--progress-value", 0);

    // Define um intervalo para animar o número
    const interval = setInterval(() => {
      if (currentPercentage < targetPercentage) {
        currentPercentage++;
        progressText.textContent = `${currentPercentage}%`;
        radialProgress.style.setProperty("--progress-value", currentPercentage);
      } else {
        clearInterval(interval);
      }
    }, 20);
  }
});