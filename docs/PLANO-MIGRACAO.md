# Plano de migração do frontend para React

Plano combinado antes de começar a codar. O relatório final fica em
[RELATORIO-MIGRACAO.md](RELATORIO-MIGRACAO.md).

## O que a leitura do projeto revelou

- **API fora do ar.** `bbts-api.onrender.com` responde `x-render-routing: no-server` e o front em
  `bbts-fod5.onrender.com` responde `suspend-by-user`. O contrato foi lido no código do repositório
  `BBTS-API` e testado contra um servidor falso que reproduz as regras dele.
- **Senha obrigatória no back.** `Usuario.senha` tem `@NotBlank` e `@Size(min = 6)`. O PUT substitui a
  entidade inteira, então também exige senha. A senha fixa sai do front e o bloqueio vai para o relatório.
- **Telefone.** A regex do back é `^\(\d{3}\) \d{5}-\d{4}$|^\d{10,11}$`. A máscara `(00) 00000-0000`
  não passa nela. A tela mantém a máscara e o payload leva só os dígitos, ou `null` se estiver vazio.
- **Campos obrigatórios no back.** `dataNascimento`, além de `dataInicio` em cada experiência.
- **CORS.** O back libera `localhost:3000`, `localhost:5500` e `bbts-fod5.onrender.com`. A porta padrão
  do Vite (5173) ficaria bloqueada, então o dev server roda na 3000.
- **Host de deploy.** O Render, não a Vercel. O fallback de SPA vai em `render.yaml`.
- **Código perdido.** O commit `6946a6b` apagou de `js/TelaCadastro.js` o PDF, as linhas dinâmicas e o
  preview da foto. A referência para o port é a versão `6946a6b~1`.
- **ESLint 9.** `eslint-plugin-jsx-a11y` não aceita ESLint 10. Com a 9.39, `npm install` passa sem flags.

## Etapas

Cada etapa vira um ou mais commits pequenos na branch `refatoracao-react`.

1. Criar a branch e registrar este plano.
2. Mover a versão antiga para `legacy/`, porque o Vite precisa do `index.html` na raiz.
3. Montar a base: Vite, React, React Router, ESLint, Prettier e `VITE_API_URL`.
4. Criar a fundação visual: `tokens.css`, `global.css`, Inter, imagens e favicon.
5. Criar os componentes de `components/ui`.
6. Criar `CompetencyBar`, `DonutChart` e `CompetencyList`.
7. Criar a camada de dados: mocks, `services/api.js` e hooks.
8. Montar a estrutura do app: providers, rotas, `RequireProfile`, layouts e breadcrumb.
9. Fazer as telas públicas: seleção de perfil e login.
10. Fazer as telas do colaborador: dashboard e perfil.
11. Fazer cadastro, edição com PUT e geração de PDF.
12. Fazer as telas do gestor: home, equipe, colaborador e perfil.
13. Configurar o deploy e reescrever o README.
14. Validar os critérios de pronto e escrever o relatório.
