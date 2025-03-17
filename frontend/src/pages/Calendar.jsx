import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from 'axios';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    workoutId: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchWorkouts();
  }, [currentDate]);

  const fetchWorkouts = async () => {
    try {
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);
      const response = await axios.get(`http://localhost:3000/api/calendar?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
      setWorkouts(response.data);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleWorkout = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/calendar', formData);
      fetchWorkouts();
      setShowForm(false);
      setFormData({
        workoutId: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (error) {
      console.error('Erro ao agendar treino:', error);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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
        <h1 className="text-2xl font-bold">Calendário de Treinos</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Anterior
          </button>
          <span className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Próximo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekDays.map(day => (
            <div key={day} className="bg-gray-50 p-4 text-center font-semibold">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {daysInMonth.map(date => {
            const dayWorkouts = workouts.filter(w => 
              new Date(w.date).toDateString() === date.toDateString()
            );

            return (
              <div
                key={date.toISOString()}
                onClick={() => {
                  setSelectedDate(date);
                  setShowForm(true);
                  setFormData({...formData, date: date.toISOString().split('T')[0]});
                }}
                className={`
                  bg-white p-4 min-h-[100px] cursor-pointer hover:bg-gray-50
                  ${isToday(date) ? 'bg-blue-50' : ''}
                  ${!isSameMonth(date, currentDate) ? 'text-gray-400' : ''}
                `}
              >
                <div className="font-semibold mb-1">{format(date, 'd')}</div>
                {dayWorkouts.map(workout => (
                  <div
                    key={workout._id}
                    className="text-sm p-1 mb-1 rounded bg-blue-100 text-blue-800"
                  >
                    {workout.workout.name}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Agendar Treino</h2>
            <form onSubmit={handleScheduleWorkout} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Treino
                </label>
                <select
                  value={formData.workoutId}
                  onChange={(e) => setFormData({...formData, workoutId: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Selecione um treino...</option>
                  {workouts.map(workout => (
                    <option key={workout._id} value={workout._id}>
                      {workout.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}