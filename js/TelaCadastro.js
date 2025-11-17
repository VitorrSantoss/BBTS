document.addEventListener("DOMContentLoaded", () => {

  // === TELA SALVANDO ===
  const btnSalvar = document.getElementById("btnSalvar");
  const loadingScreen = document.getElementById("loadingScreen");

  if (btnSalvar && loadingScreen) {
    btnSalvar.addEventListener("click", () => {
      loadingScreen.style.display = "flex";
      setTimeout(() => {
        window.location.href = "TelaColaborador.html";
      }, 3000);
    });
  }

  // =====================
  // FUNÇÃO GENÉRICA PARA ADICIONAR CAMPOS
  // =====================
  function addDynamicFields(container, createFields) {
    const newFields = createFields();
    container.appendChild(newFields);
  }

  // === ADICIONAR IDIOMAS ===
  const addIdiomaBtn = document.getElementById("addIdiomaBtn");
  const idiomasContainer = document.getElementById("idiomasContainer");

  addIdiomaBtn.addEventListener("click", () => {
    addDynamicFields(idiomasContainer, () => {
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
  });

  // === ADICIONAR TECNOLOGIAS ===
  const addTechBtn = document.getElementById("addTechBtn");
  const techContainer = document.getElementById("techContainer");

  addTechBtn.addEventListener("click", () => {
    addDynamicFields(techContainer, () => {
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
  });

  // === ADICIONAR CERTIFICADOS ===
  const addCertificadoBtn = document.getElementById("addCertificadoBtn");
  const certificadosContainer = document.getElementById("certificadosContainer");

  addCertificadoBtn.addEventListener("click", () => {
    addDynamicFields(certificadosContainer, () => {
      const div = document.createElement("div");
      div.classList.add("linha", "campo-cert");
      div.style.marginTop = "10px";

      div.innerHTML = `<input type="file" />`;

      return div;
    });
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
