# Projeto Fitness

Aplicativo de fitness com timeline de peso e IMC, gerenciamento de exercícios e chat com IA para dicas de saúde.

## Funcionalidades

- **Registro e login de usuários**: Sistema completo de autenticação com JWT
- **Dashboard com estatísticas**: Visualização de progresso e métricas de fitness
- **Biblioteca de exercícios**: Catálogo completo de exercícios com instruções
- **Chat com IA para dicas de fitness**: Assistente virtual para orientações sobre treinos e dietas
- **Timeline de peso e IMC**: Acompanhamento visual da evolução física
- **Gerenciamento de perfil de usuário**: Configurações e personalização da conta

## Tecnologias

### Backend
- Node.js (v18.20.7 recomendado)
- Express
- MongoDB
- JWT para autenticação
- Bcrypt para criptografia de senhas
- Mongoose para modelagem de dados

### Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion
- Axios para requisições HTTP
- React Router para navegação

## Instalação

### Pré-requisitos
- Node.js (v18.20.7 ou superior)
- npm
- MongoDB (local ou Atlas)

### Configuração do Backend
```bash
# Navegar até o diretório do backend
cd backend

# Instalar dependências
npm install

# Criar arquivo .env (se não existir)
# Exemplo de conteúdo:
# NODE_ENV=development
# PORT=4000
# MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/fitness?retryWrites=true&w=majority
# JWT_SECRET=seu_segredo_jwt
# JWT_EXPIRE=30d

# Iniciar o servidor
npm run dev
```

### Configuração do Frontend
```bash
# Navegar até o diretório do frontend
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env (se não existir)
# Exemplo de conteúdo:
# VITE_USE_REAL_API=true
# VITE_API_URL=http://localhost:4000/api
# VITE_NODE_ENV=development
# VITE_PORT=5174

# Iniciar o servidor
npm run dev
```

## Scripts Utilitários (Windows)

O projeto inclui scripts PowerShell para facilitar o gerenciamento:

- **start.bat**: Inicia os servidores backend e frontend
- **stop.bat**: Para todos os servidores em execução
- **check.bat**: Verifica o status dos servidores
- **diagnose.bat**: Diagnostica e corrige problemas comuns
- **open.bat**: Abre o aplicativo no navegador

## API Endpoints

### Autenticação
- `POST /api/auth/register`: Registra um novo usuário
- `POST /api/auth/login`: Autentica um usuário
- `GET /api/auth/me`: Obtém dados do usuário atual

### Usuários
- `GET /api/users`: Lista todos os usuários (admin)
- `GET /api/users/:id`: Obtém um usuário específico
- `PUT /api/users/:id`: Atualiza um usuário
- `DELETE /api/users/:id`: Remove um usuário

### Exercícios
- `GET /api/exercises`: Lista todos os exercícios
- `GET /api/exercises/:id`: Obtém um exercício específico
- `POST /api/exercises`: Cria um novo exercício
- `PUT /api/exercises/:id`: Atualiza um exercício
- `DELETE /api/exercises/:id`: Remove um exercício

### Treinos
- `GET /api/workouts`: Lista todos os treinos do usuário
- `GET /api/workouts/:id`: Obtém um treino específico
- `POST /api/workouts`: Cria um novo treino
- `PUT /api/workouts/:id`: Atualiza um treino
- `DELETE /api/workouts/:id`: Remove um treino

### Progresso
- `GET /api/progress`: Obtém o histórico de progresso do usuário
- `POST /api/progress`: Adiciona um novo registro de progresso
- `PUT /api/progress/:id`: Atualiza um registro de progresso
- `DELETE /api/progress/:id`: Remove um registro de progresso

## Estrutura do Projeto

O projeto está organizado em duas partes principais:

- `backend/`: API RESTful com Node.js e Express
  - `config/`: Configurações da aplicação
  - `controllers/`: Controladores para cada recurso
  - `middleware/`: Middlewares para autenticação e validação
  - `models/`: Modelos de dados Mongoose
  - `routes/`: Rotas da API
  - `utils/`: Funções utilitárias

- `frontend/`: Interface de usuário com React e Vite
  - `src/components/`: Componentes reutilizáveis
  - `src/pages/`: Páginas da aplicação
  - `src/contexts/`: Contextos React para gerenciamento de estado
  - `src/hooks/`: Hooks personalizados
  - `src/services/`: Serviços para comunicação com a API
  - `src/utils/`: Funções utilitárias

## Solução de Problemas

### Servidor não inicia
- Verifique se as portas 4000 (backend) e 5174 (frontend) estão disponíveis
- Execute o script `diagnose.bat` para identificar e corrigir problemas

### Erro de conexão com o MongoDB
- Verifique se a string de conexão no arquivo `.env` do backend está correta
- Certifique-se de que o MongoDB está em execução (se local) ou acessível (se Atlas)

### Frontend não conecta ao backend
- Verifique se o backend está em execução
- Confirme se a variável `VITE_API_URL` no arquivo `.env` do frontend está correta

## Contribuição

Contribuições são bem-vindas! Por favor, sinta-se à vontade para enviar um Pull Request.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes. 