import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CalendarContext = createContext();

export const useCalendar = () => useContext(CalendarContext);

export const CalendarProvider = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEvents();
    } else {
      setLoading(false);
      setEvents([]);
    }
  }, [user]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Simulação de dados para desenvolvimento
      // Em produção, isso seria uma chamada de API real
      setTimeout(() => {
        const mockEvents = [
          {
            id: '1',
            title: 'Treino de Peito',
            start: new Date(new Date().setDate(new Date().getDate() - 2)),
            end: new Date(new Date().setDate(new Date().getDate() - 2)),
            color: '#4f46e5',
            completed: true
          },
          {
            id: '2',
            title: 'Treino de Pernas',
            start: new Date(),
            end: new Date(),
            color: '#4f46e5',
            completed: false
          },
          {
            id: '3',
            title: 'Treino de Costas',
            start: new Date(new Date().setDate(new Date().getDate() + 2)),
            end: new Date(new Date().setDate(new Date().getDate() + 2)),
            color: '#4f46e5',
            completed: false
          }
        ];
        setEvents(mockEvents);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao buscar eventos do calendário:', error);
      setLoading(false);
    }
  };

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      completed: false
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (updatedEvent) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const markEventAsCompleted = (eventId) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, completed: true } : event
      )
    );
  };

  return (
    <CalendarContext.Provider 
      value={{ 
        events, 
        loading, 
        addEvent, 
        updateEvent, 
        deleteEvent, 
        markEventAsCompleted,
        refreshEvents: fetchEvents
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContext; 