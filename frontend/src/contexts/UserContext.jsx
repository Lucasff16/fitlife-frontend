import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    completedWorkouts: 0,
    totalExercises: 0,
    streakDays: 0
  });
  const [weightHistory, setWeightHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchWeightHistory();
    } else {
      setUserData(null);
      setWeightHistory([]);
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Simulação de dados para desenvolvimento
      // Em produção, isso seria uma chamada de API real
      setTimeout(() => {
        const mockUserData = {
          id: user?.id || 1,
          name: user?.name || 'Usuário Teste',
          email: user?.email || 'teste@exemplo.com',
          profileImage: 'https://i.pravatar.cc/150?img=68',
          height: 175,
          weight: 75,
          age: 30,
          gender: 'Masculino',
          fitnessGoal: 'Ganho de massa muscular',
          activityLevel: 'Intermediário',
          joinedDate: '2023-01-15'
        };
        
        const mockStats = {
          totalWorkouts: 45,
          completedWorkouts: 32,
          totalExercises: 156,
          streakDays: 5
        };
        
        setUserData(mockUserData);
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setLoading(false);
    }
  };

  const fetchWeightHistory = async () => {
    try {
      // Simulação de dados para desenvolvimento
      // Em produção, isso seria uma chamada de API real
      setTimeout(() => {
        const mockWeightHistory = [
          {
            date: new Date(2023, 0, 15), // 15/01/2023
            weight: 80,
            height: 175,
            bmi: '26.1'
          },
          {
            date: new Date(2023, 1, 15), // 15/02/2023
            weight: 78,
            height: 175,
            bmi: '25.5'
          },
          {
            date: new Date(2023, 2, 15), // 15/03/2023
            weight: 76,
            height: 175,
            bmi: '24.8'
          },
          {
            date: new Date(2023, 3, 15), // 15/04/2023
            weight: 75,
            height: 175,
            bmi: '24.5'
          }
        ];
        
        setWeightHistory(mockWeightHistory);
      }, 1000);
    } catch (error) {
      console.error('Erro ao buscar histórico de peso:', error);
    }
  };

  const updateUserData = (newData) => {
    setUserData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const updateStats = (newStats) => {
    setStats(prev => ({
      ...prev,
      ...newStats
    }));
  };

  const addWeightRecord = (record) => {
    // Em produção, isso enviaria os dados para a API
    // const response = await api.post(`/users/${user.id}/weight`, record);
    
    // Simulação de adição local
    setWeightHistory(prev => [...prev, record].sort((a, b) => new Date(b.date) - new Date(a.date)));
    
    // Atualizar o peso atual do usuário
    updateUserData({ weight: record.weight, height: record.height });
    
    return record;
  };

  return (
    <UserContext.Provider 
      value={{ 
        userData, 
        stats, 
        weightHistory,
        loading, 
        updateUserData, 
        updateStats,
        addWeightRecord,
        refreshData: fetchUserData,
        refreshWeightHistory: fetchWeightHistory
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext; 