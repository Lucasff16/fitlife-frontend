import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loading } = useAuth();

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

    // Validação básica
    if (!formData.email || !formData.password) {
      setError('Email e senha são obrigatórios');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Falha ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-blue-950">
      {/* Contêiner que centraliza vertical e horizontalmente */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-neutral-900/90 p-6 rounded-sm max-w-xs w-full">
          <h1 className="text-3xl font-normal text-center text-white mb-6">
            Login FitLife
          </h1>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-white text-sm mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full bg-black/30 border border-white/10 rounded-sm py-2 px-3 text-white placeholder-white/50 focus:outline-none"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-white text-sm mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                className="w-full bg-black/30 border border-white/10 rounded-sm py-2 px-3 text-white placeholder-white/50 focus:outline-none"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-sm focus:outline-none transition-colors duration-300"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <div className="text-center mt-4">
            <Link to="/register" className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-300">
              Não tem uma conta? Registre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;