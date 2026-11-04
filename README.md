# BBTS: Sistema de Gestão de Competências

Sistema da BB Tecnologia e Serviços para acompanhar competências profissionais no modelo SFIA.
Cada competência tem uma sigla de 4 letras e um nível atual sobre o nível máximo, como `ITSP 5/6`.

- **Colaborador:** vê seus níveis, o perfil, as lacunas de conhecimento e a jornada de capacitação.
- **Gestor:** vê equipes e conversas, convida membros, acompanha as competências mínimas da equipe,
  adiciona competências e envia feedback.

## Stack

- React 19 e Vite 8, em JavaScript (JSX)
- React Router 8
- CSS Modules com tokens globais em CSS variables
- Gráficos próprios em SVG e CSS
- jsPDF para a ficha do colaborador
- ESLint 9 com jsx-a11y, e Prettier

## Como rodar

Requer Node 20.19 ou mais novo.

```bash
npm install
npm run dev
```

O app abre em <http://localhost:3000>. Sem cadastro feito, tudo funciona com os dados fixos.

| Script                 | O que faz                               |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Servidor de desenvolvimento             |
| `npm run build`        | Gera o site em `dist/`                  |
| `npm run preview`      | Serve o build localmente                |
| `npm run lint`         | ESLint, com as regras de acessibilidade |
| `npm run format`       | Formata com Prettier                    |
| `npm run format:check` | Confere a formatação                    |

A porta 3000 é proposital: é a porta local liberada no CORS da API. Na 5173, padrão do Vite, o
navegador bloquearia as chamadas.

## Variáveis de ambiente

| Variável       | Uso        | Padrão                          |
| -------------- | ---------- | ------------------------------- |
| `VITE_API_URL` | URL da API | `https://bbts-api.onrender.com` |

O padrão está no `.env`, versionado porque não é segredo. Para outra API na sua máquina, crie um
`.env.local` com o valor desejado.

## Rotas

| Rota                               | Tela                              | Perfil      |
| ---------------------------------- | --------------------------------- | ----------- |
| `/`                                | Seleção de perfil                 | Público     |
| `/login`                           | Login                             | Público     |
| `/cadastro`                        | Cadastro                          | Público     |
| `/colaborador`                     | Dashboard                         | Colaborador |
| `/colaborador/perfil`              | Perfil                            | Colaborador |
| `/colaborador/editar`              | Edição do cadastro                | Colaborador |
| `/gestor`                          | Home do gestor                    | Gestor      |
| `/gestor/equipes/:id`              | Equipe                            | Gestor      |
| `/gestor/colaboradores/:id`        | Colaborador visto pelo gestor     | Gestor      |
| `/gestor/colaboradores/:id/perfil` | Perfil completo visto pelo gestor | Gestor      |

O fluxo é `/`, depois `/login`, depois o dashboard do perfil escolhido. O perfil fica no
localStorage, e `RequireProfile` manda de volta para `/` quem tenta abrir rotas do outro perfil.
O logo do cabeçalho volta para a seleção de perfil.

## Estrutura

```text
src/
  app/          rotas, RequireProfile, trilhas do breadcrumb e providers (Toast e Perfil)
  layouts/      AppLayout, PublicLayout, TelaDividida, Palco, Cabecalho e Breadcrumb
  components/
    ui/           Button, Input, Select, Textarea, Card, Tag, Avatar, Toast, Skeleton...
    competencias/ CompetencyBar, DonutChart e CompetencyList
    colaborador/  blocos das telas de colaborador
    gestor/       formulários de convite e feedback
  pages/        uma pasta por tela
  services/     api.js (único ponto de rede), cadastro, PDF e sessão
  hooks/        useUsuario, useDadosColaborador, useFormulario, useRecurso...
  mocks/        personas, equipes e competências fixas
  styles/       tokens.css e global.css
  assets/       imagens
legacy/         versão antiga em HTML, CSS e JS
docs/           plano e relatório da migração
```

## De onde vêm os dados

- **Sem `usuarioId` no localStorage:** as telas usam a persona Pedro, de `src/mocks`.
- **Com `usuarioId`:** as telas usam a API. Se ela falhar, caem no mock e mostram um aviso com
  "Tentar de novo".
- **Sempre mock:** competências, lacunas, jornada, formação, equipes e conversas, porque a API não
  tem endpoints para eles.
- **Simulados:** login, convites, feedback e nova competência. Eles validam o formulário e mostram
  um toast, sem enviar nada.

O `usuarioId` é gravado ao concluir um cadastro.

## Design tokens

`src/styles/tokens.css` é o único arquivo com cores, espaçamento, raios e sombras. Os breakpoints
são sempre 640 e 960px, com media queries `min-width`.

Regra de contraste: amarelo nunca é texto ou ícone sobre branco ou cinza claro. Use amarelo sobre
azul, ou como fundo com texto azul.

## Deploy no Render

O front roda como site estático no Render, na URL que a API libera no CORS:
`https://bbts-fod5.onrender.com`.

**Com Blueprint:** o `render.yaml` da raiz já define tudo.

**Com o site criado pelo painel,** o `render.yaml` não é lido. Configure em Settings:

| Campo                  | Valor                                           |
| ---------------------- | ----------------------------------------------- |
| Build Command          | `npm ci --include=dev && npm run build`         |
| Publish Directory      | `dist`                                          |
| Environment            | `VITE_API_URL=https://bbts-api.onrender.com`    |
| Redirects and Rewrites | Source `/*`, Destination `/index.html`, Rewrite |

Sem o rewrite, o refresh em qualquer rota interna dá 404. Em outra URL, adicione a nova origem ao
`CorsConfig.java` do repositório BBTS-API.

## Versão antiga

A pasta `legacy/` guarda o site anterior até a validação. Para abrir:

```bash
npx serve legacy
```

Depois de validar, basta apagar a pasta.

## Autores

Vitor Santos, Renan Souza, Maria Vitória e Priscila Barboza.

---

**BBTS:** desenvolvendo competências, construindo futuro.
