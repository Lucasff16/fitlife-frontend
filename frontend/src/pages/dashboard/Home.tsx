import React from 'react';

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Fitness App</h1>
      <div className="grid gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Próximo Treino</h2>
          {/* Conteúdo do próximo treino */}
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Resumo da Semana</h2>
          {/* Resumo semanal */}
        </div>
      </div>
    </div>
  );
}