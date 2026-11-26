import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CompetencyBar } from './competencias'
import { DonutChart } from './competencias'
import { CampoEmails } from './gestor'
import { useState } from 'react'

describe('<CompetencyBar />', () => {
  it('expõe a barra como progressbar com nível e máximo', () => {
    render(<CompetencyBar sigla="ITSP" nome="Programação" nivel={5} nivelMax={6} />)
    const barra = screen.getByRole('progressbar', { name: /ITSP\s*Programação/ })
    expect(barra).toHaveAttribute('aria-valuenow', '5')
    expect(barra).toHaveAttribute('aria-valuemax', '6')
    expect(barra).toHaveAttribute('aria-valuetext', 'Nível 5 de 6.')
  })

  it('anuncia quando está abaixo do mínimo da equipe', () => {
    render(<CompetencyBar sigla="GRDN" nome="Design Gráfico" nivel={4} nivelMax={5} nivelMinimo={5} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Nível 4 de 5. Mínimo esperado: nível 5 de 5, faltam 1.')
    expect(screen.getByText('Abaixo do mínimo')).toBeInTheDocument()
  })

  it('mostra "Atende" quando cumpre o mínimo', () => {
    render(<CompetencyBar sigla="TEST" nome="Testes" nivel={3} nivelMax={6} nivelMinimo={3} />)
    expect(screen.getByText('Atende')).toBeInTheDocument()
  })
})

describe('<DonutChart />', () => {
  it('tem nome acessível com o percentual final', () => {
    render(<DonutChart valor={84.4} rotulo="Nível total" />)
    expect(screen.getByRole('img', { name: 'Nível total: 84%' })).toBeInTheDocument()
  })
})

describe('<CampoEmails />', () => {
  function Controlado() {
    const [emails, setEmails] = useState<string[]>([])
    return <CampoEmails emails={emails} aoMudar={setEmails} />
  }

  it('vira chips com Enter e vírgula, recusa e-mail inválido e remove', async () => {
    const user = userEvent.setup()
    render(<Controlado />)
    const campo = screen.getByLabelText('E-mails dos colaboradores')
    await user.type(campo, 'ana@bbts.com.br{Enter}bruno@bbts.com.br,')
    expect(screen.getByRole('list', { name: 'E-mails adicionados' })).toHaveTextContent('ana@bbts.com.brbruno@bbts.com.br')

    await user.type(campo, 'invalido{Enter}')
    expect(screen.getByText(/"invalido" não parece um e-mail/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remover ana@bbts.com.br' }))
    expect(screen.queryByText('ana@bbts.com.br')).not.toBeInTheDocument()
  })
})
