import React from "react";

interface GachaButtonProps {
  onClick: (type: number) => void;
}

const GachaButton: React.FC<GachaButtonProps> = ({ onClick }) => {
  return (
    <div className="flex flex-1 gap-4 justify-end items-center lg:text-4xl text-base">
      <button
        className="bg-white text-gray-800 font-bold py-2 px-4 rounded-md shadow-md 
                   hover:bg-gray-100 hover:scale-105 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ease-in-out 
                   flex items-center"
        onClick={() => onClick(1)}
      >
        <span className="mr-2">1x Draw</span>
        <img src="/images/primogem.png" alt="Primogem" className="w-6 h-6 transition-transform duration-200 hover:rotate-12" />
        <span className="ml-2">x1</span>
      </button>

      <button
        className="bg-white text-gray-800 font-bold py-2 px-4 rounded-md shadow-md 
                   hover:bg-gray-100 hover:scale-105 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ease-in-out 
                   flex items-center"
        onClick={() => onClick(10)}
      >
        <span className="mr-2">10x Draw</span>
        <img src="/images/primogem.png" alt="Primogem" className="w-6 h-6 transition-transform duration-200 hover:-rotate-12" />
        <span className="ml-2">x10</span>
      </button>
    </div>
  );
};

export default GachaButton;