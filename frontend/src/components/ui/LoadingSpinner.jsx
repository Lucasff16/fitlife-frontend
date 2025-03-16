import React from 'react';

/**
 * Componente de spinner de carregamento
 * @param {Object} props - Propriedades do componente
 * @param {string} props.size - Tamanho do spinner ('sm', 'md', 'lg')
 * @param {string} props.color - Cor do spinner ('primary', 'secondary', 'success', 'danger')
 * @param {string} props.className - Classes CSS adicionais
 */
export default function LoadingSpinner({ size = 'md', color = 'primary', className = '' }) {
  // Mapear tamanhos para classes CSS
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  // Mapear cores para classes CSS
  const colorClasses = {
    primary: 'border-blue-500',
    secondary: 'border-gray-500',
    success: 'border-green-500',
    danger: 'border-red-500'
  };

  // Combinar classes
  const spinnerClasses = `
    inline-block rounded-full 
    border-solid border-t-transparent 
    animate-spin 
    ${sizeClasses[size] || sizeClasses.md} 
    ${colorClasses[color] || colorClasses.primary}
    ${className}
  `;

  return (
    <div className={spinnerClasses} role="status" aria-label="Carregando">
      <span className="sr-only">Carregando...</span>
    </div>
  );
} 