'use client'
import React, { useEffect, useRef } from 'react';

interface Live2DComponentProps {
  modelPath: string;
}

const Live2DComponent: React.FC<Live2DComponentProps> = ({ modelPath }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const img = new Image();
    img.src = modelPath;
    img.onload = () => {
      context.drawImage(img, 0, 0);
    };
  }, [modelPath]);

  return <canvas className='flex w-full h-full' ref={canvasRef} />;
};

export default Live2DComponent;
