import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState({
    workoutsCompleted: 0,
    totalExercises: 0,
    streakDays: 0,
    weightProgress: [],
    exerciseProgress: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgressData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      // Simulação de dados para desenvolvimento
      // Em produção, isso seria uma chamada de API real
      setTimeout(() => {
        const mockData = {
          workoutsCompleted: 24,
          totalExercises: 156,
          streakDays: 5,
          weightProgress: [
            { date: '2023-01-01', weight: 80 },
            { date: '2023-01-15', weight: 79 },
            { date: '2023-02-01', weight: 78 },
            { date: '2023-02-15', weight: 77 },
            { date: '2023-03-01', weight: 76 }
          ],
          exerciseProgress: {
            'Supino': [
              { date: '2023-01-01', weight: 60, reps: 8 },
              { date: '2023-01-15', weight: 65, reps: 8 },
              { date: '2023-02-01', weight: 70, reps: 8 }
            ],
            'Agachamento': [
              { date: '2023-01-01', weight: 80, reps: 8 },
              { date: '2023-01-15', weight: 85, reps: 8 },
              { date: '2023-02-01', weight: 90, reps: 8 }
            ]
          }
        };
        setProgressData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao buscar dados de progresso:', error);
      setLoading(false);
    }
  };

  const updateWeight = (date, weight) => {
    setProgressData(prev => ({
      ...prev,
      weightProgress: [
        ...prev.weightProgress.filter(entry => entry.date !== date),
        { date, weight }
      ].sort((a, b) => new Date(a.date) - new Date(b.date))
    }));
  };

  const updateExerciseProgress = (exercise, date, weight, reps) => {
    setProgressData(prev => {
      const exerciseData = prev.exerciseProgress[exercise] || [];
      return {
        ...prev,
        exerciseProgress: {
          ...prev.exerciseProgress,
          [exercise]: [
            ...exerciseData.filter(entry => entry.date !== date),
            { date, weight, reps }
          ].sort((a, b) => new Date(a.date) - new Date(b.date))
        }
      };
    });
  };

  const incrementWorkoutsCompleted = () => {
    setProgressData(prev => ({
      ...prev,
      workoutsCompleted: prev.workoutsCompleted + 1
    }));
  };

  return (
    <ProgressContext.Provider 
      value={{ 
        ...progressData, 
        loading, 
        updateWeight, 
        updateExerciseProgress, 
        incrementWorkoutsCompleted,
        refreshData: fetchProgressData
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext; 