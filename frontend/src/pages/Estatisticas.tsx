import React from 'react';

export default function Estatisticas() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Estatísticas</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Treinos Realizados</h2>
          <p className="text-4xl font-bold">0</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Tempo Total</h2>
          <p className="text-4xl font-bold">0h</p>
        </div>
      </div>
    </div>
  );
}