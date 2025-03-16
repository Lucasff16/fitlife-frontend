import React from 'react';

/**
 * Componente de paginação
 * @param {Object} props - Propriedades do componente
 * @param {number} props.currentPage - Página atual
 * @param {number} props.totalPages - Total de páginas
 * @param {Function} props.onPageChange - Função chamada quando a página é alterada
 * @param {boolean} props.disabled - Se a paginação está desabilitada
 */
export default function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange, 
  disabled = false 
}) {
  // Não renderizar se houver apenas uma página
  if (totalPages <= 1) return null;

  // Calcular páginas a serem exibidas
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Mostrar todas as páginas se o total for menor que o máximo
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar páginas com elipses
      if (currentPage <= 3) {
        // Caso 1: Página atual próxima do início
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Caso 2: Página atual próxima do fim
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Caso 3: Página atual no meio
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Função para ir para a página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  // Função para ir para a próxima página
  const goToNextPage = () => {
    if (currentPage < totalPages && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  // Função para ir para uma página específica
  const goToPage = (page) => {
    if (page !== '...' && page !== currentPage && !disabled) {
      onPageChange(page);
    }
  };

  // Gerar lista de páginas
  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center mt-6" aria-label="Paginação">
      <ul className="flex items-center space-x-1">
        {/* Botão Anterior */}
        <li>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || disabled}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1 || disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Ir para página anterior"
          >
            &laquo;
          </button>
        </li>
        
        {/* Números das páginas */}
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="px-3 py-1 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => goToPage(page)}
                disabled={page === currentPage || disabled}
                className={`px-3 py-1 rounded-md ${
                  page === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={`Ir para página ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        
        {/* Botão Próximo */}
        <li>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages || disabled}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages || disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Ir para próxima página"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
} 