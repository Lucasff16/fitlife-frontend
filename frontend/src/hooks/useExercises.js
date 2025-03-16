import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exerciseService } from '../services';
import { toast } from 'react-toastify';

// Chaves de consulta para o React Query
const QUERY_KEYS = {
  exercises: 'exercises',
  exercise: (id) => ['exercise', id],
};

/**
 * Hook para buscar todos os exercícios com filtros opcionais
 * @param {Object} params - Parâmetros de filtro (muscleGroup, search, etc.)
 */
export const useExercises = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.exercises, params],
    queryFn: () => exerciseService.getExercises(params),
    onError: (error) => {
      console.error('Erro ao buscar exercícios:', error);
      toast.error('Não foi possível carregar os exercícios.');
    },
  });
};

/**
 * Hook para buscar um exercício específico por ID
 * @param {string} id - ID do exercício
 */
export const useExercise = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.exercise(id),
    queryFn: () => exerciseService.getExerciseById(id),
    enabled: !!id, // Só executa se o ID for fornecido
    onError: (error) => {
      console.error(`Erro ao buscar exercício ${id}:`, error);
      toast.error('Não foi possível carregar os detalhes do exercício.');
    },
  });
};

/**
 * Hook para criar um novo exercício
 */
export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (exerciseData) => exerciseService.createExercise(exerciseData),
    onSuccess: () => {
      // Invalidar cache para recarregar a lista de exercícios
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.exercises] });
      toast.success('Exercício criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar exercício:', error);
      toast.error('Erro ao criar exercício. Por favor, tente novamente.');
    },
  });
};

/**
 * Hook para atualizar um exercício existente
 */
export const useUpdateExercise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => exerciseService.updateExercise(id, data),
    onSuccess: (data, variables) => {
      // Invalidar cache do exercício específico e da lista
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercise(variables.id) });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.exercises] });
      toast.success('Exercício atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar exercício:', error);
      toast.error('Erro ao atualizar exercício. Por favor, tente novamente.');
    },
  });
};

/**
 * Hook para excluir um exercício
 */
export const useDeleteExercise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => exerciseService.deleteExercise(id),
    onSuccess: () => {
      // Invalidar cache para recarregar a lista de exercícios
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.exercises] });
      toast.success('Exercício excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir exercício:', error);
      toast.error('Erro ao excluir exercício. Por favor, tente novamente.');
    },
  });
}; 