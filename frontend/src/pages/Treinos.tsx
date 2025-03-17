import React from 'react';

export default function Treinos() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Meus Treinos</h1>
      <div className="grid gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Treino A - Peito e Tríceps</h2>
          <p className="text-neutral-400">4 exercícios • 45 min</p>
        </div>
      </div>
    </div>
  );
}