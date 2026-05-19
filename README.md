# 📚 Lesson Plan Manager — Sistema de Gerenciamento de Planos de Aula

Sistema completo para gerenciamento de planos de aula com assistência de Inteligência Artificial para recomendação de conteúdos pedagógicos.

## 🏗️ Arquitetura

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15, TypeScript, TailwindCSS, React Hook Form, Zod |
| Backend | Node.js, Fastify, Prisma ORM, Zod, Winston |
| Banco de Dados | PostgreSQL 16 |
| IA | API de LLM (configurável via variáveis de ambiente) |
| Infra | Docker, Docker Compose, GitHub Actions |

## 🚀 Início Rápido

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local)
- Chave de API de um serviço de LLM (OpenAI, Anthropic, etc.)

### Subindo com Docker (recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/lesson-plan-manager.git
cd lesson-plan-manager

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env e adicione sua chave de API

# 3. Suba tudo com um único comando
docker compose up --build
```

O frontend estará disponível em `http://localhost:3000` e a API em `http://localhost:3333`.

### Desenvolvimento Local

```bash
# Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

## 📁 Estrutura do Projeto

```
lesson-plan-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Handlers das rotas
│   │   ├── routes/         # Definição de rotas Fastify
│   │   ├── services/       # Lógica de negócio e integração IA
│   │   ├── middlewares/     # Error handler, logging
│   │   ├── validators/     # Schemas Zod de validação
│   │   ├── config/         # Configurações (env, logger)
│   │   └── utils/          # Helpers
│   ├── prisma/
│   │   └── schema.prisma   # Modelo de dados
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/            # App Router (Next.js)
│   │   ├── components/     # Componentes React
│   │   ├── lib/            # API client, utils
│   │   └── types/          # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── .github/workflows/ci.yml
```

## 📋 Funcionalidades

### CRUD de Planos de Aula
- Listagem paginada com filtros por Disciplina, Tags e Data
- Busca por título
- Ordenação por título ou data de cadastro
- Cadastro, edição e exclusão

### Smart Assist (IA)
- Botão "Gerar Recomendações com IA" no formulário
- Envia título, disciplina e ementa para o backend
- Retorna sugestões de conteúdos, tópicos e 3 tags
- Preenchimento automático dos campos

### DevOps & Observabilidade
- Health Check em `/health`
- Logs estruturados (Winston) com detalhes de latência e tokens
- CI com ESLint + Prettier via GitHub Actions
- Docker Compose para execução em um único comando

## 🔐 Segurança

- Chaves de API configuradas exclusivamente via variáveis de ambiente
- `.env` incluído no `.gitignore`
- Helmet para headers de segurança
- Validação de entrada em todas as rotas (Zod)
- CORS configurado

## 📄 Licença

MIT
