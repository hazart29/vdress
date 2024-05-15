'use client'
import React, { useRef, useEffect, useState } from 'react';
import ModalWardrobe from './modal-wardrobe';
import JSXImage from 'next/image';

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clothingImageSrc, setClothingImageSrc] = useState<string>('');
  const [top, setTop] = useState('/img_notfound.svg');
  const [bottom, setBottom] = useState('/img_notfound.svg');
  const [feet, setFeet] = useState('/img_notfound.svg');

  useEffect(() => {
    // Load image into canvas element
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    loadImage(ctx);

  }, []);

  useEffect(() => {
    if (clothingImageSrc !== '') {
      // Load image into canvas element
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!canvas || !ctx) return;

      loadImage(ctx);

      drawClothing(ctx, clothingImageSrc);
    }
  }, [clothingImageSrc]);

  const loadImage = (ctx: CanvasRenderingContext2D) => {
    const modelImage = new Image();
    modelImage.onload = () => {
      ctx.drawImage(modelImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
    };
    modelImage.src = '/avatar/model.svg';
  };

  const drawClothing = (ctx: CanvasRenderingContext2D, src: string) => {
    const clothingImage = new Image();
    clothingImage.onload = () => {
      const sizeImg = 870;
      ctx.drawImage(clothingImage, ((ctx.canvas.width - sizeImg) / 2), 800, sizeImg, sizeImg);
    };
    clothingImage.src = src;
  };

  const fetchGETClothingItem = async (type: any) => {
    if (type === null){
      type = 'top';
    }

    const playerId = localStorage.getItem('user');

    try {
      const response = await fetch('/api/clothing', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: playerId,
          type: type // Specify the type of clothing item
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      // Assuming the data structure returned contains a clothingImageUrl property
      setClothingImageSrc(data.source);
    } catch (error) {
      console.error('Error fetching clothing item:', error);
    }
  };

  const fetchPOSTClothingItem = async (type: any) => {
    try {
      const response = await fetch('/api/clothing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: 'player_id_here',
          source: 'item_name_here',
          type: type // Specify the type of clothing item
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setClothingImageSrc(data.clothingImageUrl);
    } catch (error) {
      console.error('Error fetching clothing item:', error);
    }
  };

  const openModal = (type: any) => {
    setIsModalOpen(true);
    fetchGETClothingItem(type)
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className='flex flex-1 h-full justify-center items-center'>
        <canvas ref={canvasRef} className='max-h-[450px] tall:s:max-h-[600px] talles:s:max-h-[650px] tallesmax:s:max-h-[750px]' width={1400} height={4500} />
      </div>
      <form onSubmit={fetchPOSTClothingItem} className='flex flex-none flex-col justify-center items-center gap-8 w-1/2 h-full text-gray-800'>
        <div id='top' onClick={() => openModal('top')} className='flex bg-white w-20 h-20 items-center justify-center'>
          <JSXImage src={top} alt="none" sizes='33vw' width={60} height={60} priority />
        </div>
        <div id='bottom' onClick={() => openModal('bottom')} className='flex bg-white w-20 h-20 items-center justify-center'>
          <JSXImage src={bottom} alt="none" sizes='33vw' width={60} height={60} priority />
        </div>
        <div id='feet' onClick={() => openModal('feet')} className='flex bg-white w-20 h-20 items-center justify-center'>
          <JSXImage src={feet} alt="none" sizes='33vw' width={60} height={60} priority />
        </div>

        <ModalWardrobe isOpen={isModalOpen} onClose={closeModal}>
          <div>fdfd</div>
        </ModalWardrobe>
      </form>
    </>
  );
};

export default CanvasComponent;
