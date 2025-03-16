# FitLife API - Backend

API RESTful para o aplicativo FitLife, uma plataforma de fitness e gerenciamento de treinos.

## Índice

- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Testes](#testes)
- [Documentação da API](#documentação-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Segurança](#segurança)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Requisitos

- Node.js (v18.20.7 ou superior)
- MongoDB (v4.4 ou superior)
- npm (v10.0.0 ou superior)

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/fitlife-backend.git
   cd fitlife-backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Configuração

1. Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:
   ```
   NODE_ENV=development
   PORT=4000
   MONGODB_URI=mongodb+srv://seu-usuario:sua-senha@cluster.mongodb.net/fitlife
   JWT_SECRET=seu_jwt_secret
   JWT_EXPIRE=30d
   REFRESH_TOKEN_SECRET=seu_refresh_token_secret
   REFRESH_TOKEN_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

2. Ajuste as variáveis de ambiente conforme necessário.

## Execução

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

## Testes

O projeto utiliza Jest e Supertest para testes automatizados.

### Executar todos os testes

```bash
npm test
```

### Executar testes específicos

```bash
# Testes de autenticação
npm run test:auth

# Testes de segurança
npm run test:security

# Testes de CRUD (Exercícios e Treinos)
npm run test:crud

# Cobertura de testes
npm run test:coverage
```

## Documentação da API

A documentação completa da API está disponível nos seguintes arquivos:

- [Documentação CRUD (Exercícios e Treinos)](./docs/crud-api.md)
- [Autenticação e Refresh Tokens](./docs/refresh-tokens.md)
- [Segurança](./docs/security.md)

## Estrutura do Projeto

```
backend/
├── config/         # Configurações (banco de dados, etc.)
├── controllers/    # Controladores da API
├── docs/           # Documentação
├── middleware/     # Middlewares (auth, error handling, etc.)
├── models/         # Modelos do Mongoose
├── routes/         # Rotas da API
├── tests/          # Testes automatizados
├── utils/          # Utilitários
├── .env            # Variáveis de ambiente (não versionado)
├── .env.example    # Exemplo de variáveis de ambiente
├── server.js       # Ponto de entrada da aplicação
└── package.json    # Dependências e scripts
```

## Segurança

O projeto implementa diversas medidas de segurança:

- Autenticação JWT com refresh tokens
- Proteção contra CSRF
- Rate limiting
- Helmet para cabeçalhos HTTP seguros
- Validação de entrada
- Sanitização de dados
- Limpeza automática de tokens expirados

Para mais detalhes, consulte a [documentação de segurança](./docs/security.md).

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Implemente suas mudanças e adicione testes
4. Execute os testes (`npm test`)
5. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
6. Push para a branch (`git push origin feature/nova-feature`)
7. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](../LICENSE) para detalhes. 
Este projeto está licenciado sob a licença MIT. 