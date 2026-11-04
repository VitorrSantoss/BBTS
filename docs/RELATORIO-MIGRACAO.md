# Relatório da migração para React

Branch `refatoracao-react`. O plano está em [PLANO-MIGRACAO.md](PLANO-MIGRACAO.md).

## Resumo

- Os fluxos de colaborador e gestor funcionam de ponta a ponta com os dados fixos.
- **A API real não foi testada, porque o serviço não existe mais no Render.** Os fluxos de rede foram
  validados contra um servidor falso que reproduz as regras lidas no repositório BBTS-API.
- **Salvar o cadastro e a edição vai falhar no backend atual** até a questão da senha ser resolvida.

## O que mudou em cada tela

| Tela                 | Rota                               | O que mudou                                                                                                                                                                              |
| -------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seleção de perfil    | `/`                                | Refeita em flex e responsiva. O perfil fica no localStorage. Gestor agora passa pelo login.                                                                                              |
| Login                | `/login`                           | Entrar leva ao dashboard do perfil. Labels visíveis e validação inline. O azul fora da paleta (`#3D3DD9`) saiu.                                                                          |
| Cadastro             | `/cadastro`                        | Seções claras, linhas dinâmicas em todas elas, máscaras e preview da foto. PDF, linhas e foto foram recuperados do histórico. Senha fixa removida. Spinner no botão no lugar do overlay. |
| Edição               | `/colaborador/editar`              | Carrega os dados e usa PUT. Compara linha a linha, sem duplicar nada. Fica bloqueada se os dados atuais não carregarem.                                                                  |
| Dashboard            | `/colaborador`                     | Usa os dados do usuário, com queda para o mock. Alt do Pedro corrigido. Cursos sem página viraram botões com toast.                                                                      |
| Perfil               | `/colaborador/perfil`              | Deixou de ser estático. Foto circular e cards brancos. Dropdown "Serviços" não portado.                                                                                                  |
| Home do gestor       | `/gestor`                          | Todos os cards navegam com Link. A nav não aponta mais para telas do colaborador.                                                                                                        |
| Equipe               | `/gestor/equipes/:id`              | Uma rota por equipe, membros clicáveis e breadcrumb. Botão fixo Voltar removido. Alts de Gabriel e Guilherme corrigidos.                                                                 |
| Colaborador (gestor) | `/gestor/colaboradores/:id`        | Header mostra "Colaborador". Barras com a marca do mínimo esperado. "Adicionar colaborador" agora funciona.                                                                              |
| Perfil (gestor)      | `/gestor/colaboradores/:id/perfil` | Rota nova, com layout e nav de gestor.                                                                                                                                                   |

Em todas as telas, cada `alert()` virou toast, as 4 fontes viraram Inter e os estados de loading,
vazio e erro foram adicionados. O `index.html` de splash saiu.

## Redesenho visual

Depois da migração, todas as telas foram redesenhadas, mantendo as cores, os logos e as regras de
contraste do BB.

- **Estrutura:** faixa azul contínua ao cabeçalho, com os cards flutuando sobre ela.
- **Navegação:** pills, com o item ativo em amarelo, e transição suave entre telas.
- **Entrada:** seleção de perfil e login em tela dividida, com o símbolo amarelo em destaque.
- **Competências:** barras com um segmento por nível SFIA, e aviso quando o nível está abaixo do mínimo.
- **Perfil:** competências logo após o cartão, e formação e experiência em linha do tempo.
- **Gestor:** equipes com foto grande e contagem de membros, e conversas em lista compacta.
- **Formulários:** campos preenchidos e painel lateral que acompanha a rolagem.

O logo `foto_perfil.png` saiu da seleção de perfil, substituído por ícones nos cartões de escolha.

## Decisões para você revisar

- **Rosca calculada.** O nível total agora vem das barras, então Pedro passa de 80% fixo para 84%.
- **Sem vermelho nem verde.** A paleta proíbe cores novas, então erro usa azul escuro, ícone e texto.
  Para um vermelho funcional, troque `--color-feedback-error` em `tokens.css`.
- **Tag de equipe translúcida.** Antes era azul. Agora segue a sua lista de identidade.
- **Fora do redesenho.** Glassmorphism, gradientes e dark mode continuam de fora, pela regra de identidade.
- **Sem itálico.** Saiu porque só os pesos 400, 600 e 700 da Inter foram pedidos.
- **Conteúdo fictício.** Equipes 2 a 4 e os colaboradores além do Pedro não existiam nas telas
  antigas. A Equipe 4 não tem membros e Carolina não tem experiências, de propósito, para mostrar o
  estado vazio.
- **Logo do cabeçalho volta para `/`.** Como não há logout, é o caminho para trocar de perfil.
- **Usuário real vê competências, lacunas e jornada do mock,** como já acontecia na versão antiga.

## O que depende do backend

1. **Senha, bloqueante.** `Usuario.senha` tem `@NotBlank` e o PUT substitui a entidade inteira, então
   POST e PUT sem senha devem responder 500. A decisão é sua: o back pode aceitar usuário sem senha e
   manter a atual no PUT, ou o front ganha um campo de senha. Não adicionei o campo porque você pediu
   para sinalizar, e ele seria uma funcionalidade nova.
2. **Subir a API e o front.** A API responde `no-server` e o site `bbts-fod5` está suspenso.
3. **Senhas expostas, urgente ao religar.** `GET /idiomas`, `/tecnologias`, `/experienciaProfissional`
   e `/certificacoes` devolvem o usuário completo, com a senha em texto puro. O front descarta esse
   campo, mas ele continua trafegando. As senhas também são gravadas sem hash.
4. **Filtro por usuário.** As listas trazem dados de todos, e `/certificacoes` traz todos os PDFs em
   base64. Um `?usuarioId=` resolveria.
5. **Mensagens de erro.** Os controllers não usam `@Valid`, então validação vira 500 genérico. CPF ou
   e-mail repetido também. O front mostra uma mensagem geral.
6. **Telefone.** A regex só aceita DDD de 3 dígitos ou números sem máscara. O front envia só os dígitos.
7. **PUT de certificado.** Sem novo arquivo, ele apaga o PDF salvo. Por isso a tela só adiciona e remove.
8. **Endpoints que não existem:** login, recuperação de senha, competências, lacunas, jornada,
   formação, equipes, convites, feedback, foto e área de atuação.
9. **CORS.** Mantendo a URL `bbts-fod5.onrender.com`, nada muda. Em outra URL, a origem precisa entrar
   no `CorsConfig.java`.

## Pendências

- Validar com a API real depois que ela voltar, começando pelo cadastro e pela edição.
- Publicar no Render. Com site criado pelo painel, o `render.yaml` não é lido. O passo a passo está no
  README.
- Apagar `legacy/` depois da validação.
- Dar destino às ações que hoje só mostram um aviso: "Esqueci a senha", os cursos da Jornada e o botão
  "Adicionar novo membro".
- Comprimir as imagens. Alguns avatares de 48px carregam PNGs de até 800 KB. Mantive os arquivos como
  estavam, como pedido.
- Avaliar o ESLint 10 quando o `eslint-plugin-jsx-a11y` aceitar essa versão. Os 8 alertas moderados
  do `npm audit` vêm do `minimatch` usado pelo ESLint 9 e só afetam o desenvolvimento. Em produção
  são 0.

## Validação

| Critério                              | Resultado                                             |
| ------------------------------------- | ----------------------------------------------------- |
| Fluxo do colaborador                  | 44 verificações passaram                              |
| Fluxo do gestor                       | 55 verificações passaram                              |
| Fluxos de rede, com o servidor falso  | 42 verificações passaram                              |
| Teclado, menu mobile, foto e animação | 52 verificações passaram                              |
| Refresh                               | 17 rotas sem 404, em acesso direto e recarga          |
| Sem scroll horizontal                 | 255 combinações de rota e largura, de 360 a 1440px    |
| Console                               | Zero erros e avisos, em produção e em desenvolvimento |
| Lighthouse de acessibilidade          | Nota 100 nas 17 rotas, em mobile e desktop            |
| axe                                   | 0 violações em 47 telas e estados                     |
| `npm run build`, lint e Prettier      | Sem warnings                                          |
| Clone limpo                           | `npm install` sem flags, `dev` e `build` funcionando  |
| Ficha em PDF                          | Gerada e conferida visualmente                        |

Limites do que foi verificado:

- **Refresh** foi testado no `vite preview`, não no Render. O rewrite do `render.yaml` só será
  comprovado no primeiro deploy.
- **Console limpo** vale para o uso sem `usuarioId`. Com a API fora do ar, o navegador registra as
  falhas de rede, e isso não pode ser evitado pelo código.
- **Navegador.** Tudo rodou no Edge, com motor Chromium. Firefox e Safari não foram testados.
- **Falha não reproduzida.** Uma vez, em teste local, `/gestor` carregou sem CSS. Não se repetiu em 210
  cargas dedicadas nem nas execuções seguintes. A causa não foi confirmada. A suspeita é uma falha
  pontual do servidor local.
- **Testes automatizados** ficaram fora do repositório, porque não faziam parte do pedido.
