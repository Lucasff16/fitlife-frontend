import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-xl font-bold text-blue-600">
              FitLife
            </Link>
          </div>

          {/* Menu para desktop */}
          {currentUser && (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                Dashboard
              </Link>
              <Link to="/exercises" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                Exercícios
              </Link>
              <Link to="/workouts" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                Treinos
              </Link>
              <Link to="/fitness-ideas" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                Ideias Fitness
              </Link>
              
              {/* Botão de logout visível */}
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 px-3 py-2 rounded-md font-medium"
              >
                Sair
              </button>
              
              {/* Dropdown do usuário */}
              <div className="relative ml-3">
                <div>
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
                  >
                    <span className="mr-2">{currentUser.name}</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Perfil
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Configurações
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Menu para mobile */}
          <div className="md:hidden flex items-center">
            {currentUser && (
              <>
                {/* Botão de logout visível para mobile */}
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 px-3 py-2 rounded-md mr-2"
                >
                  Sair
                </button>
                
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Menu mobile expandido */}
        {isMenuOpen && currentUser && (
          <div className="md:hidden py-2">
            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Dashboard
            </Link>
            <Link to="/exercises" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Exercícios
            </Link>
            <Link to="/workouts" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Treinos
            </Link>
            <Link to="/fitness-ideas" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Ideias Fitness
            </Link>
            <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Perfil
            </Link>
            <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Configurações
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}