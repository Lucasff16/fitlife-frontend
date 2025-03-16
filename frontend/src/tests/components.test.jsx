import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { exerciseService, workoutService } from '../services';
import Exercises from '../pages/Exercises';
import Workouts from '../pages/Workouts';

// Mock dos serviços
vi.mock('../services', () => ({
  exerciseService: {
    getExercises: vi.fn(),
    getExerciseById: vi.fn(),
    createExercise: vi.fn(),
    updateExercise: vi.fn(),
    deleteExercise: vi.fn()
  },
  workoutService: {
    getWorkouts: vi.fn(),
    getWorkoutById: vi.fn(),
    createWorkout: vi.fn(),
    updateWorkout: vi.fn(),
    deleteWorkout: vi.fn(),
    updateWorkoutStatus: vi.fn()
  }
}));

// Mock do react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('Componentes da Aplicação', () => {
  describe('Componente Exercises', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('deve renderizar a lista de exercícios', async () => {
      // Mock da resposta do serviço
      const mockExercises = [
        {
          _id: '1',
          name: 'Supino Reto',
          muscleGroup: 'chest',
          description: 'Exercício para peito',
          difficulty: 'intermediate',
          equipment: 'barbell'
        },
        {
          _id: '2',
          name: 'Agachamento',
          muscleGroup: 'legs',
          description: 'Exercício para pernas',
          difficulty: 'intermediate',
          equipment: 'barbell'
        }
      ];

      exerciseService.getExercises.mockResolvedValueOnce(mockExercises);

      // Renderiza o componente
      render(
        <BrowserRouter>
          <Exercises />
        </BrowserRouter>
      );

      // Verifica se o estado de loading é exibido inicialmente
      expect(screen.getByText(/carregando/i)).toBeInTheDocument();

      // Espera o carregamento terminar
      await waitFor(() => {
        expect(exerciseService.getExercises).toHaveBeenCalledTimes(1);
      });

      // Verifica se os exercícios são exibidos
      await waitFor(() => {
        expect(screen.getByText('Supino Reto')).toBeInTheDocument();
        expect(screen.getByText('Agachamento')).toBeInTheDocument();
      });
    });

    it('deve exibir mensagem quando não há exercícios', async () => {
      // Mock da resposta vazia do serviço
      exerciseService.getExercises.mockResolvedValueOnce([]);

      // Renderiza o componente
      render(
        <BrowserRouter>
          <Exercises />
        </BrowserRouter>
      );

      // Espera o carregamento terminar
      await waitFor(() => {
        expect(exerciseService.getExercises).toHaveBeenCalledTimes(1);
      });

      // Verifica se a mensagem de "nenhum exercício encontrado" é exibida
      await waitFor(() => {
        expect(screen.getByText(/nenhum exercício encontrado/i)).toBeInTheDocument();
      });
    });
  });

  describe('Componente Workouts', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('deve renderizar a lista de treinos', async () => {
      // Mock das respostas dos serviços
      const mockExercises = [
        { _id: '1', name: 'Supino Reto' },
        { _id: '2', name: 'Agachamento' }
      ];

      const mockWorkouts = [
        {
          _id: '1',
          name: 'Treino A',
          description: 'Treino de peito',
          scheduledDate: '2023-07-10T10:00:00',
          status: 'scheduled',
          exercises: [
            { exercise: '1', sets: 4, reps: 12, weight: 60, restTime: 90 }
          ]
        },
        {
          _id: '2',
          name: 'Treino B',
          description: 'Treino de pernas',
          scheduledDate: '2023-07-12T10:00:00',
          status: 'completed',
          exercises: [
            { exercise: '2', sets: 4, reps: 10, weight: 80, restTime: 120 }
          ]
        }
      ];

      exerciseService.getExercises.mockResolvedValueOnce(mockExercises);
      workoutService.getWorkouts.mockResolvedValueOnce(mockWorkouts);

      // Renderiza o componente
      render(
        <BrowserRouter>
          <Workouts />
        </BrowserRouter>
      );

      // Verifica se o estado de loading é exibido inicialmente
      expect(screen.getByText(/carregando/i)).toBeInTheDocument();

      // Espera o carregamento terminar
      await waitFor(() => {
        expect(exerciseService.getExercises).toHaveBeenCalledTimes(1);
        expect(workoutService.getWorkouts).toHaveBeenCalledTimes(1);
      });

      // Verifica se os treinos são exibidos
      await waitFor(() => {
        expect(screen.getByText('Treino A')).toBeInTheDocument();
        expect(screen.getByText('Treino B')).toBeInTheDocument();
      });
    });

    it('deve filtrar treinos por status', async () => {
      // Mock das respostas dos serviços
      const mockExercises = [
        { _id: '1', name: 'Supino Reto' },
        { _id: '2', name: 'Agachamento' }
      ];

      const mockWorkouts = [
        {
          _id: '1',
          name: 'Treino A',
          description: 'Treino de peito',
          scheduledDate: '2023-07-10T10:00:00',
          status: 'scheduled',
          exercises: [
            { exercise: '1', sets: 4, reps: 12, weight: 60, restTime: 90 }
          ]
        },
        {
          _id: '2',
          name: 'Treino B',
          description: 'Treino de pernas',
          scheduledDate: '2023-07-12T10:00:00',
          status: 'completed',
          exercises: [
            { exercise: '2', sets: 4, reps: 10, weight: 80, restTime: 120 }
          ]
        }
      ];

      exerciseService.getExercises.mockResolvedValueOnce(mockExercises);
      workoutService.getWorkouts.mockResolvedValueOnce(mockWorkouts);

      // Renderiza o componente
      render(
        <BrowserRouter>
          <Workouts />
        </BrowserRouter>
      );

      // Espera o carregamento terminar
      await waitFor(() => {
        expect(screen.getByText('Treino A')).toBeInTheDocument();
        expect(screen.getByText('Treino B')).toBeInTheDocument();
      });

      // Clica na aba "Agendados"
      fireEvent.click(screen.getByText('Agendados'));

      // Verifica se apenas o treino agendado é exibido
      expect(screen.getByText('Treino A')).toBeInTheDocument();
      expect(screen.queryByText('Treino B')).not.toBeInTheDocument();
    });
  });
}); 