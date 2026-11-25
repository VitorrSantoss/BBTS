import { periodoDaExperiencia, periodoDaFormacao, primeiroNome, rotuloNivel } from '@/utils/formatadores'
import type { ValoresCadastro } from './cadastro'

const MARGEM = 20
const LIMITE_DA_PAGINA = 275
const LARGURA_DO_TEXTO = 170
const ALTURA_DA_LINHA = 7
const AZUL: [number, number, number] = [51, 51, 189] // #3333BD
const AZUL_PROFUNDO: [number, number, number] = [18, 18, 66] // #121242

/** Ficha do colaborador em PDF. O jsPDF só é baixado quando a pessoa pede a ficha. */
export async function gerarFichaPdf(valores: ValoresCadastro): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  let y = 0

  // Faixa azul da marca no topo
  doc.setFillColor(...AZUL)
  doc.rect(0, 0, 210, 32, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('Ficha de Colaborador', MARGEM, 20)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('BB Tecnologia e Serviços', 210 - MARGEM, 20, { align: 'right' })
  y = 46

  const quebrarPaginaSePreciso = () => {
    if (y > LIMITE_DA_PAGINA) {
      doc.addPage()
      y = 20
    }
  }

  const titulo = (texto: string) => {
    quebrarPaginaSePreciso()
    doc.setTextColor(...AZUL)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text(texto, MARGEM, y)
    doc.setDrawColor(...AZUL)
    doc.setLineWidth(0.4)
    doc.line(MARGEM, y + 2, MARGEM + LARGURA_DO_TEXTO, y + 2)
    y += 10
  }

  const linha = (texto: string) => {
    doc.setTextColor(...AZUL_PROFUNDO)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    for (const parte of doc.splitTextToSize(texto, LARGURA_DO_TEXTO) as string[]) {
      quebrarPaginaSePreciso()
      doc.text(parte, MARGEM, y)
      y += ALTURA_DA_LINHA
    }
  }

  const espaco = () => {
    y += 4
  }

  const niveis = (itens: ValoresCadastro['idiomas'], vazio: string) => {
    const preenchidos = itens.filter(({ nome }) => nome.trim())
    if (preenchidos.length === 0) linha(vazio)
    preenchidos.forEach(({ nome, nivel }) => linha(`•  ${nome}: ${rotuloNivel(nivel)}`))
  }

  const { nome, cpf, email, area, telefone, idiomas, tecnologias, experiencias, formacoes } = valores

  titulo('Dados pessoais')
  linha(`Nome: ${nome || 'Não informado'}`)
  linha(`CPF: ${cpf || 'Não informado'}`)
  linha(`E-mail: ${email || 'Não informado'}`)
  linha(`Área de atuação: ${area || 'Não informada'}`)
  linha(`Telefone: ${telefone || 'Não informado'}`)
  espaco()

  titulo('Idiomas')
  niveis(idiomas, 'Nenhum idioma adicionado.')
  espaco()

  titulo('Tecnologias')
  niveis(tecnologias, 'Nenhuma tecnologia adicionada.')
  espaco()

  titulo('Experiência profissional')
  const preenchidas = experiencias.filter(({ empresa }) => empresa.trim())
  if (preenchidas.length === 0) linha('Não informada.')
  preenchidas.forEach((experiencia) => {
    linha(`${experiencia.cargo || 'Cargo não informado'} · ${experiencia.empresa}`)
    linha(`Período: ${periodoDaExperiencia({ ...experiencia, dataFim: experiencia.dataFim || null }) || 'Não informado'}`)
    espaco()
  })

  titulo('Formação acadêmica')
  const comCurso = formacoes.filter(({ curso }) => curso.trim())
  if (comCurso.length === 0) linha('Não informada.')
  comCurso.forEach((f) => {
    linha(`${f.curso} · ${f.instituicao || 'Instituição não informada'}`)
    const periodo = f.anoInicio
      ? periodoDaFormacao({ anoInicio: Number(f.anoInicio), anoFim: f.anoFim ? Number(f.anoFim) : null, status: f.status })
      : ''
    linha(`Período: ${periodo || 'Não informado'}`)
    espaco()
  })

  const nomeDoArquivo = primeiroNome(nome).replace(/[^\p{L}\p{N}]/gu, '') || 'Cadastro'
  doc.save(`Ficha_${nomeDoArquivo}.pdf`)
}
