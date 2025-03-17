import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen w-full bg-neutral-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-white/70 mb-8">Página não encontrada</p>
      <Link
        to="/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
      >
        Voltar para Home
      </Link>
    </div>
  </div>
);

export default NotFound; 