import React from 'react';

const Modal = ({ isOpen, onClose, children }: Readonly<{
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}>) => {
  if (!isOpen) return null;

  return (
    <div className="flex bg-gradient-to-b from-cyan-500 via-blue-700 to-blue-900 absolute inset-0 z-[9999] overflow-hidden w-full h-full top-0">
      <div className='flex absolute h-full w-full flex-col inset-0 z-50 select-none bg-hero-patterns items-start p-4 gap-4 top-0'>
        {children}
        <div className='flex gap-2 justify-end w-full'>
          <button type='button' onClick={onClose} className='animate-ping p-2 text-white text-md font-bold'>OK{' >'}</button>
        </div>
      </div>
    </div >
  );
};

export default Modal;
