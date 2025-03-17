import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { workoutService, exerciseService } from '../services';
import { toast } from 'react-toastify';

// Manter os dados mockados como fallback caso a API falhe
const mockExercises = [
  { _id: '1', name: 'Supino Reto' },
  { _id: '2', name: 'Agachamento' },
  { _id: '3', name: 'Puxada Alta' },
  { _id: '4', name: 'Desenvolvimento' },
  { _id: '5', name: 'Rosca Direta' },
  { _id: '6', name: 'Tríceps Corda' },
  { _id: '7', name: 'Leg Press' },
  { _id: '8', name: 'Remada Baixa' }
];

const mockWorkouts = [
  {
    _id: '1',
    name: 'Treino A - Superior',
    description: 'Foco em peito, ombros e tríceps',
    scheduledDate: '2023-07-10T10:00:00',
    status: 'completed',
    exercises: [
      { exercise: '1', sets: 4, reps: 12, weight: 60, restTime: 90 },
      { exercise: '4', sets: 3, reps: 15, weight: 20, restTime: 60 },
      { exercise: '6', sets: 3, reps: 12, weight: 25, restTime: 60 }
    ]
  },
  {
    _id: '2',
    name: 'Treino B - Inferior',
    description: 'Foco em pernas e glúteos',
    scheduledDate: '2023-07-12T10:00:00',
    status: 'scheduled',
    exercises: [
      { exercise: '2', sets: 4, reps: 10, weight: 80, restTime: 120 },
      { exercise: '7', sets: 3, reps: 12, weight: 120, restTime: 90 }
    ]
  },
  {
    _id: '3',
    name: 'Treino C - Costas e Bíceps',
    description: 'Foco em costas e braços',
    scheduledDate: '2023-07-14T10:00:00',
    status: 'in_progress',
    exercises: [
      { exercise: '3', sets: 4, reps: 12, weight: 60, restTime: 90 },
      { exercise: '8', sets: 3, reps: 12, weight: 50, restTime: 60 },
      { exercise: '5', sets: 3, reps: 15, weight: 15, restTime: 60 }
    ]
  }
];

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'scheduled', 'completed'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scheduledDate: '',
    exercises: []
  });
  const [editMode, setEditMode] = useState(false);
  const [currentWorkoutId, setCurrentWorkoutId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Buscar exercícios
      const exercisesData = await exerciseService.getExercises();
      setExercises(exercisesData.exercises || exercisesData);
      
      // Buscar treinos
      const workoutsData = await workoutService.getWorkouts();
      setWorkouts(workoutsData.workouts || workoutsData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error('Não foi possível carregar os dados. Usando dados de demonstração.');
      // Fallback para dados mockados em caso de erro
      setExercises(mockExercises);
      setWorkouts(mockWorkouts);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let result;
      
      if (editMode && currentWorkoutId) {
        // Atualizar treino existente
        result = await workoutService.updateWorkout(currentWorkoutId, formData);
        toast.success('Treino atualizado com sucesso!');
      } else {
        // Criar novo treino
        result = await workoutService.createWorkout(formData);
        toast.success('Treino criado com sucesso!');
      }
      
      // Atualizar a lista de treinos
      await fetchData();
      
      // Resetar formulário
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      toast.error('Erro ao salvar treino. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = async (id) => {
    setLoading(true);
    try {
      await workoutService.updateWorkoutStatus(id, 'in_progress');
      toast.success('Treino iniciado!');
      await fetchData();
    } catch (error) {
      console.error('Erro ao iniciar treino:', error);
      toast.error('Erro ao iniciar treino. Por favor, tente novamente.');
      
      // Fallback para atualização local em caso de erro
      const updatedWorkouts = workouts.map(workout => 
        workout._id === id ? { ...workout, status: 'in_progress' } : workout
      );
      setWorkouts(updatedWorkouts);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteWorkout = async (id) => {
    setLoading(true);
    try {
      await workoutService.updateWorkoutStatus(id, 'completed');
      toast.success('Treino concluído!');
      await fetchData();
    } catch (error) {
      console.error('Erro ao concluir treino:', error);
      toast.error('Erro ao concluir treino. Por favor, tente novamente.');
      
      // Fallback para atualização local em caso de erro
      const updatedWorkouts = workouts.map(workout => 
        workout._id === id ? { ...workout, status: 'completed' } : workout
      );
      setWorkouts(updatedWorkouts);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const workout = await workoutService.getWorkoutById(id);
      
      // Preencher o formulário com os dados do treino
      setFormData({
        name: workout.name,
        description: workout.description,
        scheduledDate: workout.scheduledDate ? new Date(workout.scheduledDate).toISOString().slice(0, 16) : '',
        exercises: workout.exercises || []
      });
      
      // Ativar modo de edição
      setEditMode(true);
      setCurrentWorkoutId(id);
      setShowForm(true);
      
      // Rolar para o formulário
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Erro ao carregar treino para edição:', error);
      toast.error('Erro ao carregar dados do treino. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) {
      setLoading(true);
      try {
        await workoutService.deleteWorkout(id);
        toast.success('Treino excluído com sucesso!');
        await fetchData();
      } catch (error) {
        console.error('Erro ao excluir treino:', error);
        toast.error('Erro ao excluir treino. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddExercise = () => {
    setFormData({
      ...formData,
      exercises: [
        ...formData.exercises,
        { exercise: '', sets: 3, reps: 12, weight: 0, restTime: 60 }
      ]
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      scheduledDate: '',
      exercises: []
    });
    setEditMode(false);
    setCurrentWorkoutId(null);
    setShowForm(false);
  };

  // Filtrar treinos com base na aba selecionada
  const filteredWorkouts = workouts.filter(workout => {
    if (activeTab === 'all') return true;
    if (activeTab === 'scheduled') return workout.status === 'scheduled';
    if (activeTab === 'in_progress') return workout.status === 'in_progress';
    if (activeTab === 'completed') return workout.status === 'completed';
    return true;
  });

  // Função para obter o nome do exercício pelo ID
  const getExerciseName = (id) => {
    const exercise = exercises.find(ex => ex._id === id);
    return exercise ? exercise.name : 'Exercício não encontrado';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Treinos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          {showForm ? (
            'Cancelar'
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Novo Treino
            </>
          )}
        </button>
      </div>

      {/* Abas de filtro */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'scheduled'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Agendados
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'in_progress'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Em Andamento
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'completed'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Concluídos
            </button>
          </nav>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nome do Treino
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Data Programada
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Exercícios</h3>
              <button
                type="button"
                onClick={handleAddExercise}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Adicionar Exercício
              </button>
            </div>

            {formData.exercises.length === 0 ? (
              <div className="text-center py-4 text-gray-500 border border-dashed rounded-lg">
                Nenhum exercício adicionado. Clique em "Adicionar Exercício" para começar.
              </div>
            ) : (
              formData.exercises.map((exercise, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-xs mb-1">Exercício</label>
                    <select
                      value={exercise.exercise}
                      onChange={(e) => {
                        const newExercises = [...formData.exercises];
                        newExercises[index].exercise = e.target.value;
                        setFormData({ ...formData, exercises: newExercises });
                      }}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Selecione um exercício...</option>
                      {exercises.map(ex => (
                        <option key={ex._id} value={ex._id}>{ex.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs mb-1">Séries</label>
                    <input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) => {
                        const newExercises = [...formData.exercises];
                        newExercises[index].sets = Number(e.target.value);
                        setFormData({ ...formData, exercises: newExercises });
                      }}
                      className="w-full p-2 border rounded"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs mb-1">Repetições</label>
                    <input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) => {
                        const newExercises = [...formData.exercises];
                        newExercises[index].reps = Number(e.target.value);
                        setFormData({ ...formData, exercises: newExercises });
                      }}
                      className="w-full p-2 border rounded"
                      min="1"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        const newExercises = formData.exercises.filter((_, i) => i !== index);
                        setFormData({ ...formData, exercises: newExercises });
                      }}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Salvar Treino
            </button>
          </div>
        </form>
      )}

      {filteredWorkouts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-lg">Nenhum treino encontrado</p>
          <button
            onClick={() => setActiveTab('all')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Ver todos os treinos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredWorkouts.map(workout => (
            <div key={workout._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{workout.name}</h3>
                  <p className="text-gray-500">
                    {format(new Date(workout.scheduledDate), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  workout.status === 'completed' ? 'bg-green-100 text-green-800' :
                  workout.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {workout.status === 'completed' ? 'Concluído' :
                  workout.status === 'in_progress' ? 'Em andamento' :
                  'Agendado'}
                </span>
              </div>
              
              <p className="text-gray-600 mt-2">{workout.description}</p>
              
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700 mb-2">Exercícios:</h4>
                <ul className="space-y-2">
                  {workout.exercises.map((ex, index) => (
                    <li key={index} className="text-gray-600 text-sm flex justify-between">
                      <span>{getExerciseName(ex.exercise)}</span>
                      <span>{ex.sets} x {ex.reps}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                {workout.status === 'scheduled' && (
                  <button
                    onClick={() => handleStartWorkout(workout._id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                  >
                    Iniciar Treino
                  </button>
                )}
                
                {workout.status === 'in_progress' && (
                  <button
                    onClick={() => handleCompleteWorkout(workout._id)}
                    className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
                  >
                    Concluir Treino
                  </button>
                )}
                
                <Link
                  to={`/workouts/${workout._id}`}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm"
                >
                  Detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}