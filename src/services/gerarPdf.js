import { periodoDaExperiencia, primeiroNome, rotuloNivel } from '@/utils/formatadores';

const MARGEM = 20;
const LIMITE_DA_PAGINA = 280;
const LARGURA_DO_TEXTO = 170;
const ALTURA_DA_LINHA = 8;

/** Port do "Gerar PDF". O jsPDF só é baixado quando a pessoa pede a ficha. */
export async function gerarFichaPdf(valores) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  let y = 20;

  const quebrarPaginaSePreciso = () => {
    if (y > LIMITE_DA_PAGINA) {
      doc.addPage();
      y = 20;
    }
  };

  const titulo = (texto) => {
    quebrarPaginaSePreciso();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    y += 5;
    doc.text(texto, MARGEM, y);
    doc.setLineWidth(0.5);
    doc.line(MARGEM, y + 2, MARGEM + LARGURA_DO_TEXTO, y + 2);
    y += 10;
  };

  const linha = (texto) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    for (const parte of doc.splitTextToSize(texto, LARGURA_DO_TEXTO)) {
      quebrarPaginaSePreciso();
      doc.text(parte, MARGEM, y);
      y += ALTURA_DA_LINHA;
    }
  };

  const niveis = (itens, vazio) => {
    const preenchidos = itens.filter(({ nome }) => nome.trim());
    if (preenchidos.length === 0) linha(vazio);
    preenchidos.forEach(({ nome, nivel }) => linha(`• ${nome} - Nível: ${rotuloNivel(nivel)}`));
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Ficha de Colaborador', 105, y, { align: 'center' });
  y += 20;

  const { nome, cpf, email, area, telefone, idiomas, tecnologias, experiencias } = valores;

  titulo('Dados Pessoais');
  linha(`Nome: ${nome || 'N/A'}`);
  linha(`CPF: ${cpf || 'N/A'}`);
  linha(`Email: ${email || 'N/A'}`);
  linha(`Área de Atuação: ${area || 'N/A'}`);
  linha(`Telefone: ${telefone || 'N/A'}`);

  titulo('Idiomas');
  niveis(idiomas, 'Nenhum idioma adicionado.');

  titulo('Tecnologias');
  niveis(tecnologias, 'Nenhuma tecnologia adicionada.');

  titulo('Experiência Profissional');
  const preenchidas = experiencias.filter(({ empresa }) => empresa.trim());
  if (preenchidas.length === 0) linha('Não informada.');
  preenchidas.forEach((experiencia) => {
    linha(`Empresa: ${experiencia.empresa}`);
    linha(`Cargo: ${experiencia.cargo || 'N/A'}`);
    linha(`Período: ${periodoDaExperiencia(experiencia) || 'Não informado'}`);
  });

  const nomeDoArquivo = primeiroNome(nome).replace(/[^\p{L}\p{N}]/gu, '') || 'Cadastro';
  doc.save(`Ficha_${nomeDoArquivo}.pdf`);
}
