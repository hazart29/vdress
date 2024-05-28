// components/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  title?: string;
  children: React.ReactNode;
}

const ModalAlert: React.FC<ModalProps> = ({ isOpen, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
        <div className="mb-6">
          {children}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all duration-300"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlert;
