import React from 'react';

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Olá, Dev User</h1>
      <div className="grid gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Treino de Hoje</h2>
          <div className="text-neutral-400">Nenhum treino agendado</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Progresso Semanal</h2>
          <div className="text-neutral-400">Carregando dados...</div>
        </div>
      </div>
    </div>
  );
}