// js/apiService.js
// Serviço centralizado para comunicação com a API

const API_BASE_URL = 'http://localhost:8080';

// Configuração padrão do fetch
const defaultHeaders = {
    'Content-Type': 'application/json',
};

// Função auxiliar para tratar erros
async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(error.message || `Erro: ${response.status}`);
    }
    return response.json();
}

// ==================== USUÁRIOS ====================
const UsuarioAPI = {
    // Listar todos os usuários
    async listarTodos() {
        const response = await fetch(`${API_BASE_URL}/usuarios`);
        return handleResponse(response);
    },

    // Buscar usuário por ID
    async buscarPorId(id) {
        const response = await fetch(`${API_BASE_URL}/usuarios/${id}`);
        return handleResponse(response);
    },

    // Cadastrar novo usuário
    async cadastrar(usuario) {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(usuario)
        });
        return handleResponse(response);
    },

    // Atualizar usuário
    async atualizar(id, usuario) {
        const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: defaultHeaders,
            body: JSON.stringify(usuario)
        });
        return handleResponse(response);
    },

    // Excluir usuário
    async excluir(id) {
        const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir: ${response.status}`);
        }
        return true;
    }
};

// ==================== IDIOMAS ====================
const IdiomaAPI = {
    async listarTodos() {
        const response = await fetch(`${API_BASE_URL}/idiomas`);
        return handleResponse(response);
    },

    async cadastrar(idioma) {
        const response = await fetch(`${API_BASE_URL}/idiomas`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(idioma)
        });
        return handleResponse(response);
    },

    async atualizar(id, idioma) {
        const response = await fetch(`${API_BASE_URL}/idiomas/${id}`, {
            method: 'PUT',
            headers: defaultHeaders,
            body: JSON.stringify(idioma)
        });
        return handleResponse(response);
    },

    async excluir(id) {
        const response = await fetch(`${API_BASE_URL}/idiomas/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir: ${response.status}`);
        }
        return true;
    }
};

// ==================== TECNOLOGIAS ====================
const TecnologiaAPI = {
    async listarTodas() {
        const response = await fetch(`${API_BASE_URL}/tecnologias`);
        return handleResponse(response);
    },

    async cadastrar(tecnologia) {
        const response = await fetch(`${API_BASE_URL}/tecnologias`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(tecnologia)
        });
        return handleResponse(response);
    },

    async excluir(id) {
        const response = await fetch(`${API_BASE_URL}/tecnologias/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir: ${response.status}`);
        }
        return true;
    }
};

// ==================== CERTIFICAÇÕES ====================
const CertificacaoAPI = {
    async listarTodas() {
        const response = await fetch(`${API_BASE_URL}/certificacoes`);
        return handleResponse(response);
    },

    async cadastrar(certificacao) {
        const response = await fetch(`${API_BASE_URL}/certificacoes`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(certificacao)
        });
        return handleResponse(response);
    }
};

// ==================== EXPERIÊNCIA PROFISSIONAL ====================
const ExperienciaAPI = {
    async listarTodas() {
        const response = await fetch(`${API_BASE_URL}/experienciaProfissional`);
        return handleResponse(response);
    },

    async cadastrar(experiencia) {
        const response = await fetch(`${API_BASE_URL}/experienciaProfissional`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(experiencia)
        });
        return handleResponse(response);
    }
};

// Exporta as APIs (se usar módulos ES6)
// export { UsuarioAPI, IdiomaAPI, TecnologiaAPI, CertificacaoAPI, ExperienciaAPI };