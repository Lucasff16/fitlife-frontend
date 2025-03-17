import React from 'react';

export default function Configuracoes() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Preferências</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Modo Escuro</span>
            <button className="bg-blue-600 rounded-full w-12 h-6"></button>
          </div>
        </div>
      </div>
    </div>
  );
}