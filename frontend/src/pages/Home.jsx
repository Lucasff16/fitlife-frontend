import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useWorkout } from '../contexts/WorkoutContext';
import { useExercise } from '../contexts/ExerciseContext';
import { useUser } from '../contexts/UserContext';
import WeightTimeline from '../components/WeightTimeline';

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou seu assistente de fitness. Como posso ajudar você hoje?' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { workouts, toggleWorkoutCompletion } = useWorkout();
  const { exercises } = useExercise();
  const { userData, stats, weightHistory, addWeightRecord } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage = { role: 'user', content: newMessage };
    setChatMessages([...chatMessages, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    // Simular resposta da IA (em produção, isso seria uma chamada à API da OpenAI)
    setTimeout(() => {
      let response;
      
      // Respostas simuladas baseadas em palavras-chave
      if (newMessage.toLowerCase().includes('treino')) {
        response = { 
          role: 'assistant', 
          content: 'Para um treino eficaz, recomendo seguir um programa consistente com progressão de carga. Você pode começar com os treinos A, B e C que já estão no seu plano. Lembre-se de descansar adequadamente entre as sessões!' 
        };
      } else if (newMessage.toLowerCase().includes('dieta') || newMessage.toLowerCase().includes('alimentação')) {
        response = { 
          role: 'assistant', 
          content: 'Uma alimentação balanceada é essencial para seus objetivos fitness. Certifique-se de consumir proteínas suficientes (cerca de 1.6-2g por kg de peso corporal), carboidratos de qualidade e gorduras saudáveis. Não se esqueça de se manter hidratado!' 
        };
      } else if (newMessage.toLowerCase().includes('peso') || newMessage.toLowerCase().includes('emagrecer')) {
        response = { 
          role: 'assistant', 
          content: 'Para perda de peso saudável, combine exercícios de força com cardio moderado e mantenha um déficit calórico leve (cerca de 300-500 calorias por dia). Monitore seu progresso semanalmente e ajuste conforme necessário.' 
        };
      } else if (newMessage.toLowerCase().includes('músculo') || newMessage.toLowerCase().includes('hipertrofia')) {
        response = { 
          role: 'assistant', 
          content: 'Para ganho de massa muscular, foque em treinos de força progressivos, consumo adequado de proteínas e um leve superávit calórico. Priorize exercícios compostos como agachamento, supino e levantamento terra.' 
        };
      } else {
        response = { 
          role: 'assistant', 
          content: 'Obrigado pela sua mensagem! Como seu assistente de fitness, estou aqui para ajudar com dúvidas sobre treinos, nutrição, recuperação e bem-estar. Tem alguma pergunta específica sobre sua jornada fitness?' 
        };
      }
      
      setChatMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-600/20 backdrop-blur-sm p-4 rounded-lg text-center border border-blue-500/30">
          <p className="text-sm text-blue-300">Treinos Completados</p>
          <p className="text-2xl font-bold text-white">{stats.workoutsCompleted}</p>
        </div>
        <div className="bg-green-600/20 backdrop-blur-sm p-4 rounded-lg text-center border border-green-500/30">
          <p className="text-sm text-green-300">Calorias Queimadas</p>
          <p className="text-2xl font-bold text-white">{stats.caloriesBurned}</p>
        </div>
        <div className="bg-purple-600/20 backdrop-blur-sm p-4 rounded-lg text-center border border-purple-500/30">
          <p className="text-sm text-purple-300">Minutos Exercitados</p>
          <p className="text-2xl font-bold text-white">{stats.minutesExercised}</p>
        </div>
        <div className="bg-orange-600/20 backdrop-blur-sm p-4 rounded-lg text-center border border-orange-500/30">
          <p className="text-sm text-orange-300">Dias Consecutivos</p>
          <p className="text-2xl font-bold text-white">{stats.streakDays}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-bold text-xl mb-3 text-white">Próximos Treinos</h3>
        <div className="space-y-3">
          {workouts.map(workout => (
            <motion.div 
              key={workout.id} 
              className="flex items-center justify-between bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <p className="font-medium text-white">{workout.name}</p>
                <p className="text-sm text-white/70">{workout.day}</p>
              </div>
              <button 
                onClick={() => toggleWorkoutCompletion(workout.id)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  workout.completed 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}
              >
                {workout.completed ? 'Concluído' : 'Pendente'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExercises = () => (
    <div className="space-y-4">
      <h3 className="font-bold text-xl mb-3 text-white">Biblioteca de Exercícios</h3>
      
      <div className="space-y-3">
        {exercises.map(exercise => (
          <motion.div 
            key={exercise.id} 
            className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-medium text-white">{exercise.name}</p>
            <p className="text-sm text-white/70">{exercise.muscle} | {exercise.sets} séries x {exercise.reps} repetições</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => {
    const handleAddWeight = (weightData) => {
      try {
        addWeightRecord(weightData);
        // Mostrar mensagem de sucesso (opcional)
      } catch (err) {
        console.error('Erro ao adicionar registro de peso:', err);
      }
    };
    
    return (
      <div className="space-y-6">
        <h3 className="font-bold text-xl mb-3 text-white">Perfil do Usuário</h3>
        
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
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
              <span className="text-white/80">{userData?.fitnessGoal}</span>
            </div>
            <div className="flex justify-between border-b border-white/20 pb-3">
              <span className="font-medium text-white">Nível</span>
              <span className="text-white/80">{userData?.activityLevel}</span>
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
        </div>
        
        {/* Timeline de Peso e IMC */}
        <WeightTimeline 
          weightHistory={weightHistory} 
          onAddWeight={handleAddWeight} 
        />
      </div>
    );
  };

  const renderChat = () => (
    <div className="space-y-4">
      <h3 className="font-bold text-xl mb-3 text-white">Assistente Fitness</h3>
      
      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 h-80 overflow-y-auto flex flex-col space-y-3">
        {chatMessages.map((msg, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === 'user' 
                ? 'bg-blue-600/30 ml-auto border border-blue-500/30' 
                : 'bg-gray-800/50 border border-gray-700/50'
            }`}
          >
            <p className="text-white">{msg.content}</p>
          </div>
        ))}
        {isTyping && (
          <div className="bg-gray-800/50 p-3 rounded-lg max-w-[80%] flex space-x-1 border border-gray-700/50">
            <span className="animate-bounce text-white">.</span>
            <span className="animate-bounce delay-100 text-white">.</span>
            <span className="animate-bounce delay-200 text-white">.</span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <motion.button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enviar
        </motion.button>
      </form>
    </div>
  );

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
          <p className="text-white mb-1">
            Bem-vindo, <span className="font-bold">{userData?.name}</span>!
          </p>
        </div>
        
        <div className="mb-6">
          <div className="flex border-b border-white/20 overflow-x-auto">
            <button
              className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'dashboard' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/70'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'exercises' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/70'}`}
              onClick={() => setActiveTab('exercises')}
            >
              Exercícios
            </button>
            <button
              className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'chat' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/70'}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat IA
            </button>
            <button
              className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'profile' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/70'}`}
              onClick={() => setActiveTab('profile')}
            >
              Perfil
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'exercises' && renderExercises()}
          {activeTab === 'chat' && renderChat()}
          {activeTab === 'profile' && renderProfile()}
        </div>
      </div>
    </div>
  );
};

export default Home; 