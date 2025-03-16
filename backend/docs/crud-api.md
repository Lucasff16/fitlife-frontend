# Documentação da API CRUD - FitLife

Esta documentação descreve as rotas de API para operações CRUD (Create, Read, Update, Delete) relacionadas a Exercícios e Treinos no sistema FitLife.

## Índice

- [Autenticação](#autenticação)
- [Exercícios](#exercícios)
  - [Criar Exercício](#criar-exercício)
  - [Listar Exercícios](#listar-exercícios)
  - [Obter Exercício](#obter-exercício)
  - [Atualizar Exercício](#atualizar-exercício)
  - [Excluir Exercício](#excluir-exercício)
- [Treinos](#treinos)
  - [Criar Treino](#criar-treino)
  - [Listar Treinos](#listar-treinos)
  - [Listar Treinos Públicos](#listar-treinos-públicos)
  - [Obter Treino](#obter-treino)
  - [Atualizar Treino](#atualizar-treino)
  - [Excluir Treino](#excluir-treino)

## Autenticação

Todas as rotas (exceto as explicitamente marcadas como públicas) requerem autenticação. Para autenticar, inclua o token JWT no cabeçalho da requisição:

```
Authorization: Bearer <seu_token_jwt>
```

O token JWT é obtido através do endpoint de login (`POST /api/auth/login`).

## Exercícios

### Criar Exercício

Cria um novo exercício no sistema.

- **URL**: `/api/exercises`
- **Método**: `POST`
- **Autenticação**: Requerida
- **Corpo da Requisição**:

```json
{
  "name": "Flexão de Braço",
  "description": "Exercício para peitoral, ombros e tríceps",
  "type": "strength",
  "muscleGroups": ["chest", "shoulders", "triceps"],
  "difficulty": "intermediate",
  "equipment": ["none"],
  "instructions": ["Posição inicial em prancha", "Descer o corpo", "Subir empurrando o chão"],
  "tips": ["Mantenha o core contraído", "Não deixe o quadril cair"],
  "duration": 60,
  "estimatedCaloriesBurn": 8
}
```

- **Resposta de Sucesso**:
  - **Código**: 201 Created
  - **Conteúdo**:

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "Flexão de Braço",
  "description": "Exercício para peitoral, ombros e tríceps",
  "type": "strength",
  "muscleGroups": ["chest", "shoulders", "triceps"],
  "difficulty": "intermediate",
  "equipment": ["none"],
  "instructions": ["Posição inicial em prancha", "Descer o corpo", "Subir empurrando o chão"],
  "tips": ["Mantenha o core contraído", "Não deixe o quadril cair"],
  "duration": 60,
  "estimatedCaloriesBurn": 8,
  "isCustom": false,
  "createdBy": "60d21b4667d0d8992e610c80",
  "createdAt": "2023-03-15T12:00:00.000Z",
  "updatedAt": "2023-03-15T12:00:00.000Z"
}
```

### Listar Exercícios

Retorna uma lista paginada de exercícios.

- **URL**: `/api/exercises`
- **Método**: `GET`
- **Autenticação**: Opcional
- **Parâmetros de Query**:
  - `page`: Número da página (padrão: 1)
  - `limit`: Número de itens por página (padrão: 10)
  - `sort`: Campo para ordenação (ex: `name`, `-createdAt` para ordem decrescente)
  - `search`: Termo de busca para filtrar exercícios
  - `type`: Filtrar por tipo de exercício
  - `difficulty`: Filtrar por nível de dificuldade
  - `muscleGroups`: Filtrar por grupos musculares (separados por vírgula)

- **Resposta de Sucesso**:
  - **Código**: 200 OK
  - **Conteúdo**:

```json
{
  "success": true,
  "count": 1,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "totalResults": 1
  },
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Flexão de Braço",
      "description": "Exercício para peitoral, ombros e tríceps",
      "type": "strength",
      "muscleGroups": ["chest", "shoulders", "triceps"],
      "difficulty": "intermediate",
      "equipment": ["none"],
      "duration": 60
    }
  ]
}
```

### Obter Exercício

Retorna os detalhes de um exercício específico.

- **URL**: `/api/exercises/:id`
- **Método**: `GET`
- **Autenticação**: Opcional
- **Parâmetros de URL**:
  - `id`: ID do exercício

- **Resposta de Sucesso**:
  - **Código**: 200 OK
  - **Conteúdo**:

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "Flexão de Braço",
  "description": "Exercício para peitoral, ombros e tríceps",
  "type": "strength",
  "muscleGroups": ["chest", "shoulders", "triceps"],
  "difficulty": "intermediate",
  "equipment": ["none"],
  "instructions": ["Posição inicial em prancha", "Descer o corpo", "Subir empurrando o chão"],
  "tips": ["Mantenha o core contraído", "Não deixe o quadril cair"],
  "duration": 60,
  "estimatedCaloriesBurn": 8,
  "isCustom": false,
  "createdBy": "60d21b4667d0d8992e610c80",
  "createdAt": "2023-03-15T12:00:00.000Z",
  "updatedAt": "2023-03-15T12:00:00.000Z"
}
```

### Atualizar Exercício

Atualiza um exercício existente.

- **URL**: `/api/exercises/:id`
- **Método**: `PUT`
- **Autenticação**: Requerida
- **Parâmetros de URL**:
  - `id`: ID do exercício
- **Corpo da Requisição**: Campos a serem atualizados

```json
{
  "name": "Flexão de Braço Modificada",
  "description": "Versão modificada da flexão de braço",
  "difficulty": "advanced"
}
```

- **Resposta de Sucesso**:
  - **Código**: 200 OK
  - **Conteúdo**: Objeto do exercício atualizado

### Excluir Exercício

Remove um exercício do sistema.

- **URL**: `/api/exercises/:id`
- **Método**: `DELETE`
- **Autenticação**: Requerida
- **Parâmetros de URL**:
  - `id`: ID do exercício

- **Resposta de Sucesso**:
  - **Código**: 200 OK
  - **Conteúdo**:

```json
{
  "success": true,
  "data": {}
}
```

## Treinos

### Criar Treino

Cria um novo treino no sistema.

- **URL**: `/api/workouts`
- **Método**: `POST`
- **Autenticação**: Requerida
- **Corpo da Requisição**:

```json
{
  "name": "Treino de Peito e Tríceps",
  "description": "Treino focado em peitoral e tríceps",
  "type": "strength",
  "difficulty": "intermediate",
  "duration": 45,
  "exercises": [
    {
      "exercise": "60d21b4667d0d8992e610c85",
      "sets": 3,
      "reps": 12,
      "rest": 60,
      "order": 1
    }
  ],
  "schedule": {
    "days": ["monday", "thursday"],
    "time": "18:00"
  },
  "tags": ["peito", "tríceps", "força"],
  "isPublic": true
}
```

- **Resposta de Sucesso**:
  - **Código**: 201 Created
  - **Conteúdo**: Objeto do treino criado

### Listar Treinos

Retorna uma lista paginada de treinos do usuário autenticado.

- **URL**: `/api/workouts`
- **Método**: `GET`
- **Autenticação**: Requerida
- **Parâmetros de Query**:
  - `page`: Número da página (padrão: 1)
  - `limit`: Número de itens por página (padrão: 10)
  - `sort`: Campo para ordenação (ex: `name`, `-createdAt` para ordem decrescente)
  - `search`: Termo de busca para filtrar treinos
  - `type`: Filtrar por tipo de treino
  - `difficulty`: Filtrar por nível de dificuldade

- **Resposta de Sucesso**:
  - **Código**: 200 OK
  - **Conteúdo**: Lista paginada de treinos

### Listar Treinos Públicos

Retorna uma lista paginada de treinos públicos.

- **URL**: `/api/workouts/public`
- **Método**: `GET`
- **Autenticação**: Opcional
- **Parâmetros de Query**: Mesmos parâmetros de "Listar Treinos"

- **Resposta de Sucesso**:
  - **Código**: 200 OK
  - **Conteúdo**: Lista paginada de treinos públicos

### Obter Treino

Retorna os detalhes de um treino específico.

- **URL**: `/api/workouts/:id`
- **Método**: `GET`
- **Autenticação**: Requerida para treinos privados, opcional para públicos
- **Parâmetros de URL**:
  - `id`: ID do treino

- **Resposta de Sucesso**:
  - **Código**: 200 OK
  - **Conteúdo**: Objeto do treino com detalhes completos

### Atualizar Treino

Atualiza um treino existente.

- **URL**: `/api/workouts/:id`
- **Método**: `PUT`
- **Autenticação**: Requerida
- **Parâmetros de URL**:
  - `id`: ID do treino
- **Corpo da Requisição**: Campos a serem atualizados

```json
{
  "name": "Treino de Peito e Tríceps Atualizado",
  "description": "Versão atualizada do treino",
  "duration": 60
}
```

- **Resposta de Sucesso**:
  - **Código**: 200 OK
  - **Conteúdo**: Objeto do treino atualizado

### Excluir Treino

Remove um treino do sistema.

- **URL**: `/api/workouts/:id`
- **Método**: `DELETE`
- **Autenticação**: Requerida
- **Parâmetros de URL**:
  - `id`: ID do treino

- **Resposta de Sucesso**:
  - **Código**: 200 OK
  - **Conteúdo**:

```json
{
  "success": true,
  "data": {}
}
```

## Códigos de Erro

- **400 Bad Request**: Requisição inválida ou dados ausentes
- **401 Unauthorized**: Autenticação necessária ou token inválido
- **403 Forbidden**: Sem permissão para acessar o recurso
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor 