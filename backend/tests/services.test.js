const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');
const { generateToken } = require('../utils/auth');

let authToken;
let testExerciseId;
let testWorkoutId;

// Configuração antes de todos os testes
beforeAll(async () => {
  // Gerar token de autenticação para testes
  authToken = generateToken({ id: '123456789012345678901234', role: 'user' });
  
  // Limpar coleções de teste
  await Exercise.deleteMany({});
  await Workout.deleteMany({});
});

// Limpeza após todos os testes
afterAll(async () => {
  await Exercise.deleteMany({});
  await Workout.deleteMany({});
  await mongoose.connection.close();
});

describe('API de Exercícios', () => {
  // Teste de criação de exercício
  test('POST /api/exercises - deve criar um novo exercício', async () => {
    const exerciseData = {
      name: 'Supino Teste',
      description: 'Exercício de teste para peito',
      muscleGroup: 'chest',
      difficulty: 'intermediate',
      equipment: 'barbell'
    };

    const response = await request(app)
      .post('/api/exercises')
      .set('Authorization', `Bearer ${authToken}`)
      .send(exerciseData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(exerciseData.name);
    
    // Salvar ID para testes subsequentes
    testExerciseId = response.body._id;
  });

  // Teste de busca de exercícios
  test('GET /api/exercises - deve retornar lista de exercícios', async () => {
    const response = await request(app)
      .get('/api/exercises')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Teste de busca de exercício por ID
  test('GET /api/exercises/:id - deve retornar um exercício específico', async () => {
    const response = await request(app)
      .get(`/api/exercises/${testExerciseId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(testExerciseId);
  });

  // Teste de atualização de exercício
  test('PUT /api/exercises/:id - deve atualizar um exercício', async () => {
    const updateData = {
      name: 'Supino Teste Atualizado',
      description: 'Descrição atualizada'
    };

    const response = await request(app)
      .put(`/api/exercises/${testExerciseId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updateData.name);
    expect(response.body.description).toBe(updateData.description);
  });

  // Teste de filtragem de exercícios por grupo muscular
  test('GET /api/exercises?muscleGroup=chest - deve filtrar exercícios por grupo muscular', async () => {
    const response = await request(app)
      .get('/api/exercises?muscleGroup=chest')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // Verificar se todos os exercícios retornados são do grupo muscular especificado
    response.body.forEach(exercise => {
      expect(exercise.muscleGroup).toBe('chest');
    });
  });
});

describe('API de Treinos', () => {
  // Teste de criação de treino
  test('POST /api/workouts - deve criar um novo treino', async () => {
    const workoutData = {
      name: 'Treino Teste A',
      description: 'Treino de teste para peito e ombros',
      scheduledDate: new Date().toISOString(),
      exercises: [
        {
          exercise: testExerciseId,
          sets: 4,
          reps: 12,
          weight: 60,
          restTime: 90
        }
      ]
    };

    const response = await request(app)
      .post('/api/workouts')
      .set('Authorization', `Bearer ${authToken}`)
      .send(workoutData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(workoutData.name);
    
    // Salvar ID para testes subsequentes
    testWorkoutId = response.body._id;
  });

  // Teste de busca de treinos
  test('GET /api/workouts - deve retornar lista de treinos', async () => {
    const response = await request(app)
      .get('/api/workouts')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Teste de busca de treino por ID
  test('GET /api/workouts/:id - deve retornar um treino específico', async () => {
    const response = await request(app)
      .get(`/api/workouts/${testWorkoutId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(testWorkoutId);
  });

  // Teste de atualização de status de treino
  test('PATCH /api/workouts/:id/status - deve atualizar o status de um treino', async () => {
    const response = await request(app)
      .patch(`/api/workouts/${testWorkoutId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'in_progress' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('in_progress');
  });

  // Teste de paginação de treinos
  test('GET /api/workouts?page=1&limit=5 - deve retornar treinos paginados', async () => {
    const response = await request(app)
      .get('/api/workouts?page=1&limit=5')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeLessThanOrEqual(5);
  });
});

// Testes de validação e erros
describe('Validação e Tratamento de Erros', () => {
  // Teste de validação na criação de exercício
  test('POST /api/exercises - deve validar dados obrigatórios', async () => {
    const invalidData = {
      // Faltando nome e grupo muscular, que são obrigatórios
      description: 'Exercício inválido'
    };

    const response = await request(app)
      .post('/api/exercises')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  // Teste de acesso não autorizado
  test('GET /api/exercises - deve rejeitar acesso sem token', async () => {
    const response = await request(app)
      .get('/api/exercises');

    expect(response.status).toBe(401);
  });

  // Teste de recurso não encontrado
  test('GET /api/exercises/:id - deve retornar 404 para ID inexistente', async () => {
    const fakeId = '123456789012345678901234'; // ID válido mas inexistente
    
    const response = await request(app)
      .get(`/api/exercises/${fakeId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
  });
}); 