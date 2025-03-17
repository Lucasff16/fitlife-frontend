import { useState, useEffect } from 'react';
import { exerciseService } from '../services';
import { toast } from 'react-toastify';

// Manter os dados mockados como fallback caso a API falhe
const mockExercises = [
  {
    _id: '1',
    name: 'Supino Reto',
    muscleGroup: 'chest',
    description: 'Deite-se em um banco reto, segure a barra com as mãos um pouco mais afastadas que a largura dos ombros, desça a barra até o peito e empurre de volta para cima.',
    imageUrl: 'https://example.com/supino.jpg',
    difficulty: 'intermediate',
    equipment: 'barbell'
  },
  {
    _id: '2',
    name: 'Agachamento',
    muscleGroup: 'legs',
    description: 'Fique em pé com os pés na largura dos ombros, desça dobrando os joelhos como se fosse sentar em uma cadeira, mantendo as costas retas, e depois retorne à posição inicial.',
    imageUrl: 'https://example.com/agachamento.jpg',
    difficulty: 'intermediate',
    equipment: 'barbell'
  },
  {
    _id: '3',
    name: 'Puxada Alta',
    muscleGroup: 'back',
    description: 'Sente-se na máquina de puxada, segure a barra com as mãos mais afastadas que a largura dos ombros, e puxe a barra para baixo até a altura do queixo.',
    imageUrl: 'https://example.com/puxada.jpg',
    difficulty: 'beginner',
    equipment: 'machine'
  }
];

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    muscleGroup: '',
    description: '',
    difficulty: 'beginner',
    equipment: '',
    image: null
  });
  const [editMode, setEditMode] = useState(false);
  const [currentExerciseId, setCurrentExerciseId] = useState(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      // Construir parâmetros de consulta para filtragem
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterGroup) params.muscleGroup = filterGroup;
      
      const data = await exerciseService.getExercises(params);
      setExercises(data.exercises || data);
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error);
      toast.error('Não foi possível carregar os exercícios. Usando dados de demonstração.');
      // Fallback para dados mockados em caso de erro
      setExercises(mockExercises);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let result;
      
      if (editMode && currentExerciseId) {
        // Atualizar exercício existente
        result = await exerciseService.updateExercise(currentExerciseId, formData);
        toast.success('Exercício atualizado com sucesso!');
      } else {
        // Criar novo exercício
        result = await exerciseService.createExercise(formData);
        toast.success('Exercício criado com sucesso!');
      }
      
      // Atualizar a lista de exercícios
      await fetchExercises();
      
      // Resetar formulário
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar exercício:', error);
      toast.error('Erro ao salvar exercício. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este exercício?')) {
      setLoading(true);
      try {
        await exerciseService.deleteExercise(id);
        toast.success('Exercício excluído com sucesso!');
        // Atualizar a lista após exclusão
        await fetchExercises();
      } catch (error) {
        console.error('Erro ao excluir exercício:', error);
        toast.error('Erro ao excluir exercício. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const exercise = await exerciseService.getExerciseById(id);
      
      // Preencher o formulário com os dados do exercício
      setFormData({
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        description: exercise.description,
        difficulty: exercise.difficulty,
        equipment: exercise.equipment,
        image: null // Não podemos carregar a imagem existente como File
      });
      
      // Ativar modo de edição
      setEditMode(true);
      setCurrentExerciseId(id);
      setShowForm(true);
      
      // Rolar para o formulário
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Erro ao carregar exercício para edição:', error);
      toast.error('Erro ao carregar dados do exercício. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      muscleGroup: '',
      description: '',
      difficulty: 'beginner',
      equipment: '',
      image: null
    });
    setEditMode(false);
    setCurrentExerciseId(null);
    setShowForm(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchExercises();
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
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
        <h1 className="text-2xl font-bold">Exercícios</h1>
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
              Novo Exercício
            </>
          )}
        </button>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Pesquisar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar exercícios..."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="md:w-1/4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Grupo Muscular
            </label>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Todos</option>
              <option value="peito">Peito</option>
              <option value="costas">Costas</option>
              <option value="pernas">Pernas</option>
              <option value="ombros">Ombros</option>
              <option value="braços">Braços</option>
              <option value="abdômen">Abdômen</option>
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nome
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
              Grupo Muscular
            </label>
            <select
              value={formData.muscleGroup}
              onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Selecione...</option>
              <option value="peito">Peito</option>
              <option value="costas">Costas</option>
              <option value="pernas">Pernas</option>
              <option value="ombros">Ombros</option>
              <option value="braços">Braços</option>
              <option value="abdômen">Abdômen</option>
            </select>
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

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Dificuldade
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="beginner">Iniciante</option>
              <option value="intermediate">Intermediário</option>
              <option value="advanced">Avançado</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Equipamento
            </label>
            <select
              value={formData.equipment}
              onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Selecione...</option>
              <option value="barbell">Barbell</option>
              <option value="machine">Máquina</option>
              <option value="bodyweight">Bodyweight</option>
              <option value="dumbbell">Halteres</option>
              <option value="cable">Cabo</option>
              <option value="other">Outro</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
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
              Salvar Exercício
            </button>
          </div>
        </form>
      )}

      {exercises.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 text-lg">Nenhum exercício encontrado</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterGroup('');
            }}
            className="mt-4 text-blue-600 hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map(exercise => (
            <div key={exercise._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{exercise.name}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(exercise._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232L18 7M9 15l3 3m0 0l3-3m-3 3" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(exercise._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mt-2">{exercise.description}</p>
              <div className="mt-4">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                  {exercise.muscleGroup}
                </span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                  {exercise.difficulty}
                </span>
              </div>
              
              <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                Ver detalhes
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}