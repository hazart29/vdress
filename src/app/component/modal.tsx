import React from 'react';

const Modal = ({ isOpen, onClose, children }: Readonly<{
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}>) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm">
      <div className="fixed inset-0 bg-black opacity-75"></div>
      <div className="bg-white flex flex-col flex-1 p-4 rounded-lg z-[110]">
        {children}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;