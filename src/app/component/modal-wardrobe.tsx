import React from 'react';

const ModalWardrobe = ({ isOpen, onClose, children }: Readonly<{
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}>) => {
  if (!isOpen) return null;

  return (
    <div className='absolute inset-0 right-0 top-1/3 flex h-1/3 flex-col select-none bg-gray-100 items-start justify-between m-4 p-4 gap-4 rounded-lg border border-1 '>
      {children}
      <div className='flex gap-2 justify-end w-full'>
        <button type='button' onClick={onClose} className='p-2 text-white text-sm text-md font-bold bg-red-600 rounded-lg hover:bg-red-500 hover:transform hover:scale-110'>Tutup</button>
      </div>
    </div>
  );
};

export default ModalWardrobe;
