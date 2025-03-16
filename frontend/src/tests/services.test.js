import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { exerciseService, workoutService } from '../services';

// Mock do axios
vi.mock('axios');

describe('API Services', () => {
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restaura todos os mocks após cada teste
    vi.restoreAllMocks();
  });

  describe('Exercise Service', () => {
    it('deve buscar exercícios com sucesso', async () => {
      // Mock da resposta do axios
      const mockExercises = [
        { _id: '1', name: 'Supino Reto', muscleGroup: 'chest' },
        { _id: '2', name: 'Agachamento', muscleGroup: 'legs' }
      ];
      
      axios.get.mockResolvedValueOnce({ data: mockExercises });
      
      // Executa o serviço
      const result = await exerciseService.getExercises();
      
      // Verifica se o axios foi chamado corretamente
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('/exercises', { params: {} });
      
      // Verifica se o resultado é o esperado
      expect(result).toEqual(mockExercises);
    });

    it('deve buscar exercícios com filtros', async () => {
      // Mock da resposta do axios
      const mockExercises = [
        { _id: '1', name: 'Supino Reto', muscleGroup: 'chest' }
      ];
      
      axios.get.mockResolvedValueOnce({ data: mockExercises });
      
      // Executa o serviço com filtros
      const params = { muscleGroup: 'chest' };
      const result = await exerciseService.getExercises(params);
      
      // Verifica se o axios foi chamado corretamente
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('/exercises', { params });
      
      // Verifica se o resultado é o esperado
      expect(result).toEqual(mockExercises);
    });

    it('deve criar um exercício com sucesso', async () => {
      // Mock da resposta do axios
      const mockExercise = { _id: '1', name: 'Novo Exercício', muscleGroup: 'chest' };
      const exerciseData = { name: 'Novo Exercício', muscleGroup: 'chest' };
      
      axios.post.mockResolvedValueOnce({ data: mockExercise });
      
      // Executa o serviço
      const result = await exerciseService.createExercise(exerciseData);
      
      // Verifica se o axios foi chamado corretamente
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('/exercises', exerciseData);
      
      // Verifica se o resultado é o esperado
      expect(result).toEqual(mockExercise);
    });

    it('deve lidar com erros ao buscar exercícios', async () => {
      // Mock de erro do axios
      const errorMessage = 'Erro ao buscar exercícios';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      // Executa o serviço e espera que lance um erro
      await expect(exerciseService.getExercises()).rejects.toThrow(errorMessage);
      
      // Verifica se o axios foi chamado corretamente
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('Workout Service', () => {
    it('deve buscar treinos com sucesso', async () => {
      // Mock da resposta do axios
      const mockWorkouts = [
        { _id: '1', name: 'Treino A', status: 'scheduled' },
        { _id: '2', name: 'Treino B', status: 'completed' }
      ];
      
      axios.get.mockResolvedValueOnce({ data: mockWorkouts });
      
      // Executa o serviço
      const result = await workoutService.getWorkouts();
      
      // Verifica se o axios foi chamado corretamente
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('/workouts?page=1&limit=10');
      
      // Verifica se o resultado é o esperado
      expect(result).toEqual(mockWorkouts);
    });

    it('deve atualizar o status de um treino com sucesso', async () => {
      // Mock da resposta do axios
      const mockWorkout = { _id: '1', name: 'Treino A', status: 'in_progress' };
      
      axios.patch.mockResolvedValueOnce({ data: mockWorkout });
      
      // Executa o serviço
      const result = await workoutService.updateWorkoutStatus('1', 'in_progress');
      
      // Verifica se o axios foi chamado corretamente
      expect(axios.patch).toHaveBeenCalledTimes(1);
      expect(axios.patch).toHaveBeenCalledWith('/workouts/1/status', { status: 'in_progress' });
      
      // Verifica se o resultado é o esperado
      expect(result).toEqual(mockWorkout);
    });

    it('deve lidar com erros ao atualizar um treino', async () => {
      // Mock de erro do axios
      const errorMessage = 'Erro ao atualizar treino';
      axios.put.mockRejectedValueOnce(new Error(errorMessage));
      
      const workoutData = { name: 'Treino Atualizado' };
      
      // Executa o serviço e espera que lance um erro
      await expect(workoutService.updateWorkout('1', workoutData)).rejects.toThrow(errorMessage);
      
      // Verifica se o axios foi chamado corretamente
      expect(axios.put).toHaveBeenCalledTimes(1);
    });
  });
}); 