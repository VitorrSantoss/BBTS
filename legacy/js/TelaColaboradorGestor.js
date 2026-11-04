document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Animação das Barras de Progresso ---
  const progressBars = document.querySelectorAll(".progress-fill");
  progressBars.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = "0%";
    bar.style.transition = "width 1.5s ease-out";
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 100);
  });

  // --- 2. Animação do Gráfico de Rosca (Donut) ---
  const donutChart = document.querySelector(".donut-chart");
  const chartText = document.querySelector(".chart-text");
  
  if (donutChart && chartText) {
    const targetPercentage = parseInt(donutChart.style.getPropertyValue("--percentage"), 10);
    let currentPercentage = 0;
    
    chartText.textContent = "0%";
    donutChart.style.setProperty("--percentage", 0);

    const interval = setInterval(() => {
      if (currentPercentage < targetPercentage) {
        currentPercentage++;
        chartText.textContent = `${currentPercentage}%`;
        donutChart.style.setProperty("--percentage", currentPercentage);
      } else {
        clearInterval(interval);
      }
    }, 20);
  }

  // --- 3. Lógica dos Formulários ---
  const addCompetencyForm = document.querySelector(".add-competency-form");
  const feedbackForm = document.querySelector(".feedback-form");

  if (addCompetencyForm) {
    addCompetencyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(addCompetencyForm);
      console.log("--- Nova Competência (Simulação) ---");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      alert("Nova competência adicionada com sucesso! (Simulação)");
      addCompetencyForm.reset(); // Limpa o formulário
    });
  }

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(feedbackForm);
      console.log("--- Novo Feedback (Simulação) ---");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      alert("Feedback enviado com sucesso! (Simulação)");
      feedbackForm.reset(); // Limpa o formulário
    });
  }
});