import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Progress() {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [newProgress, setNewProgress] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    notes: ''
  });

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/progress');
      setProgressData(response.data);
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/progress', newProgress);
      setProgressData([...progressData, response.data]);
      setNewProgress({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        bodyFat: '',
        notes: ''
      });
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  };

  const chartData = {
    labels: progressData.map(p => new Date(p.date).toLocaleDateString('pt-BR')),
    datasets: [
      {
        label: selectedMetric === 'weight' ? 'Peso (kg)' : 'Gordura Corporal (%)',
        data: progressData.map(p => p[selectedMetric]),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: selectedMetric === 'weight' ? 'Evolução do Peso' : 'Evolução da Gordura Corporal'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
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
      <h1 className="text-2xl font-bold">Acompanhamento de Progresso</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="border rounded p-2"
          >
            <option value="weight">Peso</option>
            <option value="bodyFat">Gordura Corporal</option>
          </select>
        </div>
        <div className="h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Registrar Novo Progresso</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Data
            </label>
            <input
              type="date"
              value={newProgress.date}
              onChange={(e) => setNewProgress({...newProgress, date: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={newProgress.weight}
              onChange={(e) => setNewProgress({...newProgress, weight: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Gordura Corporal (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={newProgress.bodyFat}
              onChange={(e) => setNewProgress({...newProgress, bodyFat: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Observações
            </label>
            <textarea
              value={newProgress.notes}
              onChange={(e) => setNewProgress({...newProgress, notes: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Salvar Progresso
          </button>
        </form>
      </div>
    </div>
  );
}