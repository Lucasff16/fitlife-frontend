import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workoutService } from '../services';
import { toast } from 'react-toastify';

// Chaves de consulta para o React Query
const QUERY_KEYS = {
  workouts: 'workouts',
  workout: (id) => ['workout', id],
};

/**
 * Hook para buscar todos os treinos com paginação
 * @param {number} page - Número da página
 * @param {number} limit - Limite de itens por página
 */
export const useWorkouts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.workouts, page, limit],
    queryFn: () => workoutService.getWorkouts(page, limit),
    keepPreviousData: true, // Mantém dados anteriores durante a busca de novos dados
    onError: (error) => {
      console.error('Erro ao buscar treinos:', error);
      toast.error('Não foi possível carregar os treinos.');
    },
  });
};

/**
 * Hook para buscar um treino específico por ID
 * @param {string} id - ID do treino
 */
export const useWorkout = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.workout(id),
    queryFn: () => workoutService.getWorkoutById(id),
    enabled: !!id, // Só executa se o ID for fornecido
    onError: (error) => {
      console.error(`Erro ao buscar treino ${id}:`, error);
      toast.error('Não foi possível carregar os detalhes do treino.');
    },
  });
};

/**
 * Hook para criar um novo treino
 */
export const useCreateWorkout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (workoutData) => workoutService.createWorkout(workoutData),
    onSuccess: () => {
      // Invalidar cache para recarregar a lista de treinos
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.workouts] });
      toast.success('Treino criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar treino:', error);
      toast.error('Erro ao criar treino. Por favor, tente novamente.');
    },
  });
};

/**
 * Hook para atualizar um treino existente
 */
export const useUpdateWorkout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => workoutService.updateWorkout(id, data),
    onSuccess: (data, variables) => {
      // Invalidar cache do treino específico e da lista
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workout(variables.id) });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.workouts] });
      toast.success('Treino atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar treino:', error);
      toast.error('Erro ao atualizar treino. Por favor, tente novamente.');
    },
  });
};

/**
 * Hook para excluir um treino
 */
export const useDeleteWorkout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => workoutService.deleteWorkout(id),
    onSuccess: () => {
      // Invalidar cache para recarregar a lista de treinos
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.workouts] });
      toast.success('Treino excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir treino:', error);
      toast.error('Erro ao excluir treino. Por favor, tente novamente.');
    },
  });
};

/**
 * Hook para atualizar o status de um treino
 */
export const useUpdateWorkoutStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }) => workoutService.updateWorkoutStatus(id, status),
    onSuccess: (data, variables) => {
      // Invalidar cache do treino específico e da lista
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workout(variables.id) });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.workouts] });
      
      const statusMessages = {
        in_progress: 'Treino iniciado com sucesso!',
        completed: 'Treino concluído com sucesso!',
        scheduled: 'Treino reagendado com sucesso!'
      };
      
      toast.success(statusMessages[variables.status] || 'Status do treino atualizado!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar status do treino:', error);
      toast.error('Erro ao atualizar status do treino. Por favor, tente novamente.');
    },
  });
}; 