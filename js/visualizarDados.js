// visualizarDados.js
// Script para buscar e exibir todos os dados cadastrados do usuário

document.addEventListener("DOMContentLoaded", async () => {
  const usuarioId = localStorage.getItem('usuarioId');
  
  if (!usuarioId) {
    console.log('Nenhum usuário logado');
    return;
  }

  try {
    // ===== BUSCAR DADOS DO USUÁRIO =====
    const responseUsuario = await fetch(`http://localhost:8080/usuarios/${usuarioId}`);
    const usuario = await responseUsuario.json();
    console.log('📋 Dados do Usuário:', usuario);

    // ===== BUSCAR IDIOMAS =====
    const responseIdiomas = await fetch('http://localhost:8080/idiomas');
    const todosIdiomas = await responseIdiomas.json();
    const idiomasUsuario = todosIdiomas.filter(i => i.usuario?.id === parseInt(usuarioId));
    console.log('🌍 Idiomas:', idiomasUsuario);

    // ===== BUSCAR TECNOLOGIAS =====
    const responseTecnologias = await fetch('http://localhost:8080/tecnologias');
    const todasTecnologias = await responseTecnologias.json();
    const tecnologiasUsuario = todasTecnologias.filter(t => t.usuario?.id === parseInt(usuarioId));
    console.log('💻 Tecnologias:', tecnologiasUsuario);

    // ===== BUSCAR EXPERIÊNCIAS =====
    const responseExperiencias = await fetch('http://localhost:8080/experienciaProfissional');
    const todasExperiencias = await responseExperiencias.json();
    const experienciasUsuario = todasExperiencias.filter(e => e.usuario?.id === parseInt(usuarioId));
    console.log('💼 Experiências:', experienciasUsuario);

    // ===== BUSCAR CERTIFICAÇÕES =====
    const responseCertificacoes = await fetch('http://localhost:8080/certificacoes');
    const todasCertificacoes = await responseCertificacoes.json();
    const certificacoesUsuario = todasCertificacoes.filter(c => c.usuario?.id === parseInt(usuarioId));
    console.log('🏆 Certificações:', certificacoesUsuario);

    // ===== EXIBIR NA TELA (EXEMPLO) =====
    exibirDadosNaTela({
      usuario,
      idiomas: idiomasUsuario,
      tecnologias: tecnologiasUsuario,
      experiencias: experienciasUsuario,
      certificacoes: certificacoesUsuario
    });

  } catch (erro) {
    console.error('❌ Erro ao buscar dados:', erro);
  }
});

// Função para exibir os dados na tela
function exibirDadosNaTela(dados) {
  console.log('=== DADOS COMPLETOS DO USUÁRIO ===');
  console.log('Nome:', dados.usuario.nome);
  console.log('Email:', dados.usuario.email);
  console.log('CPF:', dados.usuario.cpf);
  console.log('Telefone:', dados.usuario.telefone);
  console.log('Data de Nascimento:', dados.usuario.dataNascimento);
  
  console.log('\n--- IDIOMAS ---');
  dados.idiomas.forEach(idioma => {
    console.log(`${idioma.nome}: ${idioma.nivel}`);
  });

  console.log('\n--- TECNOLOGIAS ---');
  dados.tecnologias.forEach(tech => {
    console.log(`${tech.nome}: ${tech.nivel}`);
  });

  console.log('\n--- EXPERIÊNCIAS ---');
  dados.experiencias.forEach(exp => {
    console.log(`${exp.cargo} na ${exp.empresa} (${exp.dataInicio} - ${exp.dataFim || 'Atual'})`);
  });

  console.log('\n--- CERTIFICAÇÕES ---');
  dados.certificacoes.forEach(cert => {
    console.log(`${cert.nomeCurso} - ${cert.dataConclusao}`);
  });
}