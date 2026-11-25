import iconePerfil from '@/assets/images/icone-perfil.webp'
import { cx } from '@/utils/classes'

export interface AvatarProps {
  src?: string | null
  /** Texto alternativo. Vazio quando o nome já aparece ao lado (imagem decorativa). */
  alt: string
  tamanho?: number
  borda?: 'nenhuma' | 'azul' | 'amarelo' | 'branca'
  className?: string
}

const bordas = {
  nenhuma: '',
  azul: 'ring-2 ring-primary ring-offset-2 ring-offset-surface',
  amarelo: 'ring-2 ring-accent',
  branca: 'ring-2 ring-surface',
}

/** Foto circular. Sem foto enviada, usa o ícone de perfil padrão. */
export function Avatar({ src, alt, tamanho = 40, borda = 'nenhuma', className }: AvatarProps) {
  return (
    <img
      src={src || iconePerfil}
      alt={alt}
      width={tamanho}
      height={tamanho}
      loading="lazy"
      decoding="async"
      style={{ width: tamanho, height: tamanho }}
      className={cx('shrink-0 rounded-full bg-primary-50 object-cover', bordas[borda], className)}
    />
  )
}

/** Fotos sobrepostas com contador do excedente. */
export function AvatarStack({
  pessoas,
  max = 4,
  tamanho = 32,
}: {
  pessoas: Array<{ nome: string; foto: string | null }>
  max?: number
  tamanho?: number
}) {
  if (pessoas.length === 0) return null
  const visiveis = pessoas.slice(0, max)
  const resto = pessoas.length - visiveis.length
  return (
    <div className="flex items-center" role="img" aria-label={`Membros: ${pessoas.map((p) => p.nome).join(', ')}`}>
      {visiveis.map((p) => (
        <Avatar key={p.nome} src={p.foto} alt="" tamanho={tamanho} borda="branca" className="-ml-2 first:ml-0" />
      ))}
      {resto > 0 && (
        <span
          aria-hidden
          style={{ width: tamanho, height: tamanho }}
          className="-ml-2 inline-flex items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary ring-2 ring-surface"
        >
          +{resto}
        </span>
      )}
    </div>
  )
}
