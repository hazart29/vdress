'use client'
import React, { useRef, useEffect, useState } from 'react';
import ModalWardrobe from '@/app/component/ModalWardrobe';
import OutfitComponent from '@/app/component/OutfitComponent';
import BackButton from '@/app/component/BackButton';
import DownloadButton from '@/app/component/DownloadButton';
import CustomImage from 'next/image';
import OutfitImage from '@/app/component/OutfitImage';
import UnEquip from '@/app/component/UnEquip';

interface clothes {
  id: number;
  uid: number;
  a: string;
  b: string;
  c: string;
}

interface outfitData {
  id: number;
  uid: number;
  rarity: string;
  item_name: string;
  part_outfit: string;
}

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wardrobe, setWardrobe] = useState<clothes>();
  const [topImage, setTopImage] = useState('');
  const [botImage, setBotImage] = useState('');
  const [feetImage, setFeetImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [outfitData, setOutfitData] = useState<outfitData[]>([]);
  const loading = '/ui/iconVD.svg';
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    // load data wardrobe
    const fetchData = async () => {
      try {
        const response = await fetch('/api/outfit', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data[0])
        if (data) {
          setWardrobe(data[0]);
        } else {
          console.log('No data found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // Load image into canvas element
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    loadImage(ctx);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    console.log('ward: ', wardrobe)
    if (wardrobe) {
      setTopImage(`/outfit/A/${wardrobe.a}.png`);
      setBotImage(`/outfit/B/${wardrobe.b}.png`);
      setFeetImage(`/outfit/C/${wardrobe.c}.png`);
    } else {
      // Handle case when wardrobe is empty or null
      console.log('Wardrobe data is not available');
    }

    if (topImage && botImage && feetImage) {
      // Load image into canvas element
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!canvas || !ctx) return;

      loadImage(ctx);

      drawFeetClothing(ctx, feetImage);
      drawBottomClothing(ctx, botImage);
      drawTopClothing(ctx, topImage);

    } else {
      console.warn('No top image found');
    }
  }, [topImage, wardrobe]);

  const loadImage = (ctx: CanvasRenderingContext2D) => {
    setIsLoading(true);
    const modelImage = new Image();

    modelImage.onload = () => {
      // Dapatkan lebar dan tinggi gambar sebenarnya
      const imageWidth = modelImage.width;
      const imageHeight = modelImage.height;

      // Hitung faktor skala untuk menyesuaikan dengan canvas
      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;
      const scaleFactor = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);

      // Hitung lebar dan tinggi gambar baru setelah scaling
      const newWidth = imageWidth * scaleFactor;
      const newHeight = imageHeight * scaleFactor;

      // Hitung posisi tengah canvas
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      // Hitung posisi awal untuk menggambar gambar di tengah
      const startX = centerX - newWidth / 2;
      const startY = centerY - newHeight / 2;

      // Gambar gambar dengan posisi dan ukuran yang telah dihitung
      ctx.drawImage(modelImage, startX, startY, newWidth, newHeight);
    };

    modelImage.src = '/avatar/avatar.svg';
    setIsLoading(false);
  };

  const drawTopClothing = (ctx: CanvasRenderingContext2D, src: string) => {
    setIsLoading(true);
    const clothingImage = new Image();
    clothingImage.onload = () => {
      // Dapatkan lebar dan tinggi gambar sebenarnya
      const imageWidth = clothingImage.width;
      const imageHeight = clothingImage.height;

      // Hitung faktor skala untuk menyesuaikan dengan canvas
      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;
      const scaleFactor = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);

      // Hitung lebar dan tinggi gambar baru setelah scaling
      const newWidth = imageWidth * scaleFactor;
      const newHeight = imageHeight * scaleFactor;

      // Hitung posisi tengah canvas
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      // Hitung posisi awal untuk menggambar gambar di tengah
      const startX = centerX - newWidth / 2;
      const startY = centerY - newHeight / 2;

      ctx.drawImage(clothingImage, startX, startY, newWidth, newHeight);
    };
    clothingImage.src = src;
    setIsLoading(false);
  };

  const drawBottomClothing = (ctx: CanvasRenderingContext2D, src: string) => {
    setIsLoading(true);
    const clothingImage = new Image();
    clothingImage.onload = () => {
      // Dapatkan lebar dan tinggi gambar sebenarnya
      const imageWidth = clothingImage.width;
      const imageHeight = clothingImage.height;

      // Hitung faktor skala untuk menyesuaikan dengan canvas
      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;
      const scaleFactor = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);

      // Hitung lebar dan tinggi gambar baru setelah scaling
      const newWidth = imageWidth * scaleFactor;
      const newHeight = imageHeight * scaleFactor;

      // Hitung posisi tengah canvas
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      // Hitung posisi awal untuk menggambar gambar di tengah
      const startX = centerX - newWidth / 2;
      const startY = centerY - newHeight / 2;

      ctx.drawImage(clothingImage, startX, startY, newWidth, newHeight);
    };
    clothingImage.src = src;
    setIsLoading(false);
  };

  const drawFeetClothing = (ctx: CanvasRenderingContext2D, src: string) => {
    setIsLoading(true);
    const clothingImage = new Image();
    clothingImage.onload = () => {
      // Dapatkan lebar dan tinggi gambar sebenarnya
      const imageWidth = clothingImage.width;
      const imageHeight = clothingImage.height;

      // Hitung faktor skala untuk menyesuaikan dengan canvas
      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;
      const scaleFactor = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);

      // Hitung lebar dan tinggi gambar baru setelah scaling
      const newWidth = imageWidth * scaleFactor;
      const newHeight = imageHeight * scaleFactor;

      // Hitung posisi tengah canvas
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      // Hitung posisi awal untuk menggambar gambar di tengah
      const startX = centerX - newWidth / 2;
      const startY = centerY - newHeight / 2;

      ctx.drawImage(clothingImage, startX, startY, newWidth, newHeight);
    };
    clothingImage.src = src;
    setIsLoading(false);
  };

  const fetchOutfitItem = async (type: any) => {
    try {
      const response = await fetch('/api/inventory', {
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
      //setClothingImageSrc(data.clothingImageUrl);
    } catch (error) {
      console.error('Error fetching clothing item:', error);
    }
  };

  const getOutfitItem = async (type: string, userId: number) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          type: type // Specify the type of clothing item
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setOutfitData(data);
      console.log('outfit: ', outfitData)
    } catch (error) {
      console.error('Error fetching clothing item:', error);
    }
  }

  const openModal = (loc: string) => {
    setIsModalOpen(true);
    if (userId) {
      getOutfitItem(loc, Number(userId));
      console.log('outfit:', outfitData)
    } else {
      console.warn('user id not found!');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL(); // Mengonversi kanvas menjadi URL data gambar
    const a = document.createElement('a');
    a.href = url;
    a.download = 'avatar.png'; // Nama file saat diunduh
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // if (isLoading) {
  //   return <div className='absolute flex w-full h-full z-[999] top-0 left-0 justify-center items-center'><img src={loading} alt="none" width={40} height={40} className='animate-ping' /></div>;
  // }

  return (
    <>
      <div className={`relative flex w-screen h-screen justify-center items-center gap-10 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className='absolute flex flex-col gap-8 top-20 right-40 z-50 max-w-fit scale-125'>
          <BackButton />
          <DownloadButton onClick={handleDownload} />
        </div>
        <canvas id='avatar' ref={canvasRef} className={`transition-transform duration-1000 h-full transform ${isVisible ? 'scale-100' : 'scale-90'}`} width={2000} height={4000} />
        <form onSubmit={fetchOutfitItem} className={`flex flex-none flex-col justify-center items-center gap-8 max-w-fit h-full text-gray-800 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <OutfitComponent loc="top" src={topImage} openModal={() => openModal('top')} />
          <OutfitComponent loc="bottom" src={botImage} openModal={() => openModal('bottom')} />
          <OutfitComponent loc="feet" src={feetImage} openModal={() => openModal('feet')} />

          <ModalWardrobe isOpen={isModalOpen} onClose={closeModal}>
            <div className='flex flex-1 items-center justify-start p-2 select-none gap-3' >
              <UnEquip />
              {
                outfitData?.length > 0 ? (
                  outfitData?.map((item, index) => (
                    <div key={index}>
                      {item.part_outfit == 'top' && (
                        <>
                          <OutfitImage src={`/baju/${item.item_name}.svg`} />
                        </>
                      )}
                      {item.part_outfit == 'bottom' && (
                        <>
                          <OutfitImage src={`/celana/${item.item_name}.svg`} />
                        </>
                      )}
                      {item.part_outfit == 'feet' && (
                        <>
                          <OutfitImage src={`/sepatu/${item.item_name}.svg`} />
                        </>
                      )}
                    </div>
                  ))
                ) : outfitData.length === 0 ? (
                  <div>No outfit data available.</div>
                ) : (
                  <div>Loading item information...</div>
                )}
            </div>
          </ModalWardrobe>
        </form>
      </div>
    </>
  );
};

export default CanvasComponent;
