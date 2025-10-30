document.addEventListener("DOMContentLoaded", () => {
  // Seleciona os dois formulários
  const loginForm = document.querySelector(".panel-login form");
  const signupForm = document.querySelector(".panel-signup form");

  // --- Lógica para o Formulário de Login ---
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      // Impede o envio padrão do formulário, que atualizaria a página
      e.preventDefault();

      const email = loginForm.querySelector('input[type="email"]').value;
      
      // Validação simples
      if (email) {
        console.log("Tentativa de login com:", email);
        alert("Login realizado com sucesso! (Simulação)");
        // Redireciona para a página do colaborador
        // O onclick no HTML já faz isso, mas esta é a forma mais robusta
        window.location.href = 'TelaColaborador.html';
      } else {
        alert("Por favor, preencha o email e a senha.");
      }
    });
  }

  // --- Lógica para o Formulário de Cadastro ---
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      // Impede o envio padrão
      e.preventDefault();

      // Coleta os valores dos campos
      const nome = signupForm.querySelector('input[placeholder="Nome"]').value;
      const email = signupForm.querySelector('input[placeholder="Email"]').value;
      const senha = signupForm.querySelector('input[placeholder="Senha"]').value;
      const confirmarSenha = signupForm.querySelector('input[placeholder="Confirmar Senha"]').value;

      // Validação de campos vazios
      if (!nome || !email || !senha || !confirmarSenha) {
        alert("Por favor, preencha todos os campos de cadastro.");
        return; // Para a execução
      }

      // Validação de senha
      if (senha !== confirmarSenha) {
        alert("As senhas não coincidem. Tente novamente.");
        return; // Para a execução
      }

      // Se tudo estiver OK
      console.log("Nova conta criada:", { nome, email });
      alert("Conta criada com sucesso! (Simulação)");
      // Redireciona para a página de cadastro detalhado
      window.location.href = '/pages/TelaCadastro.html';
    });
  }
});