import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se há um token no localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    try {
      // Simulação de login (em produção, isso seria uma chamada à API)
      // const response = await api.post('/auth/login', { email, password });
      // const { token, user } = response.data;
      
      // Simulação de resposta
      const mockUser = { id: 1, name: 'Usuário Teste', email };
      const mockToken = 'mock-jwt-token';
      
      // Armazenar no localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Atualizar estado
      setToken(mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return mockUser;
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Credenciais inválidas. Verifique seu email e senha.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    
    try {
      // Simulação de registro (em produção, isso seria uma chamada à API)
      // const response = await api.post('/auth/register', { name, email, password });
      // const { user } = response.data;
      
      // Simulação de resposta
      const mockUser = { id: 1, name, email };
      
      // Não fazemos login automático após o registro
      return mockUser;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw new Error('Não foi possível criar a conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remover do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Atualizar estado
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;