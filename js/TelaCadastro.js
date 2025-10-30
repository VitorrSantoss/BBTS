document.addEventListener("DOMContentLoaded", () => {
  // --- Funcionalidade de Adicionar Campos Dinâmicos ---

  function setupAddButton(buttonSelector, containerSelector, createFields) {
    const addButton = document.querySelector(buttonSelector);
    const container = document.querySelector(containerSelector);
    
    if (addButton && container) {
      addButton.addEventListener("click", (e) => {
        e.preventDefault(); // Impede que o link '#' navegue
        const fieldGroup = createFields();
        // Insere os novos campos antes do próprio botão "Adicionar"
        container.insertBefore(fieldGroup, addButton);
      });
    }
  }

  // 1. Adicionar Habilidade
  setupAddButton(
    'section:nth-of-type(2) .text-link', // Seletor para "+ Adicionar habilidade"
    'section:nth-of-type(2)', // Container da seção "Habilidades"
    () => {
      const newField = document.createElement("div");
      newField.className = "flex items-center gap-4 mt-4"; // Classes do Tailwind
      newField.innerHTML = `
        <input type="text" placeholder="Ex: Java, Figma, Excel, MySQL" class="form-input flex-grow">
        <select class="custom-select w-32">
          <option selected>Iniciante</option>
          <option>Intermediário</option>
          <option>Avançado</option>
        </select>
      `;
      return newField;
    }
  );

  // 2. Adicionar Idioma
  setupAddButton(
    'section:nth-of-type(3) .text-link', // Seletor para "+ Adicionar idioma"
    'section:nth-of-type(3)', // Container da seção "Idiomas"
    () => {
      const newField = document.createElement("div");
      newField.className = "flex items-center gap-4 mt-4";
      newField.innerHTML = `
        <input type="text" placeholder="Ex: Inglês" class="form-input flex-grow">
        <select class="custom-select w-32">
          <option selected>Iniciante</option>
          <option>Básico</option>
          <option>Intermediário</option>
          <option>Avançado</option>
          <option>Fluente</option>
        </select>
      `;
      return newField;
    }
  );

  // 3. Adicionar Experiência
  setupAddButton(
    'section:nth-of-type(4) .text-link', // Seletor para "+ Adicionar experiência"
    'section:nth-of-type(4) .space-y-4', // Container dos inputs de experiência
    () => {
      const newField = document.createElement("div");
      newField.className = "space-y-4 mt-6 border-t pt-4"; // Adiciona um separador
      newField.innerHTML = `
        <input type="text" placeholder="Empresa" class="form-input md:w-1/2">
        <div class="flex flex-col md:flex-row gap-4 md:w-1/2">
          <input type="text" placeholder="Início (Ex: 02.2024)" class="form-input w-full">
          <input type="text" placeholder="Fim (Ex: 04.2025)" class="form-input w-full">
        </div>
        <input type="text" placeholder="Cargo (Ex: Estágio de T.I)" class="form-input md:w-1/2">
      `;
      return newField;
    }
  );

  // --- Funcionalidade de Upload de Foto de Perfil ---
  const profilePicContainer = document.querySelector(".lg\\:w-1\\/4 .bg-white");
  
  if (profilePicContainer) {
    // 1. Cria um input de arquivo escondido
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    // 2. Adiciona o clique no container (o círculo branco)
    profilePicContainer.addEventListener("click", () => {
      fileInput.click(); // Abre o seletor de arquivos
    });
    profilePicContainer.style.cursor = "pointer"; // Mostra que é clicável

    // 3. Ouve por mudanças no input de arquivo
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        
        // Quando o arquivo for lido
        reader.onload = (e) => {
          // Cria uma tag de imagem
          const img = document.createElement("img");
          img.src = e.target.result;
          // Adiciona classes para a imagem preencher o círculo
          img.className = "w-full h-full object-cover";
          
          // Limpa o container (remove o SVG) e adiciona a imagem
          profilePicContainer.innerHTML = ""; 
          profilePicContainer.appendChild(img);
        };
        
        // Lê o arquivo como um URL de dados
        reader.readAsDataURL(file);
      }
    });
  }
});