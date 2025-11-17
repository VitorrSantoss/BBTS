document.addEventListener("DOMContentLoaded", () => {

  // === TELA SALVANDO ===
  const btnSalvar = document.getElementById("btnSalvar");
  const loadingScreen = document.getElementById("loadingScreen");

  if (btnSalvar && loadingScreen) {
    btnSalvar.addEventListener("click", (e) => {
      e.preventDefault();
      loadingScreen.style.display = "flex";
      setTimeout(() => {
        window.location.href = "TelaColaborador.html";
      }, 3000);
    });
  }

  // === 3. ADICIONAR NOVO CAMPO DE CERTIFICADO ===
  const addCertificadoBtn = document.getElementById("addCertificadoBtn");
  const certificadosContainer = document.getElementById("certificadosContainer");

  addDynamicFields(addCertificadoBtn, () => {
    const div = document.createElement("div");
    div.classList.add("linha", "campo-cert");
    div.style.marginTop = "10px";

    div.innerHTML = `
    <input type="file" />
  `;

    return div;
  });


  // Atualiza o nome do arquivo escolhido
  document.querySelector(".custom-file-upload input").addEventListener("change", function () {
    const fileName = this.files.length ? this.files[0].name : "Nenhum arquivo escolhido";
    document.querySelector(".file-name").textContent = fileName;
  });

  // =====================
  // FUNÇÃO GENÉRICA PARA ADICIONAR CAMPOS
  // =====================
  function addDynamicFields(addButton, createFields) {
    addButton.addEventListener("click", () => {
      const newFields = createFields();
      addButton.before(newFields);
    });
  }

  // === 1. ADICIONAR IDIOMA ===
  const addIdiomaBtn = document.querySelectorAll(".add")[0];

  addDynamicFields(addIdiomaBtn, () => {
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
          <option>Iniciante</option>
          <option selected>Intermediário</option>
          <option>Avançado</option>
        </select>
      </div>
    `;

    return div;
  });

  // === 2. ADICIONAR TECNOLOGIA ===
  const addTechBtn = document.querySelectorAll(".add")[1];

  addDynamicFields(addTechBtn, () => {
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
          <option>Júnior</option>
          <option selected>Pleno</option>
          <option>Sênior</option>
        </select>
      </div>
    `;

    return div;
  });

  // === PREVIEW DA FOTO ===
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
