import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    } else {
      setWorkouts([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWorkouts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de dados para desenvolvimento
      // Em produção, isso seria uma chamada de API real
      setTimeout(() => {
        const mockWorkouts = [
          {
            id: '1',
            name: 'Treino A - Peito e Tríceps',
            description: 'Foco em peito e tríceps com exercícios compostos',
            exercises: [
              { id: '1', name: 'Supino Reto', sets: 4, reps: '8-10', weight: 60 },
              { id: '2', name: 'Supino Inclinado', sets: 3, reps: '10-12', weight: 50 },
              { id: '3', name: 'Crucifixo', sets: 3, reps: '12-15', weight: 16 },
              { id: '4', name: 'Tríceps Corda', sets: 4, reps: '10-12', weight: 25 },
              { id: '5', name: 'Tríceps Francês', sets: 3, reps: '10-12', weight: 20 }
            ],
            completed: false,
            scheduledDate: new Date().toISOString().split('T')[0]
          },
          {
            id: '2',
            name: 'Treino B - Costas e Bíceps',
            description: 'Foco em costas e bíceps com exercícios compostos',
            exercises: [
              { id: '6', name: 'Puxada Alta', sets: 4, reps: '8-10', weight: 70 },
              { id: '7', name: 'Remada Curvada', sets: 3, reps: '10-12', weight: 60 },
              { id: '8', name: 'Pulldown', sets: 3, reps: '12-15', weight: 55 },
              { id: '9', name: 'Rosca Direta', sets: 4, reps: '10-12', weight: 30 },
              { id: '10', name: 'Rosca Martelo', sets: 3, reps: '10-12', weight: 16 }
            ],
            completed: true,
            scheduledDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0]
          },
          {
            id: '3',
            name: 'Treino C - Pernas e Ombros',
            description: 'Foco em pernas e ombros com exercícios compostos',
            exercises: [
              { id: '11', name: 'Agachamento', sets: 4, reps: '8-10', weight: 80 },
              { id: '12', name: 'Leg Press', sets: 3, reps: '10-12', weight: 120 },
              { id: '13', name: 'Cadeira Extensora', sets: 3, reps: '12-15', weight: 50 },
              { id: '14', name: 'Desenvolvimento', sets: 4, reps: '10-12', weight: 40 },
              { id: '15', name: 'Elevação Lateral', sets: 3, reps: '10-12', weight: 10 }
            ],
            completed: false,
            scheduledDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
          }
        ];
        
        setWorkouts(mockWorkouts);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Erro ao buscar treinos:', err);
      setError('Falha ao carregar treinos. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const addWorkout = (newWorkout) => {
    const workout = {
      ...newWorkout,
      id: Date.now().toString(),
      completed: false
    };
    
    setWorkouts(prev => [...prev, workout]);
    return workout;
  };

  const updateWorkout = (updatedWorkout) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      )
    );
  };

  const deleteWorkout = (workoutId) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
  };

  const toggleWorkoutCompletion = (workoutId) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === workoutId 
          ? { ...workout, completed: !workout.completed } 
          : workout
      )
    );
  };

  return (
    <WorkoutContext.Provider 
      value={{ 
        workouts, 
        loading, 
        error, 
        addWorkout, 
        updateWorkout, 
        deleteWorkout, 
        toggleWorkoutCompletion,
        refreshWorkouts: fetchWorkouts
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext; 