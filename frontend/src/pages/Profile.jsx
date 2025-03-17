import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import WeightTimeline from '../components/WeightTimeline';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    level: '',
    trainingDays: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { 
    userData, 
    loading, 
    updateUserData, 
    weightHistory, 
    addWeightRecord 
  } = useUser();

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        goal: userData.goal || '',
        level: userData.level || '',
        trainingDays: userData.trainingDays || ''
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateUserData(formData);
      setSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Erro ao atualizar perfil. Tente novamente mais tarde.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCancel = () => {
    // Restaurar dados originais
    if (userData) {
      setFormData({
        name: userData.name || '',
        goal: userData.goal || '',
        level: userData.level || '',
        trainingDays: userData.trainingDays || ''
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleAddWeight = (weightData) => {
    try {
      addWeightRecord(weightData);
      setSuccess('Registro de peso adicionado com sucesso!');
      
      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Erro ao adicionar registro de peso. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-400">FitLife</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600/80 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
          >
            Sair
          </button>
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Seu Perfil</h2>
          
          {error && (
            <motion.div 
              className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              className="bg-green-500/20 border border-green-500/50 text-green-100 px-4 py-3 rounded mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              {success}
            </motion.div>
          )}
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
            {!isEditing ? (
              <>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 bg-blue-600/30 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 border-2 border-blue-400/50">
                    {userData?.name?.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-bold text-xl text-white">{userData?.name}</p>
                  <p className="text-white/70">{userData?.email}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-white/20 pb-3">
                    <span className="font-medium text-white">Objetivo</span>
                    <span className="text-white/80">{userData?.goal}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 pb-3">
                    <span className="font-medium text-white">Nível</span>
                    <span className="text-white/80">{userData?.level}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 pb-3">
                    <span className="font-medium text-white">Dias de treino</span>
                    <span className="text-white/80">{userData?.trainingDays}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 pb-3">
                    <span className="font-medium text-white">Altura</span>
                    <span className="text-white/80">{userData?.height} cm</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 pb-3">
                    <span className="font-medium text-white">Peso atual</span>
                    <span className="text-white/80">{userData?.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-white">Membro desde</span>
                    <span className="text-white/80">{userData?.joinedDate}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Editar Perfil
                  </motion.button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                    Nome
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="goal" className="block text-white text-sm font-medium mb-2">
                    Objetivo
                  </label>
                  <select
                    id="goal"
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.goal}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled className="bg-neutral-800">Selecione um objetivo</option>
                    <option value="Ganho de massa muscular" className="bg-neutral-800">Ganho de massa muscular</option>
                    <option value="Perda de peso" className="bg-neutral-800">Perda de peso</option>
                    <option value="Melhora da resistência" className="bg-neutral-800">Melhora da resistência</option>
                    <option value="Manutenção da saúde" className="bg-neutral-800">Manutenção da saúde</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="level" className="block text-white text-sm font-medium mb-2">
                    Nível
                  </label>
                  <select
                    id="level"
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.level}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled className="bg-neutral-800">Selecione um nível</option>
                    <option value="Iniciante" className="bg-neutral-800">Iniciante</option>
                    <option value="Intermediário" className="bg-neutral-800">Intermediário</option>
                    <option value="Avançado" className="bg-neutral-800">Avançado</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="trainingDays" className="block text-white text-sm font-medium mb-2">
                    Dias de treino
                  </label>
                  <select
                    id="trainingDays"
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.trainingDays}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled className="bg-neutral-800">Selecione a frequência</option>
                    <option value="2x por semana" className="bg-neutral-800">2x por semana</option>
                    <option value="3x por semana" className="bg-neutral-800">3x por semana</option>
                    <option value="4x por semana" className="bg-neutral-800">4x por semana</option>
                    <option value="5x por semana" className="bg-neutral-800">5x por semana</option>
                    <option value="6x por semana" className="bg-neutral-800">6x por semana</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <motion.button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando...
                      </span>
                    ) : 'Salvar'}
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancelar
                  </motion.button>
                </div>
              </form>
            )}
          </div>
          
          {/* Timeline de Peso e IMC */}
          <WeightTimeline 
            weightHistory={weightHistory} 
            onAddWeight={handleAddWeight} 
          />
        </div>
        
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/home')}
            className="text-blue-300 hover:text-blue-200 transition-colors duration-300"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 