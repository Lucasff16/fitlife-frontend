import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

const WeightTimeline = ({ weightHistory, onAddWeight }) => {
  const [showForm, setShowForm] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [height, setHeight] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Formatar data para exibição
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Calcular IMC
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Classificar IMC
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Abaixo do peso', color: 'text-blue-400' };
    if (bmi < 25) return { category: 'Peso normal', color: 'text-green-400' };
    if (bmi < 30) return { category: 'Sobrepeso', color: 'text-yellow-400' };
    if (bmi < 35) return { category: 'Obesidade Grau I', color: 'text-orange-400' };
    if (bmi < 40) return { category: 'Obesidade Grau II', color: 'text-red-400' };
    return { category: 'Obesidade Grau III', color: 'text-red-600' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!newWeight) {
      setError('Por favor, informe seu peso atual');
      return;
    }

    if (!height) {
      setError('Por favor, informe sua altura em cm');
      return;
    }

    const weight = parseFloat(newWeight);
    const heightValue = parseFloat(height);

    if (isNaN(weight) || weight <= 0) {
      setError('Peso inválido');
      return;
    }

    if (isNaN(heightValue) || heightValue <= 0) {
      setError('Altura inválida');
      return;
    }

    const bmi = calculateBMI(weight, heightValue);
    
    onAddWeight({
      date: new Date(),
      weight,
      height: heightValue,
      bmi
    });

    setNewWeight('');
    setShowForm(false);
  };

  // Preparar dados para o gráfico
  const chartData = weightHistory.map(record => ({
    date: formatDate(record.date),
    peso: record.weight,
    imc: parseFloat(record.bmi)
  }));

  return (
    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Histórico de Peso e IMC</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-lg transition-colors duration-300"
        >
          {showForm ? 'Cancelar' : 'Adicionar Registro'}
        </button>
      </div>

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

      {showForm && (
        <motion.form 
          onSubmit={handleSubmit}
          className="bg-white/5 p-4 rounded-lg mb-6 border border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="weight" className="block text-white text-sm font-medium mb-2">
                Peso (kg)
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                min="30"
                max="300"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Ex: 75.5"
                required
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-white text-sm font-medium mb-2">
                Altura (cm)
              </label>
              <input
                id="height"
                type="number"
                step="1"
                min="100"
                max="250"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Ex: 175"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
          >
            Salvar Registro
          </button>
        </motion.form>
      )}

      {weightHistory.length > 0 ? (
        <>
          <div className="mb-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#aaa" />
                <YAxis yAxisId="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }} 
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="peso" stroke="#8884d8" name="Peso (kg)" activeDot={{ r: 8 }} />
                <Line yAxisId="right" type="monotone" dataKey="imc" stroke="#82ca9d" name="IMC" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white border-b border-white/20 pb-2">Registros</h4>
            <ul className="space-y-3">
              {weightHistory.map((record, index) => {
                const bmiCategory = getBMICategory(record.bmi);
                return (
                  <li key={index} className="flex flex-col md:flex-row md:justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600/30 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 border border-blue-400/50">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-white">{formatDate(record.date)}</p>
                        <p className="text-sm text-white/70">Altura: {record.height} cm</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end mt-2 md:mt-0">
                      <p className="font-medium text-white">Peso: {record.weight} kg</p>
                      <p className={`text-sm ${bmiCategory.color}`}>
                        IMC: {record.bmi} - {bmiCategory.category}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-white/70">
          <p>Nenhum registro de peso encontrado.</p>
          <p className="mt-2">Adicione seu primeiro registro para começar a acompanhar seu progresso.</p>
        </div>
      )}
    </div>
  );
};

export default WeightTimeline; 