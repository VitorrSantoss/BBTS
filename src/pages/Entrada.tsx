import { Link, Navigate, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { ArrowLeft, ArrowRight, Lock, Mail, UserRound, UsersRound } from 'lucide-react'
import { Button, Input, toast } from '@/components/ui'
import { chaves } from '@/hooks/useColaborador'
import { TelaDividida } from '@/layouts/Layouts'
import { AuthAPI, ErroApi } from '@/services/api'
import { useSessao } from '@/services/sessao'
import type { Perfil } from '@/types/dominio'
import { emailObrigatorio, obrigatorio } from '@/utils/validacao'

const PERFIS: Array<{ valor: Perfil; rotulo: string; descricao: string; Icone: typeof UserRound }> = [
  { valor: 'colaborador', rotulo: 'Colaborador', descricao: 'Veja seus níveis, lacunas e sua jornada de capacitação.', Icone: UserRound },
  { valor: 'gestor', rotulo: 'Gestor', descricao: 'Acompanhe equipes, competências mínimas e feedbacks.', Icone: UsersRound },
]

/** `/`: escolha do perfil de acesso. */
export function SelecaoPerfil() {
  const navegar = useNavigate()
  const escolherPerfil = useSessao((s) => s.escolherPerfil)

  return (
    <TelaDividida>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-fg-muted">Bem-vindo ao BBTS</p>
          <h1 className="text-display font-bold text-primary">Qual perfil você quer acessar?</h1>
        </div>
        <ul className="flex flex-col gap-3">
          {PERFIS.map(({ valor, rotulo, descricao, Icone }) => (
            <li key={valor}>
              <button
                type="button"
                onClick={() => {
                  escolherPerfil(valor)
                  navegar('/login', { viewTransition: true })
                }}
                className="group flex w-full items-center gap-4 rounded-xl border border-primary-100 bg-surface p-4 text-left shadow-xs transition-[border-color,box-shadow] duration-(--dur-base) hover:border-primary-300 hover:shadow-md sm:p-5"
              >
                <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-accent">
                  <Icone className="size-6" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-bold text-primary">{rotulo}</span>
                  <span className="text-sm text-fg-muted">{descricao}</span>
                </span>
                <ArrowRight
                  aria-hidden
                  className="size-5 shrink-0 text-primary transition-transform duration-(--dur-base) group-hover:translate-x-1"
                />
              </button>
            </li>
          ))}
        </ul>
        <p className="text-sm text-fg-muted">
          Ainda não tem cadastro?{' '}
          <Link to="/cadastro" viewTransition className="font-semibold text-primary underline underline-offset-4">
            Cadastre-se como colaborador
          </Link>
        </p>
      </div>
    </TelaDividida>
  )
}

const esquemaLogin = z.object({
  email: emailObrigatorio,
  senha: obrigatorio('Informe a senha.').min(6, 'A senha tem no mínimo 6 caracteres.'),
})
type Login = z.infer<typeof esquemaLogin>

/** `/login`: confere e-mail, senha e perfil na API (POST /auth/login). */
export function Login() {
  const navegar = useNavigate()
  const queryClient = useQueryClient()
  const perfil = useSessao((s) => s.perfil)
  const salvarUsuarioId = useSessao((s) => s.salvarUsuarioId)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Login>({ resolver: zodResolver(esquemaLogin), defaultValues: { email: '', senha: '' } })

  // O destino depende do perfil: sem ele, a pessoa precisa escolher primeiro.
  if (!perfil) return <Navigate to="/" replace />

  const entrar = async ({ email, senha }: Login) => {
    try {
      const { usuario, primeiroAcesso } = await AuthAPI.entrar(email, senha, perfil)
      queryClient.clear()
      queryClient.setQueryData(chaves.usuario(usuario.id), usuario)
      salvarUsuarioId(usuario.id)
      if (primeiroAcesso) toast.sucesso('Primeiro acesso: esta passa a ser a sua senha.')
      navegar(`/${perfil}`, { replace: true, viewTransition: true })
    } catch (erro) {
      if (erro instanceof ErroApi && (erro.status === 401 || erro.status === 403)) {
        setError('senha', { message: erro.message })
        return
      }
      toast.erro(erro instanceof ErroApi ? erro.message : 'Não conseguimos falar com a API. Tente de novo em instantes.')
    }
  }

  return (
    <TelaDividida>
      <div className="flex flex-col gap-8">
        <Link
          to="/"
          viewTransition
          className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Trocar perfil
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="text-display font-bold text-primary">Entrar</h1>
          <p className="text-fg-muted">
            Acessando como <strong className="font-semibold text-fg">{perfil === 'gestor' ? 'gestor' : 'colaborador'}</strong>.
          </p>
        </div>

        <form noValidate onSubmit={handleSubmit(entrar)} className="flex flex-col gap-5">
          <Input
            {...register('email')}
            label="E-mail corporativo"
            type="email"
            icone={<Mail />}
            autoComplete="email"
            placeholder="seu.email@bbts.com.br"
            required
            erro={errors.email?.message}
          />
          <Input
            {...register('senha')}
            label="Senha"
            type="password"
            icone={<Lock />}
            autoComplete="current-password"
            placeholder="Sua senha"
            required
            erro={errors.senha?.message}
          />
          <div className="flex justify-end">
            <Button variante="texto" tamanho="sm" onClick={() => toast.info('Procure seu gestor para redefinir a senha.')}>
              Esqueci a senha
            </Button>
          </div>
          <Button type="submit" tamanho="lg" carregando={isSubmitting} iconeDireita={<ArrowRight aria-hidden className="size-5" />}>
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-fg-muted">
          Não possui uma conta?{' '}
          <Link to="/cadastro" viewTransition className="font-semibold text-primary underline underline-offset-4">
            Cadastre-se
          </Link>
        </p>
      </div>
    </TelaDividida>
  )
}
