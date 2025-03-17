import React from 'react';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Bem-vindo ao FitLife</h2>
        <p className="text-gray-600 mb-4">
          Esta é a página inicial do seu aplicativo de fitness.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Exercícios</h3>
            <p className="text-sm text-blue-600">
              Acesse e gerencie sua biblioteca de exercícios.
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-medium text-green-800 mb-2">Treinos</h3>
            <p className="text-sm text-green-600">
              Crie e acompanhe seus treinos personalizados.
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-medium text-purple-800 mb-2">Progresso</h3>
            <p className="text-sm text-purple-600">
              Acompanhe seu progresso e evolução.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}