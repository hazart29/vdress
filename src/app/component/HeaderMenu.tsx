// components/Header.tsx
import React from 'react';
import Image from 'next/image';

const Header: React.FC = () => {
  const handleButton = () => {

  }

  return (
    <header className="flex w-full items-end justify-between top-0 fixed text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="rounded-full overflow-hidden border-4 border-white">
            <Image
              src="/profile.jpg"
              alt="Profile Picture"
              width={60}
              height={60}
            />
          </div>
          <div className="ml-4">
            <h1 className="text-xl font-semibold">Player Name</h1>
            <p className="text-gray-300 text-sm">Level 50 Warrior</p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <Image
              src="/gem-icon.png"
              alt="Gems"
              width={30}
              height={30}
            />
            <span className="ml-2 text-lg">100</span>
          </div>
          <div className="flex items-center">
            <Image
              src="/coin-icon.png"
              alt="Coins"
              width={30}
              height={30}
            />
            <span className="ml-2 text-lg">250</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
