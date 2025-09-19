# User Hierarchy API

Uma API RESTful construída com NestJS para gerenciamento de hierarquias de usuários e grupos, utilizando o padrão Closure Table para representação de relacionamentos hierárquicos.

## 🏗️ Arquitetura

- **Framework**: NestJS (Node.js)
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: TypeORM
- **Padrão Arquitetural**: Clean Architecture com Use Cases
- **Observabilidade**: OpenTelemetry + Jaeger
- **Logging**: Pino
- **Padrão de Hierarquia**: Closure Table

## 🚀 Como Rodar

#### Clone o repositório

```bash
git clone https://github.com/jheisonnovak/user-hierarchy-api.git
cd user-hierarchy-api
```

### Opção 1: Desenvolvimento com DevContainer (Recomendado)

#### 1. Pré-requisitos

- Docker
- VS Code
- Extensão "Dev Containers" do VS Code

#### 2. Abra o projeto no DevContainer

1. Abra o VS Code na pasta do projeto
2. Execute o comando: `Dev Containers: Reopen in Container`
3. Aguarde o container ser construído e configurado

#### 3. Execute as migrations

```bash
yarn run migration:run
```

#### 4. Inicie a aplicação

```bash
yarn run start:dev
```

**Serviços disponíveis no DevContainer:**

- **API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Jaeger UI**: http://localhost:16686 (observabilidade)

### Opção 2: Desenvolvimento Local

Certifique-se de possuir PostgreSQL e Jaeger rodando na máquina local

#### 1. Instale as dependências

```bash
yarn install
```

#### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=user_hierarchy

# Application
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Observability (opcional)
JAEGER_ENDPOINT=http://localhost:4318/v1/traces
```

#### 3. Configure o banco de dados PostgreSQL

Certifique-se de que o PostgreSQL está rodando e crie o banco de dados:

```sql
CREATE DATABASE user_hierarchy;
```

#### 4. Execute as migrations

```bash
yarn run migration:run
```

#### 5. Inicie a aplicação

```bash
yarn run start:dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📡 Endpoints da API

### Health Check

```http
GET /health
```

### Usuários

```http
# Criar usuário
POST /users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com"
}

# Associar usuário a um grupo
POST /users/:userId/groups
Content-Type: application/json

{
  "groupId": "uuid-do-grupo"
}

# Listar organizações do usuário
GET /users/:userId/organizations
```

### Grupos

```http
# Criar grupo
POST /groups
Content-Type: application/json

{
  "name": "Departamento TI",
  "parentId": "uuid-do-grupo-pai" // opcional
}
```

### Hierarquia

```http
# Buscar ancestrais de um nó
GET /nodes/:nodeId/ancestors

# Buscar descendentes de um nó
GET /nodes/:nodeId/descendants
```

## 🧪 Testes

### Executar testes

```bash
# Testes unitários
yarn run test

# Testes end-to-end
yarn run test:e2e
```

### Estrutura de Testes

- **Unitários**: `*.spec.ts` - Testam use cases e lógica de negócio
- **E2E**: `test/app.e2e-spec.ts` - Testam fluxos completos da API

## 🏛️ Arquitetura do Projeto

```
src/
├── app.module.ts                 # Módulo raiz
├── main.ts                       # Bootstrap da aplicação
├── common/                       # Utilitários compartilhados
│   ├── decorators/              # Decorators customizados
│   ├── filters/                 # Filtros de exceção
│   ├── interceptors/            # Interceptors (logging, tracing)
│   └── logging/                 # Configuração de logs
├── config/                      # Configurações
│   └── database.config.service.ts
├── infrastructure/              # Camada de infraestrutura
│   ├── database/               # Configuração do banco
│   │   ├── migrations/         # Migrations do TypeORM
│   │   └── data-source.ts     # DataSource do TypeORM
│   └── health/                # Health check
├── modules/                    # Módulos de domínio
│   ├── hierarchy/             # Gestão de hierarquias
│   │   ├── controllers/       # Controllers REST
│   │   ├── models/           # Entidades, DTOs, Interfaces
│   │   ├── repositories/     # Implementações de repositório
│   │   └── use-cases/        # Casos de uso (regras de negócio)
│   ├── user/                 # Gestão de usuários
│   └── group/                # Gestão de grupos
└── utils/                     # Utilitários gerais
```

## 📚 Tecnologias Utilizadas

- **NestJS**: Framework Node.js progressivo
- **TypeScript**: Superset tipado do JavaScript
- **TypeORM**: ORM para TypeScript/JavaScript
- **PostgreSQL**: Banco de dados relacional
- **Pino**: Logger de alta performance
- **OpenTelemetry**: Observabilidade e tracing
- **Jest**: Framework de testes
- **ESLint**: Linter para código
- **Prettier**: Formatador de código
- **class-validator**: Validação de dados
- **Docker**: Containerização para desenvolvimento
