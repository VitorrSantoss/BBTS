// js/apiService.js
// Serviço centralizado para comunicação com a API - VERSÃO PRODUÇÃO

// ==================== CONFIGURAÇÃO DA API ====================
const API_BASE_URL = 'https://bbts-api.onrender.com';

// Configuração padrão do fetch
const defaultHeaders = {
    'Content-Type': 'application/json',
};

// ==================== FUNÇÕES AUXILIARES ====================

// Função para tratar erros de resposta
async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({
            message: `Erro HTTP ${response.status}: ${response.statusText}`
        }));
        throw new Error(error.message || `Erro: ${response.status}`);
    }

    // Verifica se a resposta tem conteúdo (alguns endpoints DELETE não retornam body)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return null;
}

// Função para fazer requisições com retry em caso de timeout (útil no free tier do Render)
async function fetchWithRetry(url, options = {}, retries = 3) {
    try {
        const response = await fetch(url, options);
        return response;
    } catch (error) {
        if (retries > 0 && error.name === 'TypeError') {
            console.warn(`Tentando novamente... (${retries} tentativas restantes)`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Aguarda 2s
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}

// ==================== USUÁRIOS ====================
const UsuarioAPI = {
    /**
     * Lista todos os usuários cadastrados
     * @returns {Promise<Array>} Lista de usuários (sem senha)
     */
    async listarTodos() {
        const response = await fetchWithRetry(`${API_BASE_URL}/usuarios`);
        return handleResponse(response);
    },

    /**
     * Busca um usuário específico por ID
     * @param {number} id - ID do usuário
     * @returns {Promise<Object>} Dados do usuário
     */
    async buscarPorId(id) {
        const response = await fetchWithRetry(`${API_BASE_URL}/usuarios/${id}`);
        return handleResponse(response);
    },

    /**
     * Cadastra um novo usuário
     * @param {Object} usuario - Dados do usuário (nome, cpf, email, senha, etc)
     * @returns {Promise<Object>} Usuário cadastrado
     */
    async cadastrar(usuario) {
        const response = await fetchWithRetry(`${API_BASE_URL}/usuarios`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(usuario)
        });
        return handleResponse(response);
    },

    /**
     * Atualiza dados de um usuário existente
     * @param {number} id - ID do usuário
     * @param {Object} usuario - Dados atualizados
     * @returns {Promise<Object>} Usuário atualizado
     */
    async atualizar(id, usuario) {
        const response = await fetchWithRetry(`${API_BASE_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: defaultHeaders,
            body: JSON.stringify(usuario)
        });
        return handleResponse(response);
    },

    /**
     * Remove um usuário do sistema
     * @param {number} id - ID do usuário
     * @returns {Promise<boolean>} true se removido com sucesso
     */
    async excluir(id) {
        const response = await fetchWithRetry(`${API_BASE_URL}/usuarios/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir usuário: ${response.status}`);
        }
        return true;
    }
};

// ==================== IDIOMAS ====================
const IdiomaAPI = {
    /**
     * Lista todos os idiomas cadastrados
     * @returns {Promise<Array>} Lista de idiomas
     */
    async listarTodos() {
        const response = await fetchWithRetry(`${API_BASE_URL}/idiomas`);
        return handleResponse(response);
    },

    /**
     * Busca um idioma específico por ID
     * @param {number} id - ID do idioma
     * @returns {Promise<Object>} Dados do idioma
     */
    async buscarPorId(id) {
        const response = await fetchWithRetry(`${API_BASE_URL}/idiomas/${id}`);
        return handleResponse(response);
    },

    /**
     * Cadastra um novo idioma para um usuário
     * @param {Object} idioma - Dados do idioma (nome, nivel, usuario)
     * @returns {Promise<Object>} Idioma cadastrado
     */
    async cadastrar(idioma) {
        const response = await fetchWithRetry(`${API_BASE_URL}/idiomas`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(idioma)
        });
        return handleResponse(response);
    },

    /**
     * Atualiza um idioma existente
     * @param {number} id - ID do idioma
     * @param {Object} idioma - Dados atualizados
     * @returns {Promise<Object>} Idioma atualizado
     */
    async atualizar(id, idioma) {
        const response = await fetchWithRetry(`${API_BASE_URL}/idiomas/${id}`, {
            method: 'PUT',
            headers: defaultHeaders,
            body: JSON.stringify(idioma)
        });
        return handleResponse(response);
    },

    /**
     * Remove um idioma
     * @param {number} id - ID do idioma
     * @returns {Promise<boolean>} true se removido com sucesso
     */
    async excluir(id) {
        const response = await fetchWithRetry(`${API_BASE_URL}/idiomas/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir idioma: ${response.status}`);
        }
        return true;
    }
};

// ==================== TECNOLOGIAS ====================
const TecnologiaAPI = {
    /**
     * Lista todas as tecnologias cadastradas
     * @returns {Promise<Array>} Lista de tecnologias
     */
    async listarTodas() {
        const response = await fetchWithRetry(`${API_BASE_URL}/tecnologias`);
        return handleResponse(response);
    },

    /**
     * Busca uma tecnologia específica por ID
     * @param {number} id - ID da tecnologia
     * @returns {Promise<Object>} Dados da tecnologia
     */
    async buscarPorId(id) {
        const response = await fetchWithRetry(`${API_BASE_URL}/tecnologias/${id}`);
        return handleResponse(response);
    },

    /**
     * Cadastra uma nova tecnologia para um usuário
     * @param {Object} tecnologia - Dados da tecnologia (nome, nivel, usuario)
     * @returns {Promise<Object>} Tecnologia cadastrada
     */
    async cadastrar(tecnologia) {
        const response = await fetchWithRetry(`${API_BASE_URL}/tecnologias`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(tecnologia)
        });
        return handleResponse(response);
    },

    /**
     * Atualiza uma tecnologia existente
     * @param {number} id - ID da tecnologia
     * @param {Object} tecnologia - Dados atualizados
     * @returns {Promise<Object>} Tecnologia atualizada
     */
    async atualizar(id, tecnologia) {
        const response = await fetchWithRetry(`${API_BASE_URL}/tecnologias/${id}`, {
            method: 'PUT',
            headers: defaultHeaders,
            body: JSON.stringify(tecnologia)
        });
        return handleResponse(response);
    },

    /**
     * Remove uma tecnologia
     * @param {number} id - ID da tecnologia
     * @returns {Promise<boolean>} true se removido com sucesso
     */
    async excluir(id) {
        const response = await fetchWithRetry(`${API_BASE_URL}/tecnologias/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir tecnologia: ${response.status}`);
        }
        return true;
    }
};

// ==================== CERTIFICAÇÕES ====================
const CertificacaoAPI = {
    /**
     * Lista todas as certificações cadastradas
     * @returns {Promise<Array>} Lista de certificações
     */
    async listarTodas() {
        const response = await fetchWithRetry(`${API_BASE_URL}/certificacoes`);
        return handleResponse(response);
    },

    /**
     * Busca uma certificação específica por ID
     * @param {number} id - ID da certificação
     * @returns {Promise<Object>} Dados da certificação
     */
    async buscarPorId(id) {
        const response = await fetchWithRetry(`${API_BASE_URL}/certificacoes/${id}`);
        return handleResponse(response);
    },

    /**
     * Cadastra uma nova certificação (com arquivo opcional)
     * @param {Object} certificacao - Dados da certificação
     * @param {File} arquivo - Arquivo PDF do certificado (opcional)
     * @returns {Promise<Object>} Certificação cadastrada
     */
    async cadastrar(certificacao, arquivo = null) {
        const formData = new FormData();

        // Adiciona os dados como JSON
        formData.append("dados", new Blob([JSON.stringify(certificacao)], {
            type: "application/json"
        }));

        // Adiciona o arquivo se fornecido
        if (arquivo) {
            formData.append("arquivo", arquivo);
        }

        const response = await fetchWithRetry(`${API_BASE_URL}/certificacoes`, {
            method: 'POST',
            body: formData
            // NÃO enviar Content-Type, o navegador define automaticamente
        });
        return handleResponse(response);
    },

    /**
     * Atualiza uma certificação existente
     * @param {number} id - ID da certificação
     * @param {Object} certificacao - Dados atualizados
     * @param {File} arquivo - Novo arquivo PDF (opcional)
     * @returns {Promise<Object>} Certificação atualizada
     */
    async atualizar(id, certificacao, arquivo = null) {
        const formData = new FormData();

        formData.append("dados", new Blob([JSON.stringify(certificacao)], {
            type: "application/json"
        }));

        if (arquivo) {
            formData.append("arquivo", arquivo);
        }

        const response = await fetchWithRetry(`${API_BASE_URL}/certificacoes/${id}`, {
            method: 'PUT',
            body: formData
        });
        return handleResponse(response);
    },

    /**
     * Remove uma certificação
     * @param {number} id - ID da certificação
     * @returns {Promise<boolean>} true se removido com sucesso
     */
    async excluir(id) {
        const response = await fetchWithRetry(`${API_BASE_URL}/certificacoes/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir certificação: ${response.status}`);
        }
        return true;
    }
};

// ==================== EXPERIÊNCIA PROFISSIONAL ====================
const ExperienciaAPI = {
    /**
     * Lista todas as experiências profissionais
     * @returns {Promise<Array>} Lista de experiências
     */
    async listarTodas() {
        const response = await fetchWithRetry(`${API_BASE_URL}/experienciaProfissional`);
        return handleResponse(response);
    },

    /**
     * Busca uma experiência específica por ID
     * @param {number} id - ID da experiência
     * @returns {Promise<Object>} Dados da experiência
     */
    async buscarPorId(id) {
        const response = await fetchWithRetry(`${API_BASE_URL}/experienciaProfissional/${id}`);
        return handleResponse(response);
    },

    /**
     * Cadastra uma nova experiência profissional
     * @param {Object} experiencia - Dados da experiência
     * @returns {Promise<Object>} Experiência cadastrada
     */
    async cadastrar(experiencia) {
        const response = await fetchWithRetry(`${API_BASE_URL}/experienciaProfissional`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(experiencia)
        });
        return handleResponse(response);
    },

    /**
     * Atualiza uma experiência existente
     * @param {number} id - ID da experiência
     * @param {Object} experiencia - Dados atualizados
     * @returns {Promise<Object>} Experiência atualizada
     */
    async atualizar(id, experiencia) {
        const response = await fetchWithRetry(`${API_BASE_URL}/experienciaProfissional/${id}`, {
            method: 'PUT',
            headers: defaultHeaders,
            body: JSON.stringify(experiencia)
        });
        return handleResponse(response);
    },

    /**
     * Remove uma experiência profissional
     * @param {number} id - ID da experiência
     * @returns {Promise<boolean>} true se removido com sucesso
     */
    async excluir(id) {
        const response = await fetchWithRetry(`${API_BASE_URL}/experienciaProfissional/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro ao excluir experiência: ${response.status}`);
        }
        return true;
    }
};

// ==================== UTILITÁRIOS ====================

/**
 * Verifica se a API está respondendo
 * @returns {Promise<boolean>} true se a API está online
 */
async function verificarConexaoAPI() {
    try {
        const response = await fetchWithRetry(`${API_BASE_URL}/usuarios`, {
            method: 'GET'
        });
        return response.ok;
    } catch (error) {
        console.error('Erro ao verificar conexão com API:', error);
        return false;
    }
}

/**
 * Retorna a URL base da API (útil para debug)
 * @returns {string} URL da API
 */
function getAPIBaseURL() {
    return API_BASE_URL;
}

// ==================== EXPORTAÇÃO ====================
// Se estiver usando módulos ES6, descomente as linhas abaixo:
// export { UsuarioAPI, IdiomaAPI, TecnologiaAPI, CertificacaoAPI, ExperienciaAPI, verificarConexaoAPI, getAPIBaseURL };

// Se estiver usando no navegador (sem módulos), as APIs ficam disponíveis globalmente
// através do objeto window (não precisa exportar nada)