document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Interatividade dos Blocos (Equipes e Chats) ---

  // Torna as equipes clicáveis
  const teamBlocks = document.querySelectorAll(".teams-grid .team-block");
  teamBlocks.forEach((block, index) => {
    block.style.cursor = "pointer"; // Mostra que é clicável
    block.addEventListener("click", () => {
      const teamName = block.querySelector(".team-label").textContent;
      alert(`Navegando para a ${teamName}... (Simulação)`);
      // Em um app real, navegaria para:
      // window.location.href = `/pages/TelaEquipeGestor.html?id=${index + 1}`;
    });
  });

  // Torna os chats clicáveis
  const chatBlocks = document.querySelectorAll(".chats-grid .chat-block");
  chatBlocks.forEach(block => {
    block.style.cursor = "pointer";
    block.addEventListener("click", () => {
      const chatName = block.querySelector(".chat-label").textContent;
      alert(`Abrindo o ${chatName}... (Simulação)`);
    });
  });

  // --- 2. Lógica da Sidebar ---
  const emailForm = document.querySelector(".email-form");
  const addMemberBtn = document.querySelector(".add-member-btn");

  if (emailForm) {
    emailForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailForm.querySelector("#email-invite").value;
      if (email) {
        console.log("Enviando convite para:", email);
        alert(`Convite enviado para ${email}! (Simulação)`);
        emailForm.reset();
      } else {
        alert("Por favor, insira um e-mail.");
      }
    });
  }

  if (addMemberBtn) {
    addMemberBtn.addEventListener("click", () => {
      alert("Funcionalidade 'Adicionar novo membro' (Simulação).\nIsso poderia abrir um modal de busca de usuários.");
    });
  }
});