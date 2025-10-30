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

  // --- 2. Lógica dos Formulários da Sidebar ---
  const inviteForm = document.querySelector(".invite-form");
  const feedbackForm = document.querySelector(".feedback-form");

  if (inviteForm) {
    inviteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = inviteForm.querySelector("#email-invite").value;
      if (email) {
        console.log("Enviando convite para:", email);
        alert(`Convite enviado para ${email}! (Simulação)`);
        inviteForm.reset();
      } else {
        alert("Por favor, insira um e-mail.");
      }
    });
  }

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(feedbackForm);
      console.log("--- Novo Feedback de Equipe (Simulação) ---");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      alert("Feedback enviado com sucesso! (Simulação)");
      feedbackForm.reset();
    });
  }
});