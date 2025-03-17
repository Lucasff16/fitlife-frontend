import React from 'react';

export default function Objetivos() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Meus Objetivos</h1>
      <div className="grid gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Objetivo Principal</h2>
          <p className="text-neutral-400">Ganho de massa muscular</p>
        </div>
      </div>
    </div>
  );
}