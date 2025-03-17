import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Perfil() {
  const { currentUser } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-neutral-700 flex items-center justify-center">
            <span className="text-2xl">{currentUser?.name[0]}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{currentUser?.name}</h2>
            <p className="text-neutral-400">{currentUser?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}