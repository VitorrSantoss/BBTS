document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Animação das Barras de Progresso ---
  const progressBars = document.querySelectorAll(".progress-fill");

  progressBars.forEach(bar => {
    const targetWidth = bar.style.width; // Salva a largura alvo
    bar.style.width = "0%"; // Começa em 0
    bar.style.transition = "width 1.5s ease-out"; // Adiciona transição
    
    // Força o navegador a redesenhar antes de aplicar a largura alvo
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 100); // Um pequeno atraso é suficiente
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
        clearInterval(interval); // Para o intervalo quando atinge o alvo
      }
    }, 20); // Velocidade da animação (20ms por passo)
  }
});