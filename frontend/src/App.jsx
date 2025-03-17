import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { ExerciseProvider } from './contexts/ExerciseContext';
import { ToastProvider } from './contexts/ToastContext';
import { ModalProvider } from './contexts/ModalContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { CalendarProvider } from './contexts/CalendarContext';
import { UserProvider } from './contexts/UserContext';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import TestConnection from './pages/TestConnection';

const queryClient = new QueryClient();

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen bg-neutral-900 flex items-center justify-center"><p className="text-white">Carregando...</p></div>;
  
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <ToastProvider>
              <ModalProvider>
                <WorkoutProvider>
                  <ExerciseProvider>
                    <ProgressProvider>
                      <CalendarProvider>
                        <Router>
                          <div className="min-h-screen bg-neutral-900">
                            <Routes>
                              {/* Rotas públicas */}
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<Register />} />
                              <Route path="/test" element={<TestConnection />} />
                              
                              {/* Rotas protegidas */}
                              <Route path="/" element={
                                <ProtectedRoute>
                                  <Home />
                                </ProtectedRoute>
                              } />
                              <Route path="/home" element={
                                <ProtectedRoute>
                                  <Home />
                                </ProtectedRoute>
                              } />
                              
                              {/* Rota 404 */}
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </div>
                        </Router>
                      </CalendarProvider>
                    </ProgressProvider>
                  </ExerciseProvider>
                </WorkoutProvider>
              </ModalProvider>
            </ToastProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
