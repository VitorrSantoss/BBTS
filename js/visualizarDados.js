// visualizarDados.js
// Script para buscar e exibir todos os dados cadastrados do usuário
// VERSÃO PRODUÇÃO - Render

// ==================== CONFIGURAÇÃO ====================
const API_BASE_URL = 'https://bbts-api.onrender.com';

// ==================== CARREGAMENTO AUTOMÁTICO ====================
document.addEventListener("DOMContentLoaded", async () => {
  const usuarioId = localStorage.getItem('usuarioId');

  if (!usuarioId) {
    console.warn('⚠️ Nenhum usuário logado. ID não encontrado no localStorage.');
    exibirMensagem('Nenhum usuário logado. Faça o cadastro primeiro.');
    return;
  }

  console.log(`🔍 Buscando dados do usuário ID: ${usuarioId}`);

  // Exibe indicador de carregamento
  exibirCarregamento(true);

  try {
    // ===== BUSCAR TODOS OS DADOS =====
    const dados = await buscarDadosCompletos(usuarioId);

    // ===== EXIBIR NA TELA =====
    exibirDadosNaTela(dados);

    // ===== EXIBIR NO CONSOLE (DEBUG) =====
    exibirDadosNoConsole(dados);

    console.log('✅ Dados carregados com sucesso!');

  } catch (erro) {
    console.error('❌ Erro ao buscar dados:', erro);
    exibirMensagem(`Erro ao carregar dados: ${erro.message}`, 'erro');
  } finally {
    exibirCarregamento(false);
  }
});

// ==================== FUNÇÃO PRINCIPAL ====================

/**
 * Busca todos os dados relacionados ao usuário
 * @param {string|number} usuarioId - ID do usuário
 * @returns {Promise<Object>} Objeto com todos os dados
 */
async function buscarDadosCompletos(usuarioId) {
  const dados = {
    usuario: null,
    idiomas: [],
    tecnologias: [],
    experiencias: [],
    certificacoes: []
  };

  try {
    // ===== 1. BUSCAR DADOS DO USUÁRIO =====
    console.log('📋 Buscando dados do usuário...');
    const responseUsuario = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}`);

    if (!responseUsuario.ok) {
      throw new Error(`Usuário não encontrado (HTTP ${responseUsuario.status})`);
    }

    dados.usuario = await responseUsuario.json();
    console.log('✓ Usuário encontrado:', dados.usuario.nome);

    // ===== 2. BUSCAR IDIOMAS =====
    console.log('🌍 Buscando idiomas...');
    const responseIdiomas = await fetch(`${API_BASE_URL}/idiomas`);

    if (responseIdiomas.ok) {
      const todosIdiomas = await responseIdiomas.json();
      dados.idiomas = todosIdiomas.filter(i => i.usuario?.id === parseInt(usuarioId));
      console.log(`✓ ${dados.idiomas.length} idioma(s) encontrado(s)`);
    }

    // ===== 3. BUSCAR TECNOLOGIAS =====
    console.log('💻 Buscando tecnologias...');
    const responseTecnologias = await fetch(`${API_BASE_URL}/tecnologias`);

    if (responseTecnologias.ok) {
      const todasTecnologias = await responseTecnologias.json();
      dados.tecnologias = todasTecnologias.filter(t => t.usuario?.id === parseInt(usuarioId));
      console.log(`✓ ${dados.tecnologias.length} tecnologia(s) encontrada(s)`);
    }

    // ===== 4. BUSCAR EXPERIÊNCIAS =====
    console.log('💼 Buscando experiências profissionais...');
    const responseExperiencias = await fetch(`${API_BASE_URL}/experienciaProfissional`);

    if (responseExperiencias.ok) {
      const todasExperiencias = await responseExperiencias.json();
      dados.experiencias = todasExperiencias.filter(e => e.usuario?.id === parseInt(usuarioId));
      console.log(`✓ ${dados.experiencias.length} experiência(s) encontrada(s)`);
    }

    // ===== 5. BUSCAR CERTIFICAÇÕES =====
    console.log('🏆 Buscando certificações...');
    const responseCertificacoes = await fetch(`${API_BASE_URL}/certificacoes`);

    if (responseCertificacoes.ok) {
      const todasCertificacoes = await responseCertificacoes.json();
      dados.certificacoes = todasCertificacoes.filter(c => c.usuario?.id === parseInt(usuarioId));
      console.log(`✓ ${dados.certificacoes.length} certificação(ões) encontrada(s)`);
    }

    return dados;

  } catch (erro) {
    console.error('Erro na busca de dados:', erro);
    throw erro;
  }
}

// ==================== FUNÇÕES DE EXIBIÇÃO ====================

/**
 * Exibe os dados na tela (você pode customizar para mostrar em cards, tabelas, etc)
 * @param {Object} dados - Dados completos do usuário
 */
function exibirDadosNaTela(dados) {
  // Remove mensagens anteriores
  const container = document.getElementById('dadosContainer');
  if (!container) {
    console.warn('⚠️ Container "dadosContainer" não encontrado no HTML');
    return;
  }

  container.innerHTML = ''; // Limpa o container

  // ===== CARD DO USUÁRIO =====
  const cardUsuario = criarCardUsuario(dados.usuario);
  container.appendChild(cardUsuario);

  // ===== SEÇÃO DE IDIOMAS =====
  if (dados.idiomas.length > 0) {
    const secaoIdiomas = criarSecaoLista('Idiomas', dados.idiomas, (idioma) => {
      return `<strong>${idioma.nome}</strong>: ${idioma.nivel}`;
    });
    container.appendChild(secaoIdiomas);
  }

  // ===== SEÇÃO DE TECNOLOGIAS =====
  if (dados.tecnologias.length > 0) {
    const secaoTecnologias = criarSecaoLista('Tecnologias', dados.tecnologias, (tech) => {
      return `<strong>${tech.nome}</strong>: ${tech.nivel}`;
    });
    container.appendChild(secaoTecnologias);
  }

  // ===== SEÇÃO DE EXPERIÊNCIAS =====
  if (dados.experiencias.length > 0) {
    const secaoExperiencias = criarSecaoLista('Experiências Profissionais', dados.experiencias, (exp) => {
      const periodo = exp.empregoAtual
        ? `${formatarData(exp.dataInicio)} - Atual`
        : `${formatarData(exp.dataInicio)} - ${formatarData(exp.dataFim)}`;
      return `<strong>${exp.cargo}</strong> na ${exp.empresa}<br><small>${periodo}</small>`;
    });
    container.appendChild(secaoExperiencias);
  }

  // ===== SEÇÃO DE CERTIFICAÇÕES =====
  if (dados.certificacoes.length > 0) {
    const secaoCertificacoes = criarSecaoLista('Certificações', dados.certificacoes, (cert) => {
      return `<strong>${cert.nomeCurso}</strong><br><small>Concluído em: ${formatarData(cert.dataConclusao)}</small>`;
    });
    container.appendChild(secaoCertificacoes);
  }

  // ===== MENSAGEM SE NÃO HOUVER DADOS ADICIONAIS =====
  const totalDados = dados.idiomas.length + dados.tecnologias.length +
    dados.experiencias.length + dados.certificacoes.length;

  if (totalDados === 0) {
    const mensagem = document.createElement('p');
    mensagem.style.textAlign = 'center';
    mensagem.style.color = '#666';
    mensagem.style.marginTop = '20px';
    mensagem.textContent = 'Nenhum dado adicional cadastrado ainda.';
    container.appendChild(mensagem);
  }
}

/**
 * Exibe os dados no console de forma organizada (para debug)
 * @param {Object} dados - Dados completos do usuário
 */
function exibirDadosNoConsole(dados) {
  console.log('\n═══════════════════════════════════════════');
  console.log('       DADOS COMPLETOS DO USUÁRIO');
  console.log('═══════════════════════════════════════════\n');

  console.log('📋 INFORMAÇÕES PESSOAIS:');
  console.log('  Nome:', dados.usuario.nome);
  console.log('  Email:', dados.usuario.email);
  console.log('  CPF:', dados.usuario.cpf);
  console.log('  Telefone:', dados.usuario.telefone);
  console.log('  Data de Nascimento:', formatarData(dados.usuario.dataNascimento));

  console.log('\n🌍 IDIOMAS:');
  if (dados.idiomas.length === 0) {
    console.log('  Nenhum idioma cadastrado');
  } else {
    dados.idiomas.forEach((idioma, index) => {
      console.log(`  ${index + 1}. ${idioma.nome}: ${idioma.nivel}`);
    });
  }

  console.log('\n💻 TECNOLOGIAS:');
  if (dados.tecnologias.length === 0) {
    console.log('  Nenhuma tecnologia cadastrada');
  } else {
    dados.tecnologias.forEach((tech, index) => {
      console.log(`  ${index + 1}. ${tech.nome}: ${tech.nivel}`);
    });
  }

  console.log('\n💼 EXPERIÊNCIAS PROFISSIONAIS:');
  if (dados.experiencias.length === 0) {
    console.log('  Nenhuma experiência cadastrada');
  } else {
    dados.experiencias.forEach((exp, index) => {
      const periodo = exp.empregoAtual
        ? `${formatarData(exp.dataInicio)} - Atual`
        : `${formatarData(exp.dataInicio)} - ${formatarData(exp.dataFim)}`;
      console.log(`  ${index + 1}. ${exp.cargo} na ${exp.empresa}`);
      console.log(`     Período: ${periodo}`);
    });
  }

  console.log('\n🏆 CERTIFICAÇÕES:');
  if (dados.certificacoes.length === 0) {
    console.log('  Nenhuma certificação cadastrada');
  } else {
    dados.certificacoes.forEach((cert, index) => {
      console.log(`  ${index + 1}. ${cert.nomeCurso}`);
      console.log(`     Concluído em: ${formatarData(cert.dataConclusao)}`);
    });
  }

  console.log('\n═══════════════════════════════════════════\n');
}

// ==================== FUNÇÕES AUXILIARES DE UI ====================

/**
 * Cria um card HTML com os dados do usuário
 * @param {Object} usuario - Dados do usuário
 * @returns {HTMLElement} Card do usuário
 */
function criarCardUsuario(usuario) {
  const card = document.createElement('div');
  card.className = 'card-usuario';
  card.style.cssText = `
    background: #fff;
    border: 2px solid #3333bd;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  `;

  card.innerHTML = `
    <h2 style="color: #3333bd; margin-top: 0;">${usuario.nome}</h2>
    <p><strong>Email:</strong> ${usuario.email}</p>
    <p><strong>CPF:</strong> ${usuario.cpf}</p>
    <p><strong>Telefone:</strong> ${usuario.telefone || 'Não informado'}</p>
    <p><strong>Data de Nascimento:</strong> ${formatarData(usuario.dataNascimento)}</p>
  `;

  return card;
}

/**
 * Cria uma seção com lista de itens
 * @param {string} titulo - Título da seção
 * @param {Array} itens - Array de itens
 * @param {Function} formatador - Função para formatar cada item
 * @returns {HTMLElement} Seção HTML
 */
function criarSecaoLista(titulo, itens, formatador) {
  const secao = document.createElement('div');
  secao.className = 'secao-dados';
  secao.style.cssText = `
    background: #f5f5f5;
    border-left: 4px solid #fcfc30;
    border-radius: 5px;
    padding: 15px 20px;
    margin-bottom: 15px;
  `;

  let html = `<h3 style="color: #3333bd; margin-top: 0;">${titulo}</h3><ul style="list-style: none; padding: 0;">`;

  itens.forEach(item => {
    html += `<li style="padding: 8px 0; border-bottom: 1px solid #ddd;">${formatador(item)}</li>`;
  });

  html += '</ul>';
  secao.innerHTML = html;

  return secao;
}

/**
 * Exibe ou oculta indicador de carregamento
 * @param {boolean} mostrar - true para mostrar, false para ocultar
 */
function exibirCarregamento(mostrar) {
  let loader = document.getElementById('loader');

  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(51, 51, 189, 0.9);
      color: #fcfc30;
      padding: 30px 50px;
      border-radius: 10px;
      font-size: 20px;
      font-weight: bold;
      z-index: 9999;
      text-align: center;
    `;
    loader.innerHTML = '⏳ Carregando dados...';
    document.body.appendChild(loader);
  }

  loader.style.display = mostrar ? 'block' : 'none';
}

/**
 * Exibe mensagem na tela
 * @param {string} texto - Texto da mensagem
 * @param {string} tipo - 'sucesso', 'erro' ou 'aviso'
 */
function exibirMensagem(texto, tipo = 'aviso') {
  const cores = {
    sucesso: '#28a745',
    erro: '#dc3545',
    aviso: '#ffc107'
  };

  const mensagem = document.createElement('div');
  mensagem.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${cores[tipo]};
    color: white;
    padding: 15px 25px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    z-index: 10000;
    font-weight: bold;
  `;
  mensagem.textContent = texto;

  document.body.appendChild(mensagem);

  // Remove após 5 segundos
  setTimeout(() => {
    mensagem.remove();
  }, 5000);
}

/**
 * Formata data para o padrão brasileiro (DD/MM/YYYY)
 * @param {string} dataISO - Data no formato ISO (YYYY-MM-DD)
 * @returns {string} Data formatada
 */
function formatarData(dataISO) {
  if (!dataISO) return 'Não informado';

  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

// ==================== FUNÇÕES PÚBLICAS (OPCIONAL) ====================

/**
 * Recarrega os dados do usuário (pode ser chamada externamente)
 */
async function recarregarDados() {
  const usuarioId = localStorage.getItem('usuarioId');
  if (!usuarioId) {
    console.error('Nenhum usuário logado');
    return;
  }

  exibirCarregamento(true);

  try {
    const dados = await buscarDadosCompletos(usuarioId);
    exibirDadosNaTela(dados);
    exibirDadosNoConsole(dados);
    exibirMensagem('Dados recarregados com sucesso!', 'sucesso');
  } catch (erro) {
    console.error('Erro ao recarregar:', erro);
    exibirMensagem(`Erro: ${erro.message}`, 'erro');
  } finally {
    exibirCarregamento(false);
  }
}

/**
 * Limpa os dados exibidos na tela
 */
function limparDados() {
  const container = document.getElementById('dadosContainer');
  if (container) {
    container.innerHTML = '<p style="text-align: center; color: #666;">Nenhum dado para exibir</p>';
  }
}

// Torna as funções disponíveis globalmente
window.recarregarDados = recarregarDados;
window.limparDados = limparDados;