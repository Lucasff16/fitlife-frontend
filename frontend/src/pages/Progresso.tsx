import React from 'react';

export default function Progresso() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Meu Progresso</h1>
      <div className="grid gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Evolução Mensal</h2>
          <div className="h-48 flex items-center justify-center">
            <p className="text-neutral-400">Gráfico de progresso em breve</p>
          </div>
        </div>
      </div>
    </div>
  );
}