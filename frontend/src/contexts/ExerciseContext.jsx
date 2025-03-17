import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ExerciseContext = createContext();

export const useExercise = () => useContext(ExerciseContext);

export const ExerciseProvider = ({ children }) => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchExercises();
    } else {
      setExercises([]);
      setLoading(false);
    }
  }, [user]);

  const fetchExercises = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de dados para desenvolvimento
      // Em produção, isso seria uma chamada de API real
      setTimeout(() => {
        const mockExercises = [
          {
            id: '1',
            name: 'Supino Reto',
            group: 'Peito',
            description: 'Exercício composto para desenvolvimento do peitoral',
            instructions: 'Deite-se no banco, segure a barra com as mãos um pouco mais afastadas que a largura dos ombros, desça a barra até o peito e empurre de volta para cima.',
            imageUrl: 'https://example.com/supino-reto.jpg',
            videoUrl: 'https://example.com/supino-reto.mp4',
            difficulty: 'Intermediário'
          },
          {
            id: '2',
            name: 'Agachamento',
            group: 'Pernas',
            description: 'Exercício composto para desenvolvimento das pernas',
            instructions: 'Posicione a barra nos ombros, pés na largura dos ombros, desça até que as coxas fiquem paralelas ao chão e suba novamente.',
            imageUrl: 'https://example.com/agachamento.jpg',
            videoUrl: 'https://example.com/agachamento.mp4',
            difficulty: 'Intermediário'
          },
          {
            id: '3',
            name: 'Puxada Alta',
            group: 'Costas',
            description: 'Exercício para desenvolvimento das costas',
            instructions: 'Segure a barra com as mãos afastadas, puxe a barra para baixo até a altura do queixo e controle o movimento de volta.',
            imageUrl: 'https://example.com/puxada-alta.jpg',
            videoUrl: 'https://example.com/puxada-alta.mp4',
            difficulty: 'Iniciante'
          },
          {
            id: '4',
            name: 'Desenvolvimento',
            group: 'Ombros',
            description: 'Exercício para desenvolvimento dos ombros',
            instructions: 'Segure os halteres na altura dos ombros, palmas para frente, empurre os halteres para cima e controle a descida.',
            imageUrl: 'https://example.com/desenvolvimento.jpg',
            videoUrl: 'https://example.com/desenvolvimento.mp4',
            difficulty: 'Intermediário'
          },
          {
            id: '5',
            name: 'Rosca Direta',
            group: 'Bíceps',
            description: 'Exercício para desenvolvimento dos bíceps',
            instructions: 'Segure a barra com as palmas para cima, cotovelos junto ao corpo, dobre os cotovelos e traga a barra até os ombros.',
            imageUrl: 'https://example.com/rosca-direta.jpg',
            videoUrl: 'https://example.com/rosca-direta.mp4',
            difficulty: 'Iniciante'
          },
          {
            id: '6',
            name: 'Tríceps Corda',
            group: 'Tríceps',
            description: 'Exercício para desenvolvimento dos tríceps',
            instructions: 'Segure a corda com as mãos, cotovelos junto ao corpo, estenda os braços para baixo e controle o retorno.',
            imageUrl: 'https://example.com/triceps-corda.jpg',
            videoUrl: 'https://example.com/triceps-corda.mp4',
            difficulty: 'Iniciante'
          }
        ];
        
        setExercises(mockExercises);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Erro ao buscar exercícios:', err);
      setError('Falha ao carregar exercícios. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const addExercise = (newExercise) => {
    const exercise = {
      ...newExercise,
      id: Date.now().toString()
    };
    
    setExercises(prev => [...prev, exercise]);
    return exercise;
  };

  const updateExercise = (updatedExercise) => {
    setExercises(prev => 
      prev.map(exercise => 
        exercise.id === updatedExercise.id ? updatedExercise : exercise
      )
    );
  };

  const deleteExercise = (exerciseId) => {
    setExercises(prev => prev.filter(exercise => exercise.id !== exerciseId));
  };

  const getExercisesByGroup = (group) => {
    return exercises.filter(exercise => exercise.group === group);
  };

  return (
    <ExerciseContext.Provider 
      value={{ 
        exercises, 
        loading, 
        error, 
        addExercise, 
        updateExercise, 
        deleteExercise,
        getExercisesByGroup,
        refreshExercises: fetchExercises
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

export default ExerciseContext; 