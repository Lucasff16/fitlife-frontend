# Fitness App Backend

Backend para aplicativo de treinos e condicionamento físico, desenvolvido com Node.js, Express e TypeScript.

## Tecnologias Utilizadas

- Node.js (v18.20.7+)
- TypeScript
- Express.js
- MongoDB com Mongoose
- Prisma ORM
- JWT para autenticação
- Firebase Admin
- Cors, Helmet e outras ferramentas de segurança

## Estrutura do Projeto

O projeto segue uma arquitetura modular e escalável:

```
/
├── dist/               # Código compilado
├── src/
│   ├── config/         # Configurações
│   ├── controllers/    # Controladores
│   ├── middleware/     # Middlewares
│   ├── models/         # Modelos de dados
│   ├── routes/         # Rotas da API
│   ├── services/       # Serviços
│   ├── utils/          # Utilitários
│   └── server.ts       # Arquivo principal
├── prisma/             # Configuração do Prisma
├── tests/              # Testes
└── package.json        # Dependências
```

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrações do Prisma (se aplicável)
npx prisma migrate dev

# Iniciar em modo de desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Iniciar em modo de produção
npm start
```

## Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em modo de desenvolvimento com hot-reload
- `npm run build` - Compila o TypeScript para JavaScript
- `npm test` - Executa os testes
- `npm run dev-frontend` - Inicia o frontend em modo de desenvolvimento
- `npm run build-frontend` - Compila o frontend para produção

## API Endpoints

- `GET /api/health` - Verificação de saúde da API
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/workouts` - Lista de treinos
- `POST /api/workouts` - Criar novo treino
- `GET /api/exercises` - Lista de exercícios
- `POST /api/exercises` - Criar novo exercício

## Licença

ISC 