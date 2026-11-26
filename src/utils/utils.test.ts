import { describe, expect, it } from 'vitest'
import type { Competencia } from '@/types/dominio'
import {
  aderenciaAoMinimo,
  aderenciaDaEquipe,
  calcularNivelTotal,
  competenciasAbaixoDoMinimo,
  membrosQueAtendem,
  situacaoDoMinimo,
} from './competencias'
import { minimosDe, rotuloEquipe, tituloEquipe } from './equipes'
import {
  formatarData,
  formatarMesAno,
  periodoDaExperiencia,
  periodoDaFormacao,
  primeiroNome,
  rotuloDeMembros,
  rotuloNivel,
} from './formatadores'
import { digitosDoTelefone, mascararCpf, mascararTelefone } from './mascaras'
import { cpf, emailObrigatorio, nivelSfia, siglaSfia, telefone } from './validacao'

const MAXIMOS: Record<string, number> = { PRMG: 7, PROG: 6, TEST: 6, CFMG: 6, URCH: 6, GRDN: 5 }
const competencia = (sigla: string, nivel: number): Competencia => ({ sigla, nome: sigla, nivel, nivelMax: MAXIMOS[sigla] ?? 6 })
const pessoa = (...competencias: Competencia[]) => ({ competencias })

describe('competências', () => {
  it('nível total = soma dos níveis / soma dos máximos', () => {
    // 7+5+6+4+4 = 26 de 7+6+6+6+6 = 31 → 84%
    const niveis = [competencia('PRMG', 7), competencia('PROG', 5), competencia('TEST', 6), competencia('CFMG', 4), competencia('URCH', 4)]
    expect(calcularNivelTotal(niveis)).toBe(84)
    expect(calcularNivelTotal([])).toBe(0)
  })

  it('situação frente ao mínimo', () => {
    expect(situacaoDoMinimo(4, undefined)).toBe('sem-minimo')
    expect(situacaoDoMinimo(4, 4)).toBe('atende')
    expect(situacaoDoMinimo(3, 4)).toBe('abaixo')
  })

  it('competência exigida que não está no perfil conta como nível 0', () => {
    const comps = [competencia('URCH', 4)]
    expect(competenciasAbaixoDoMinimo(comps, { URCH: 4, GRDN: 3 })).toEqual([{ sigla: 'GRDN', minimo: 3, nivel: 0 }])
    expect(aderenciaAoMinimo(comps, { URCH: 4, GRDN: 3 })).toBe(50)
    expect(aderenciaAoMinimo(comps, {})).toBe(100)
  })

  it('aderência e atendimento da equipe', () => {
    const ana = pessoa(competencia('URCH', 4), competencia('GRDN', 4))
    const bruno = pessoa(competencia('URCH', 5), competencia('GRDN', 5))
    const minimos = { URCH: 4, GRDN: 5 }
    // Ana: URCH 4 ok, GRDN 4 abaixo → 50%. Bruno: ambos ok → 100%.
    expect(aderenciaDaEquipe([ana, bruno], minimos)).toBe(75)
    expect(aderenciaDaEquipe([], minimos)).toBeNull()
    expect(membrosQueAtendem([ana, bruno], 'GRDN', 5)).toBe(1)
  })
})

describe('equipes', () => {
  it('títulos e mapa de mínimos', () => {
    expect(tituloEquipe({ id: 1, nome: 'Desenvolvimento' })).toBe('1. Desenvolvimento')
    expect(rotuloEquipe({ id: 3 })).toBe('Equipe 03')
    expect(minimosDe([competencia('PROG', 4), competencia('TEST', 3)])).toEqual({ PROG: 4, TEST: 3 })
    expect(minimosDe(null)).toEqual({})
  })
})

describe('formatadores', () => {
  it('formata níveis, nomes e períodos', () => {
    expect(rotuloNivel('INTERMEDIARIO')).toBe('Intermediário')
    expect(rotuloNivel('DESCONHECIDO')).toBe('DESCONHECIDO')
    expect(primeiroNome('  Pedro Henrique ')).toBe('Pedro')
    expect(formatarMesAno('2023-08-01')).toBe('08.2023')
    expect(periodoDaExperiencia({ dataInicio: '2023-08-01', dataFim: null, empregoAtual: true })).toBe('08.2023 – Atual')
    expect(rotuloDeMembros(0)).toBe('Sem membros')
    expect(rotuloDeMembros(1)).toBe('1 membro')
    expect(rotuloDeMembros(4)).toBe('4 membros')
    expect(periodoDaFormacao({ anoInicio: 2017, anoFim: 2019, status: 'CONCLUIDO' })).toBe('2017 – 2019')
    expect(periodoDaFormacao({ anoInicio: 2025, anoFim: 2026, status: 'CURSANDO' })).toBe('2025 – 2026 (previsto)')
    expect(periodoDaFormacao({ anoInicio: 2025, anoFim: null, status: 'CURSANDO' })).toBe('2025 – Atual')
    expect(formatarData('2026-11-21T12:19:41.136')).toBe('21/11/2026')
  })
})

describe('máscaras', () => {
  it('CPF e telefone', () => {
    expect(mascararCpf('12345678909')).toBe('123.456.789-09')
    expect(mascararCpf('1234')).toBe('123.4')
    expect(mascararTelefone('81912345678')).toBe('(81) 91234-5678')
    expect(mascararTelefone('8132345678')).toBe('(81) 3234-5678')
    expect(digitosDoTelefone('081912345678')).toBe('81912345678')
  })
})

describe('validação', () => {
  it('aceita e recusa com mensagens humanas', () => {
    expect(emailObrigatorio.safeParse('nome@bbts.com.br').success).toBe(true)
    expect(emailObrigatorio.safeParse('').error?.issues[0]?.message).toBe('Informe o e-mail.')
    expect(emailObrigatorio.safeParse('nome@').error?.issues[0]?.message).toMatch(/e-mail válido/)
    expect(cpf.safeParse('123.456.789-09').success).toBe(true)
    expect(cpf.safeParse('123.456').error?.issues[0]?.message).toBe('O CPF precisa ter 11 dígitos.')
    expect(telefone.safeParse('').success).toBe(true)
    expect(telefone.safeParse('(81) 9123').success).toBe(false)
    expect(siglaSfia.safeParse('PRMG').success).toBe(true)
    expect(siglaSfia.safeParse('PRM').error?.issues[0]?.message).toBe('A sigla SFIA tem exatamente 4 letras.')
    expect(nivelSfia('Informe').safeParse('7').success).toBe(true)
    expect(nivelSfia('Informe').safeParse('8').error?.issues[0]?.message).toBe('Use um número inteiro de 1 a 7.')
  })
})
