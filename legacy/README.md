# BBTS - Sistema de Gestão de Competências

## 📋 Sobre o Projeto

O BBTS (BB Tecnologia e Serviços) é um sistema web de gestão de competências profissionais desenvolvido para facilitar o acompanhamento e desenvolvimento de habilidades de colaboradores e equipes. O sistema oferece funcionalidades diferenciadas para colaboradores e gestores, permitindo visualização de competências, criação de equipes, feedback e jornadas de capacitação.

## ✨ Funcionalidades

### Para Colaboradores
- **Dashboard Personalizado**: Visualização de competências e níveis de proficiência
- **Perfil Completo**: Exibição de formação acadêmica, experiência profissional, idiomas e habilidades
- **Gráficos Interativos**: Acompanhamento visual do progresso em competências
- **Lacunas de Conhecimento**: Identificação de áreas para desenvolvimento
- **Jornada de Capacitação**: Sugestões personalizadas de cursos e treinamentos

### Para Gestores
- **Gestão de Equipes**: Criação e administração de equipes de trabalho
- **Gestão de Membros**: Convite e gerenciamento de colaboradores
- **Visualização de Competências**: Análise das competências mínimas da equipe
- **Sistema de Feedback**: Envio de feedback direto para colaboradores
- **Adicionar Competências**: Cadastro de novas competências para colaboradores
- **Conversas Recentes**: Acesso rápido às comunicações com a equipe

## 🚀 Tecnologias Utilizadas

- **HTML5**: Estruturação semântica das páginas
- **CSS3**: Estilização e design responsivo
  - CSS Grid e Flexbox para layouts
  - Variáveis CSS para tematização
  - Animações e transições
- **JavaScript (ES6+)**: Interatividade e funcionalidades dinâmicas
- **Tailwind CSS**: Framework CSS (utilizado na tela de cadastro)
- **Font Awesome**: Biblioteca de ícones
- **Google Fonts**: Tipografias customizadas (Inter, Calibri, Montserrat, Nunito Sans)

## 🎨 Paleta de Cores

```css
--azul-principal: #3333BD    /* Azul institucional */
--amarelo-principal: #FCFC30 /* Amarelo destaque */
--cinza-claro: #F5F5F5       /* Fundo claro */
--cinza-input: #E0E0E0       /* Campos de entrada */
--branco: #FFFFFF            /* Branco puro */
```

## 🖥️ Páginas do Sistema

### 1. **Inicio.html** - Tela de Login e Cadastro
- Layout dividido (40% login / 60% cadastro)
- Formulários de autenticação e criação de conta

### 2. **TelaCadastro.html** - Cadastro Detalhado
- Formulário completo de dados pessoais
- Seções: Habilidades, Idiomas, Experiência Profissional, Certificações
- Upload de foto de perfil
- Campos dinâmicos (adicionar múltiplos itens)

### 3. **TelaColaborador.html** - Dashboard do Colaborador
- Visão geral de competências com gráfico radial
- Níveis de competências com barras de progresso
- Card de perfil
- Lacunas de conhecimento
- Jornada de capacitação

### 4. **TelaPerfilColaborador.html** - Perfil Completo
- Informações detalhadas do colaborador
- Formação acadêmica e experiência profissional
- Idiomas e habilidades
- Gráfico de competências em formato donut

### 5. **TelaHomeGestor.html** - Home do Gestor
- Visualização de todas as equipes
- Conversas recentes
- Criação de novas equipes
- Convite de membros

### 6. **TelaEquipeGestor.html** - Gestão de Equipe
- Informações da equipe
- Grid de membros
- Competências mínimas esperadas
- Formulários de convite e feedback

### 7. **TelaColaboradorGestor.html** - Gestão de Colaborador
- Perfil do colaborador (visão do gestor)
- Adicionar novas competências
- Enviar feedback personalizado

## 🔧 Instalação e Uso

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, mas recomendado)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/bbts.git
```

2. Navegue até o diretório do projeto:
```bash
cd bbts
```

3. **Opção 1 - Abrir diretamente:**
   - Abra o arquivo `pages/Inicio.html` no navegador

4. **Opção 2 - Usar um servidor local (recomendado):**
   
   Com Python 3:
   ```bash
   python -m http.server 8000
   ```
   
   Com Node.js (usando `http-server`):
   ```bash
   npx http-server -p 8000
   ```
   
   Depois acesse: `http://localhost:8000/pages/Inicio.html`

## 📱 Responsividade

O sistema foi desenvolvido com design responsivo, adaptando-se a diferentes tamanhos de tela:

- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet** (max-width: 1200px): Ajuste de grids e espaçamentos
- **Mobile** (max-width: 600px): Layout otimizado para dispositivos móveis

## 🎭 Funcionalidades JavaScript

### Animações
- Barras de progresso animadas
- Gráficos radiais com animação incremental
- Transições suaves entre estados

### Interatividade
- Formulários com validação
- Campos dinâmicos (adicionar/remover)
- Upload de imagem com preview
- Dropdown de serviços
- Navegação entre páginas

### Simulações
- Sistema de login (simulado)
- Envio de feedback (simulado)
- Convite de membros (simulado)
- Criação de competências (simulado)

## 🔐 Observações de Segurança

⚠️ **IMPORTANTE**: Este é um protótipo educacional/demonstrativo. Para uso em produção, seria necessário:

- Implementar autenticação real (JWT, OAuth, etc.)
- Backend com API REST/GraphQL
- Banco de dados para persistência
- Criptografia de senhas
- Proteção contra XSS e CSRF
- HTTPS obrigatório

## 👥 Autores

- Vitor Santos
- Renan Souza
- Maria Vitória
- Priscila Barboza

---

**BBTS** - Desenvolvendo competências, construindo futuro 🚀
