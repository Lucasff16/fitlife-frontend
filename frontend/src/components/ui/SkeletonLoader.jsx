import React from 'react';

/**
 * Componente de Skeleton Loader para exibir durante o carregamento
 * @param {Object} props - Propriedades do componente
 * @param {string} props.type - Tipo de skeleton ('card', 'list', 'text', 'circle')
 * @param {number} props.count - Número de itens a serem exibidos
 * @param {string} props.className - Classes CSS adicionais
 */
export default function SkeletonLoader({ type = 'card', count = 1, className = '' }) {
  // Função para renderizar um único skeleton com base no tipo
  const renderSkeleton = (index) => {
    switch (type) {
      case 'card':
        return (
          <div 
            key={index} 
            className={`bg-gray-200 animate-pulse rounded-lg p-6 ${className}`}
          >
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
            <div className="flex justify-end">
              <div className="h-8 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        );
        
      case 'list':
        return (
          <div 
            key={index} 
            className={`bg-gray-200 animate-pulse rounded p-4 flex items-center ${className}`}
          >
            <div className="h-10 w-10 bg-gray-300 rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        );
        
      case 'text':
        return (
          <div key={index} className={`animate-pulse ${className}`}>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        );
        
      case 'circle':
        return (
          <div 
            key={index} 
            className={`h-12 w-12 bg-gray-200 animate-pulse rounded-full ${className}`}
          ></div>
        );
        
      default:
        return (
          <div 
            key={index} 
            className={`h-4 bg-gray-200 animate-pulse rounded w-full ${className}`}
          ></div>
        );
    }
  };

  // Renderizar múltiplos skeletons com base no count
  return (
    <div className={`space-y-4 ${type === 'list' ? '' : ''}`}>
      {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
    </div>
  );
} 