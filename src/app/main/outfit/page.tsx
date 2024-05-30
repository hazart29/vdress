'use client'
import React, { useRef, useEffect, useState } from 'react';
import ModalWardrobe from '@/app/component/modal-wardrobe';
import JSXImage from 'next/image';
import Button from '@/app/component/Button';
import { useRouter } from 'next/navigation';
import OutfitComponent from '@/app/component/OutfitComponent';

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clothingImageSrc, setClothingImageSrc] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const topImage = '/img_notfound.svg';
  const botImage = '/img_notfound.svg';
  const feetImage = '/img_notfound.svg';

  useEffect(() => {
    // Load image into canvas element
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    loadImage(ctx);
    setIsVisible(true);
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
    if (type === null) {
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

  const openModal = (loc: any) => {
    setIsModalOpen(true);
    fetchGETClothingItem(loc);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleButton = () => {
    router.back();
  };

  return (
    <>
      <div className={`relative flex w-screen h-screen justify-center items-center gap-10 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className='absolute top-4 left-4 z-50 max-w-fit'>
          <button onClick={handleButton} className='bg-blue-500 text-4xl text-white font-bold border border-white hover:bg-white hover:text-blue-500 pr-4 pb-4 pl-12 pt-4 -skew-x-3 fixed -top-2 -left-5'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          </button>
        </div>
        <canvas ref={canvasRef} className={`max-h-[450px] tall:s:max-h-[600px] talles:s:max-h-[650px] tallesmax:s:max-h-[750px] transition-transform duration-1000 transform ${isVisible ? 'scale-100' : 'scale-90'}`} width={1400} height={4500} />
        <form onSubmit={fetchPOSTClothingItem} className={`flex flex-none flex-col justify-center items-center gap-8 max-w-fit h-full text-gray-800 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <OutfitComponent loc="top" src={topImage} openModal={openModal} />
          <OutfitComponent loc="bottom" src={botImage} openModal={openModal} />
          <OutfitComponent loc="feet" src={feetImage} openModal={openModal} />

          <ModalWardrobe isOpen={isModalOpen} onClose={closeModal}>
            <div>fdfd</div>
          </ModalWardrobe>
        </form>
      </div>
    </>
  );
};

export default CanvasComponent;
