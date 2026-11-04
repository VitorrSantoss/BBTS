import { salvarColaborador } from "./api.js";

document.getElementById("form-colaborador").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();

  // Dados pessoais → Usuario.java
  const usuario = {
    nome: document.getElementById("nome").value,
    dataNascimento: document.getElementById("dataNasc").value,
    telefone: document.getElementById("telefone").value,
    email: document.getElementById("email").value
  };
  formData.append("usuario", new Blob([JSON.stringify(usuario)], { type: "application/json" }));

  // Habilidades / Idiomas → Idioma.java
  const idioma = {
    idioma: document.getElementById("idioma").value,
    nivel: document.getElementById("nivelIdioma").value
  };
  formData.append("idioma", new Blob([JSON.stringify(idioma)], { type: "application/json" }));

  // Experiência profissional → ExperienciaProfissional.java
  const exp = {
    cargo: document.getElementById("cargo").value,
    empresa: document.getElementById("empresa").value,
    dataInicio: document.getElementById("dataInicioExp").value,
    dataFim: document.getElementById("dataFimExp").value,
    empregoAtual: document.getElementById("empregoAtual").checked
  };
  formData.append("experiencia", new Blob([JSON.stringify(exp)], { type: "application/json" }));

  // Certificações → Certificacoes.java
  const cert = {
    nomeCurso: document.getElementById("nomeCert").value,
    dataCertificado: document.getElementById("dataCert").value
  };
  formData.append("certificacao", new Blob([JSON.stringify(cert)], { type: "application/json" }));

  // Arquivo do certificado
  const arquivoCert = document.getElementById("fileCert").files[0];
  if (arquivoCert) {
    formData.append("arquivo", arquivoCert);
  }

  await salvarColaborador(formData);

  alert("Salvo com sucesso!");
});
