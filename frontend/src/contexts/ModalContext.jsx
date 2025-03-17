import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSize, setModalSize] = useState('md'); // sm, md, lg, xl

  const openModal = (content, title = '', size = 'md') => {
    setModalContent(content);
    setModalTitle(title);
    setModalSize(size);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Limpar o conteúdo após a animação de fechamento
    setTimeout(() => {
      setModalContent(null);
      setModalTitle('');
    }, 300);
  };

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, modalContent, modalTitle }}>
      {children}
      
      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Modal Container */}
          <div 
            className={`bg-neutral-800 rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col
              ${modalSize === 'sm' ? 'max-w-sm w-full' : ''}
              ${modalSize === 'md' ? 'max-w-md w-full' : ''}
              ${modalSize === 'lg' ? 'max-w-lg w-full' : ''}
              ${modalSize === 'xl' ? 'max-w-xl w-full' : ''}
              ${modalSize === '2xl' ? 'max-w-2xl w-full' : ''}
              ${modalSize === 'full' ? 'max-w-4xl w-full' : ''}
            `}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            {modalTitle && (
              <div className="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">{modalTitle}</h3>
                <button 
                  onClick={closeModal}
                  className="text-neutral-400 hover:text-white focus:outline-none"
                >
                  &times;
                </button>
              </div>
            )}
            
            {/* Modal Content */}
            <div className="p-6 overflow-auto">{modalContent}</div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export default ModalContext; 