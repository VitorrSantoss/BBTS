document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Animação das Barras de Progresso ---
  const progressBars = document.querySelectorAll(".bar-fill");
  progressBars.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = "0%";
    // A transição já está definida no CSS (transition: width 0.8s ease;)
    // por isso não precisamos adicionar via JS.
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

  // --- 3. Funcionalidade do Dropdown "Serviços" ---
  const servicesButton = document.querySelector(".nav-services .services-btn");
  if (servicesButton) {
    // 1. Cria o menu dropdown dinamicamente
    const dropdownMenu = document.createElement("div");
    dropdownMenu.className = "services-dropdown";
    dropdownMenu.innerHTML = `
      <a href="#">Serviço 1</a>
      <a href="#">Serviço 2</a>
      <a href="#">Serviço 3</a>
    `;
    // Adiciona estilos CSS via JS para o menu
    Object.assign(dropdownMenu.style, {
      display: "none",
      position: "absolute",
      backgroundColor: "white",
      color: "#3333BD",
      border: "1px solid #DDD",
      borderRadius: "5px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      marginTop: "10px",
      overflow: "hidden",
      zIndex: "100"
    });
    
    // Estilos dos links do dropdown
    dropdownMenu.querySelectorAll("a").forEach(a => {
      Object.assign(a.style, {
        display: "block",
        padding: "10px 20px",
        textDecoration: "none",
        fontSize: "16px",
        fontWeight: "500"
      });
      a.onmouseover = () => a.style.backgroundColor = "#f0f0f8";
      a.onmouseout = () => a.style.backgroundColor = "white";
    });

    // Insere o menu no DOM
    servicesButton.parentElement.style.position = "relative"; // Necessário para o 'absolute'
    servicesButton.parentElement.appendChild(dropdownMenu);

    // 2. Adiciona o evento de clique para mostrar/esconder
    servicesButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Impede que o clique feche o menu imediatamente
      const isVisible = dropdownMenu.style.display === "block";
      dropdownMenu.style.display = isVisible ? "none" : "block";
    });

    // 3. Fecha o menu se clicar em qualquer outro lugar
    window.addEventListener("click", () => {
      if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
      }
    });
  }
});