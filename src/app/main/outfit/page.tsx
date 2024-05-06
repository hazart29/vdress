// pages/index.tsx
import React from 'react';
import GameCanvas from '@/app/component/game-canvas';

const IndexPage: React.FC = () => {
  return (
    <div className='flex flex-1'>
      <GameCanvas />
    </div>
  );
};

export default IndexPage;
