import { useState, type KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { Mail, Send, X } from 'lucide-react'
import { chaves } from '@/hooks/useColaborador'
import { EquipeAPI, FeedbackAPI, mensagemDaApi } from '@/services/api'
import { useSessao } from '@/services/sessao'
import type { Equipe } from '@/types/dominio'
import { emailObrigatorio, obrigatorio } from '@/utils/validacao'
import { Button } from '../ui/Button'
import { Input, Select, Textarea } from '../ui/Campos'
import { toast } from '../ui/toastStore'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Campo de vários e-mails em chips: Enter, vírgula ou espaço confirmam; Backspace no vazio remove o último.
 * Controlado: recebe e devolve a lista.
 */
export function CampoEmails({
  emails,
  aoMudar,
  erro,
  label = 'E-mails dos colaboradores',
}: {
  emails: string[]
  aoMudar: (emails: string[]) => void
  erro?: string
  label?: string
}) {
  const [texto, setTexto] = useState('')
  const [erroLocal, setErroLocal] = useState('')

  const confirmar = () => {
    const novos = texto
      .split(/[\s,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    if (!novos.length) return true
    const invalido = novos.find((e) => !EMAIL.test(e))
    if (invalido) {
      setErroLocal(`"${invalido}" não parece um e-mail. Confere?`)
      return false
    }
    aoMudar([...new Set([...emails, ...novos])])
    setTexto('')
    setErroLocal('')
    return true
  }

  const aoTeclar = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault()
      confirmar()
    } else if (e.key === 'Backspace' && !texto && emails.length) {
      aoMudar(emails.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {emails.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="E-mails adicionados">
          {emails.map((email) => (
            <li
              key={email}
              className="inline-flex h-7 items-center gap-1 rounded-full bg-primary-50 pr-1 pl-3 text-xs font-semibold text-primary"
            >
              {email}
              <button
                type="button"
                onClick={() => aoMudar(emails.filter((e) => e !== email))}
                aria-label={`Remover ${email}`}
                className="rounded-full p-1 hover:bg-primary-100"
              >
                <X aria-hidden className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Input
        label={label}
        type="email"
        icone={<Mail />}
        placeholder="nome@bbts.com.br"
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value)
          setErroLocal('')
        }}
        onKeyDown={aoTeclar}
        onBlur={confirmar}
        erro={erroLocal || erro}
        dica="Separe por Enter ou vírgula. Use o e-mail de colaboradores já cadastrados."
      />
    </div>
  )
}

/** Adiciona à equipe os colaboradores cadastrados com os e-mails informados. */
export function FormConvite({ equipeId, nomeEquipe, aoConcluir }: { equipeId: number; nomeEquipe: string; aoConcluir?: () => void }) {
  const queryClient = useQueryClient()
  const [emails, setEmails] = useState<string[]>([])
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const enviar = async () => {
    if (!emails.length) {
      setErro('Adicione pelo menos um e-mail.')
      return
    }
    setEnviando(true)
    try {
      const { adicionados, naoEncontrados } = await EquipeAPI.adicionarMembros(equipeId, emails)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: chaves.equipes }),
        queryClient.invalidateQueries({ queryKey: chaves.colaboradores }),
      ])
      if (adicionados.length) {
        const quem = adicionados.length === 1 ? `${adicionados[0]!.nome} entrou` : `${adicionados.length} pessoas entraram`
        toast.sucesso(`${quem} na equipe ${nomeEquipe}.`)
      }
      if (naoEncontrados.length) {
        setEmails(naoEncontrados)
        setErro(`Sem cadastro de colaborador: ${naoEncontrados.join(', ')}. Peça para a pessoa se cadastrar primeiro.`)
      } else {
        setEmails([])
        aoConcluir?.()
      }
    } catch (e) {
      toast.erro(mensagemDaApi(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        void enviar()
      }}
    >
      <CampoEmails
        emails={emails}
        aoMudar={(lista) => {
          setEmails(lista)
          setErro('')
        }}
        erro={erro}
      />
      <Button type="submit" icone={<Send aria-hidden className="size-4" />} carregando={enviando} className="self-start">
        {emails.length > 1 ? `Adicionar ${emails.length} pessoas` : 'Adicionar à equipe'}
      </Button>
    </form>
  )
}

const esquemaFeedback = z.object({
  destinatario: emailObrigatorio,
  tipo: z.enum(['POSITIVO', 'DESENVOLVIMENTO']),
  mensagem: obrigatorio('Escreva a mensagem.').max(1000, 'Use até 1.000 caracteres.'),
})
type Feedback = z.infer<typeof esquemaFeedback>

/** Feedback para um colaborador. Fica gravado na API e aparece no painel de quem recebe. */
export function FormFeedback({ destinatario = '', aoEnviar }: { destinatario?: string; aoEnviar?: () => void }) {
  const queryClient = useQueryClient()
  const usuarioId = useSessao((s) => s.usuarioId)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Feedback>({
    resolver: zodResolver(esquemaFeedback),
    defaultValues: { destinatario, tipo: 'POSITIVO', mensagem: '' },
  })

  const enviar = async ({ destinatario: email, tipo, mensagem }: Feedback) => {
    try {
      const feedback = await FeedbackAPI.enviar({
        autorId: usuarioId ? Number(usuarioId) : null,
        destinatarioEmail: email,
        tipo,
        mensagem,
      })
      await queryClient.invalidateQueries({ queryKey: chaves.feedbacks })
      toast.sucesso(`Feedback enviado para ${feedback.destinatario.nome}.`)
      reset({ destinatario, tipo: 'POSITIVO', mensagem: '' })
      aoEnviar?.()
    } catch (e) {
      toast.erro(mensagemDaApi(e))
    }
  }

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={handleSubmit(enviar)}>
      <Input
        {...register('destinatario')}
        label="E-mail do colaborador"
        type="email"
        icone={<Mail />}
        required
        erro={errors.destinatario?.message}
      />
      <Select
        {...register('tipo')}
        label="Tipo"
        opcoes={[
          { valor: 'POSITIVO', rotulo: 'Reconhecimento' },
          { valor: 'DESENVOLVIMENTO', rotulo: 'Ponto de desenvolvimento' },
        ]}
      />
      <Textarea
        {...register('mensagem')}
        label="Mensagem"
        required
        rows={5}
        placeholder="Conte o que você observou e o impacto que teve."
        erro={errors.mensagem?.message}
      />
      <Button type="submit" icone={<Send aria-hidden className="size-4" />} carregando={isSubmitting} className="self-start">
        Enviar feedback
      </Button>
    </form>
  )
}

const esquemaEquipe = z.object({
  nome: obrigatorio('Dê um nome à equipe.').max(60, 'Use até 60 caracteres.'),
  foco: obrigatorio('Conte o foco da equipe.').max(80, 'Use até 80 caracteres.'),
  descricao: z.string().max(1000, 'Use até 1.000 caracteres.'),
})
type NovaEquipe = z.infer<typeof esquemaEquipe>

/** Cria a equipe do gestor logado e já adiciona os colaboradores informados. */
export function FormNovaEquipe({ aoConcluir, aoCancelar }: { aoConcluir: (equipe: Equipe) => void; aoCancelar: () => void }) {
  const queryClient = useQueryClient()
  const usuarioId = useSessao((s) => s.usuarioId)
  const [emails, setEmails] = useState<string[]>([])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NovaEquipe>({ resolver: zodResolver(esquemaEquipe), defaultValues: { nome: '', foco: '', descricao: '' } })

  const criar = async ({ nome, foco, descricao }: NovaEquipe) => {
    if (!usuarioId) return
    try {
      const equipe = await EquipeAPI.criar({ nome, foco, descricao, gestorId: Number(usuarioId), emails })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: chaves.equipes }),
        queryClient.invalidateQueries({ queryKey: chaves.colaboradores }),
      ])
      const membros = equipe.membros.length
      toast.sucesso(`Equipe ${equipe.nome} criada${membros ? ` com ${membros} membro(s)` : ''}.`)
      const faltaram = emails.length - membros
      if (faltaram > 0) toast.info(`${faltaram} e-mail(s) sem cadastro de colaborador ficaram de fora.`)
      aoConcluir(equipe)
    } catch (e) {
      toast.erro(mensagemDaApi(e))
    }
  }

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={handleSubmit(criar)}>
      <Input {...register('nome')} label="Nome da equipe" placeholder="Ex.: Dados e Analytics" required erro={errors.nome?.message} />
      <Input {...register('foco')} label="Foco" placeholder="Ex.: Engenharia de dados para o varejo" required erro={errors.foco?.message} />
      <Textarea
        {...register('descricao')}
        label="Sobre a equipe (opcional)"
        rows={3}
        placeholder="O que a equipe faz e para quem."
        erro={errors.descricao?.message}
      />
      <CampoEmails emails={emails} aoMudar={setEmails} label="Adicionar membros (opcional)" />
      <div className="flex justify-end gap-2 pt-2">
        <Button variante="fantasma" onClick={aoCancelar}>
          Cancelar
        </Button>
        <Button type="submit" carregando={isSubmitting}>
          Criar equipe
        </Button>
      </div>
    </form>
  )
}
