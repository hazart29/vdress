'use client'
import React, { useRef, useEffect } from 'react';

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    loadImage(ctx);
  }, []);

  const loadImage = (ctx: CanvasRenderingContext2D) => {
    const modelImage = new Image();
    modelImage.onload = () => {
      // Pastikan gambar dimuat sebelum menggambar ke canvas
      ctx.drawImage(modelImage, 0, 0, ctx.canvas.width, ctx.canvas.height);

      // Gambar pakaian di atas model
      drawClothing(ctx, modelImage);
    };
    // Ganti 'path/to/model.svg' dengan path gambar model Anda
    modelImage.src = '/avatar/model.svg';
  };

  const drawClothing = (ctx: CanvasRenderingContext2D, modelImage: HTMLImageElement) => {
    const clothingImage = new Image();
    clothingImage.onload = () => {
      // Menggambar pakaian di atas model
      const sizeImg = 870;
      ctx.drawImage(clothingImage, ((ctx.canvas.width-sizeImg)/2), 800, sizeImg, sizeImg);
    };
    // Ganti 'path/to/clothing.png' dengan path gambar pakaian Anda
    clothingImage.src = '/baju/maid-atas.svg';
  };

  return <canvas ref={canvasRef} className='h-[450px] w-[140px] tall:h-full tall:w-[50%]' width={1400} height={4500} />;
};

export default CanvasComponent;
