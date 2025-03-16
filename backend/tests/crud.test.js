// Definir o ambiente como 'test'
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');
const User = require('../models/User');

// Variáveis para armazenar IDs e tokens para os testes
let token;
let userId;
let exerciseId;
let workoutId;

// Função auxiliar para esperar um tempo específico
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('CRUD - Exercícios e Treinos', () => {
  // Configuração antes de todos os testes
  beforeAll(async () => {
    // Registrar um usuário para os testes
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'CRUD Test User',
        email: 'crud-test@example.com',
        password: 'test123'
      });

    // Fazer login para obter o token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'crud-test@example.com',
        password: 'test123'
      });

    token = loginRes.body.token;
    userId = loginRes.body.user._id;
  });

  // Limpar dados após todos os testes
  afterAll(async () => {
    try {
      // Limpar dados de teste
      await Exercise.deleteMany({ createdBy: userId });
      await Workout.deleteMany({ user: userId });
      await User.deleteOne({ _id: userId });
      
      // Fechar conexão com o MongoDB
      await mongoose.connection.close();
    } catch (error) {
      console.error('Erro ao limpar dados de teste:', error);
    }
  });

  // Testes para Exercícios
  describe('Exercícios', () => {
    // Teste para criar um exercício
    it('Deve criar um novo exercício', async () => {
      const res = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Flexão de Braço',
          description: 'Exercício para peitoral, ombros e tríceps',
          type: 'strength',
          muscleGroups: ['chest', 'shoulders', 'triceps'],
          difficulty: 'intermediate',
          equipment: ['none'],
          instructions: ['Posição inicial em prancha', 'Descer o corpo', 'Subir empurrando o chão'],
          duration: 60
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toEqual('Flexão de Braço');
      expect(res.body.createdBy).toEqual(userId);

      // Salvar o ID para usar em outros testes
      exerciseId = res.body._id;
    });

    // Teste para obter todos os exercícios
    it('Deve listar todos os exercícios', async () => {
      const res = await request(app)
        .get('/api/exercises')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('count');
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    // Teste para obter um exercício específico
    it('Deve obter um exercício específico pelo ID', async () => {
      const res = await request(app)
        .get(`/api/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', exerciseId);
      expect(res.body.name).toEqual('Flexão de Braço');
    });

    // Teste para atualizar um exercício
    it('Deve atualizar um exercício existente', async () => {
      const res = await request(app)
        .put(`/api/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Flexão de Braço Modificada',
          description: 'Versão modificada da flexão de braço',
          difficulty: 'advanced'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', exerciseId);
      expect(res.body.name).toEqual('Flexão de Braço Modificada');
      expect(res.body.difficulty).toEqual('advanced');
    });
  });

  // Testes para Treinos
  describe('Treinos', () => {
    // Teste para criar um treino
    it('Deve criar um novo treino', async () => {
      const res = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Treino de Peito e Tríceps',
          description: 'Treino focado em peitoral e tríceps',
          type: 'strength',
          difficulty: 'intermediate',
          duration: 45,
          exercises: [
            {
              exercise: exerciseId,
              sets: 3,
              reps: 12,
              rest: 60,
              order: 1
            }
          ],
          isPublic: true
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toEqual('Treino de Peito e Tríceps');
      expect(res.body.user).toEqual(userId);
      expect(res.body.exercises).toHaveLength(1);
      expect(res.body.exercises[0].exercise._id).toEqual(exerciseId);

      // Salvar o ID para usar em outros testes
      workoutId = res.body._id;
    });

    // Teste para obter todos os treinos
    it('Deve listar todos os treinos do usuário', async () => {
      const res = await request(app)
        .get('/api/workouts')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('count');
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    // Teste para obter treinos públicos
    it('Deve listar treinos públicos', async () => {
      const res = await request(app)
        .get('/api/workouts/public');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('count');
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    // Teste para obter um treino específico
    it('Deve obter um treino específico pelo ID', async () => {
      const res = await request(app)
        .get(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', workoutId);
      expect(res.body.name).toEqual('Treino de Peito e Tríceps');
    });

    // Teste para atualizar um treino
    it('Deve atualizar um treino existente', async () => {
      const res = await request(app)
        .put(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Treino de Peito e Tríceps Atualizado',
          description: 'Versão atualizada do treino',
          duration: 60
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', workoutId);
      expect(res.body.name).toEqual('Treino de Peito e Tríceps Atualizado');
      expect(res.body.duration).toEqual(60);
    });

    // Teste para adicionar um exercício a um treino
    it('Deve adicionar um exercício a um treino existente', async () => {
      // Primeiro, criar um novo exercício para adicionar
      const newExerciseRes = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Tríceps Testa',
          description: 'Exercício para tríceps',
          type: 'strength',
          muscleGroups: ['triceps'],
          difficulty: 'intermediate',
          equipment: ['dumbbells'],
          instructions: ['Deitar na bancada', 'Segurar halteres acima da cabeça', 'Flexionar cotovelos'],
          duration: 45
        });

      const newExerciseId = newExerciseRes.body._id;

      // Obter o treino atual
      const getWorkoutRes = await request(app)
        .get(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`);

      const currentExercises = getWorkoutRes.body.exercises;

      // Adicionar o novo exercício ao treino
      const res = await request(app)
        .put(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          exercises: [
            ...currentExercises,
            {
              exercise: newExerciseId,
              sets: 4,
              reps: 10,
              rest: 45,
              order: 2
            }
          ]
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.exercises).toHaveLength(2);
      expect(res.body.exercises[1].exercise._id).toEqual(newExerciseId);
      expect(res.body.exercises[1].sets).toEqual(4);
    });
  });

  // Testes de exclusão (executados por último)
  describe('Exclusão', () => {
    // Teste para excluir um treino
    it('Deve excluir um treino', async () => {
      const res = await request(app)
        .delete(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);

      // Verificar se o treino foi realmente excluído
      const checkRes = await request(app)
        .get(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(checkRes.statusCode).toEqual(404);
    });

    // Teste para excluir um exercício
    it('Deve excluir um exercício', async () => {
      const res = await request(app)
        .delete(`/api/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);

      // Verificar se o exercício foi realmente excluído
      const checkRes = await request(app)
        .get(`/api/exercises/${exerciseId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(checkRes.statusCode).toEqual(404);
    });
  });
}); 