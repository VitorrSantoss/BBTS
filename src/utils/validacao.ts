import { z } from 'zod'
import { apenasDigitos, digitosDoTelefone } from './mascaras'

/** Regras reaproveitadas pelos formulários (mensagens em português, ditas como gente). */

export const emailObrigatorio = z
  .string()
  .trim()
  .min(1, 'Informe o e-mail.')
  .pipe(z.email('Digite um e-mail válido, como nome@empresa.com.'))

export const emailOpcional = z
  .string()
  .trim()
  .refine((v) => v === '' || z.email().safeParse(v).success, 'Digite um e-mail válido, como nome@empresa.com.')

export const obrigatorio = (mensagem: string) => z.string().trim().min(1, mensagem)

export const cpf = z
  .string()
  .refine((v) => apenasDigitos(v).length > 0, 'Informe o CPF.')
  .refine((v) => apenasDigitos(v).length === 0 || apenasDigitos(v).length === 11, 'O CPF precisa ter 11 dígitos.')

export const telefone = z.string().refine((v) => {
  const d = digitosDoTelefone(v)
  return d.length === 0 || d.length >= 10
}, 'Informe o DDD e o número completo.')

export const siglaSfia = z
  .string()
  .trim()
  .min(1, 'Informe a sigla.')
  .regex(/^[A-Za-z]{4}$/, 'A sigla SFIA tem exatamente 4 letras.')

/** Níveis SFIA vão de 1 a 7. Vem de input type=number como string. */
export const nivelSfia = (mensagem: string) =>
  z
    .string()
    .trim()
    .min(1, mensagem)
    .refine((v) => {
      const n = Number(v)
      return Number.isInteger(n) && n >= 1 && n <= 7
    }, 'Use um número inteiro de 1 a 7.')
