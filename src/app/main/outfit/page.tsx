'use client'
import React, { useRef, useEffect, useState } from 'react';
import ModalWardrobe from '@/app/component/ModalWardrobe';
import OutfitComponent from '@/app/component/OutfitComponent';
import BackButton from '@/app/component/BackButton';
import DownloadButton from '@/app/component/DownloadButton';
import CustomImage from 'next/image';
import OutfitImage from '@/app/component/OutfitImage';
import UnEquip from '@/app/component/UnEquip';
import { Inventory, Suited } from '@/app/interface';

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const avatarRef = useRef<HTMLCanvasElement>(null);
  const topRef = useRef<HTMLCanvasElement>(null);
  const bottomRef = useRef<HTMLCanvasElement>(null);
  const feetRef = useRef<HTMLCanvasElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wardrobe, setWardrobe] = useState<Suited>();
  const [topImage, setTopImage] = useState('');
  const [botImage, setBotImage] = useState('');
  const [feetImage, setFeetImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [outfitData, setOutfitData] = useState<Inventory[]>([]);
  const loading = '/ui/iconVD.svg';
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (wardrobe) {
      setTopImage(`/outfit/A/${wardrobe.a}.svg`);
      setBotImage(`/outfit/B/${wardrobe.b}.svg`);
      setFeetImage(`/outfit/C/${wardrobe.c}.svg`);
    } else {
      // Handle case when wardrobe is empty or null
      console.log('Wardrobe data is not available');
    }

    if (topImage && botImage && feetImage) {
      // Load image into canvas elements
      const cAvatar = avatarRef.current;
      const catx = cAvatar?.getContext('2d');
      const cTop = topRef.current;
      const cttx = cTop?.getContext('2d');
      const cBottom = bottomRef.current;
      const cbtx = cBottom?.getContext('2d');
      const cFeet = feetRef.current;
      const cftx = cFeet?.getContext('2d');

      if (!cAvatar || !catx || !cTop || !cttx || !cBottom || !cbtx || !cFeet || !cftx) {
        return;
      }

      setIsLoading(true);
      loadAvatar(catx);
      setIsVisible(true);

      // Draw clothing items on their respective canvases
      drawClothingItem(cttx, topImage);
      drawClothingItem(cbtx, botImage);
      drawClothingItem(cftx, feetImage);

      setIsLoading(false);
    } else {
      console.warn('No outif image found');
    }
  }, [wardrobe, topImage, botImage, feetImage]);

  // load data suited
  const fetchData = async () => {
    try {
      const response = await fetch('/api/outfit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      //console.log(data[0])
      if (data) {
        setWardrobe(data[0]);
      } else {
        console.log('No data found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const loadAvatar = (ctx: CanvasRenderingContext2D) => {
    const modelImage = new Image();

    modelImage.onload = () => {
      // Get actual width and height of the image
      const imageWidth = modelImage.width;
      const imageHeight = modelImage.height;

      // Calculate scale factor to fit the canvas
      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;
      const scaleFactor = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);

      // Calculate new width and height after scaling
      const newWidth = imageWidth * scaleFactor;
      const newHeight = imageHeight * scaleFactor;

      // Calculate center position of the canvas
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      // Calculate starting position to draw the image in the center
      const startX = centerX - newWidth / 2;
      const startY = centerY - newHeight / 2;

      // Draw the image with calculated position and size
      ctx.drawImage(modelImage, startX, startY, newWidth, newHeight);
    };

    modelImage.src = '/avatar/avatar.svg';
  };

  const drawClothingItem = (ctx: CanvasRenderingContext2D, src: string) => {
    const clothingImage = new Image();
    clothingImage.onload = () => {
      // Get actual width and height of the image
      const imageWidth = clothingImage.width;
      const imageHeight = clothingImage.height;

      // Calculate scale factor to fit the canvas
      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;
      const scaleFactor = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);

      // Calculate new width and height after scaling
      const newWidth = imageWidth * scaleFactor;
      const newHeight = imageHeight * scaleFactor;

      // Calculate center position of the canvas
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      // Calculate starting position to draw the image in the center
      const startX = centerX - newWidth / 2;
      const startY = centerY - newHeight / 2;

      // Ubah mode compositing untuk membuat efek overlay
      ctx.globalCompositeOperation = 'destination-over';

      // Draw the image with calculated position and size
      ctx.drawImage(clothingImage, startX, startY, newWidth, newHeight);
    };
    clothingImage.src = src;
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
      //console.log('outfit: ', outfitData)
    } catch (error) {
      console.error('Error fetching clothing item:', error);
    }
  }

  const openModal = (loc: string) => {
    setIsModalOpen(true);
    if (userId) {
      getOutfitItem(loc, Number(userId));
      //console.log('outfit:', outfitData)
    } else {
      console.warn('user id not found!');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDownload = () => {
    const cAvatar = avatarRef.current;
    const cTop = topRef.current;
    const cBottom = bottomRef.current;
    const cFeet = feetRef.current;

    if (!cAvatar || !cTop || !cBottom || !cFeet) return;

    // Buat canvas baru dengan ukuran yang sama dengan canvas lainnya
    const combinedCanvas = document.createElement('canvas');
    const ctx = combinedCanvas.getContext('2d');
    combinedCanvas.width = cAvatar.width;
    combinedCanvas.height = cAvatar.height;

    // Gambar canvas-canvas ke canvas gabungan
    if (ctx) {
      ctx.drawImage(cAvatar, 0, 0);
      ctx.drawImage(cFeet, 0, 0);
      ctx.drawImage(cBottom, 0, 0);
      ctx.drawImage(cTop, 0, 0);
    }

    // Unduh gambar gabungan
    const url = combinedCanvas.toDataURL();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'avatar.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // if (isLoading) {
  //   return <div className='absolute flex w-full h-full z-[999] top-0 left-0 justify-center items-center'><img src={loading} alt="none" width={40} height={40} className='animate-ping' /></div>;
  // }

  return (
    <>
      <div className="relative flex w-screen h-screen justify-center items-center gap-10 transition-opacity duration-1000">
        <div className="absolute flex flex-col gap-8 md:top-20 top-50 md:right-40 right-20 z-50 max-w-fit scale-125">
          <BackButton href='/main' />
          <DownloadButton onClick={handleDownload} />
        </div>
        {isLoading ? (
          <div className="absolute flex w-full h-full z-[999] top-0 left-0 justify-center items-center">
            <img src={loading} alt="none" width={40} height={40} className="animate-ping" />
          </div>
        ) : (
          <div className="relative flex flex-none w-1/4 flex-shrink transition-transform duration-1000 h-full transform">
            <canvas id="avatar" ref={avatarRef} className="absolute left-0 h-full z-0" width={2000} height={4000} />
            <canvas id="oFeet" ref={feetRef} className="absolute inset-0 h-full z-10" width={2000} height={4000} />
            <canvas id="oBottom" ref={bottomRef} className="absolute inset-0 h-full z-20" width={2000} height={4000} />
            <canvas id="oTop" ref={topRef} className="absolute inset-0 h-full z-30" width={2000} height={4000} />
          </div>
        )}

        <form onSubmit={fetchOutfitItem} className="flex flex-none flex-col justify-center items-center gap-8 max-w-fit h-full text-gray-800 transition-opacity duration-1000">
          <OutfitComponent loc="top" src={`/icons/${topImage}`} openModal={() => openModal('top')} />
          <OutfitComponent loc="bottom" src={`/icons/${botImage}`} openModal={() => openModal('bottom')} />
          <OutfitComponent loc="feet" src={`/icons/${feetImage}`} openModal={() => openModal('feet')} />

          <ModalWardrobe isOpen={isModalOpen} onClose={closeModal}>
            <div className='flex flex-1 items-center justify-start p-2 select-none gap-3' >
              <UnEquip />
              {
                outfitData?.length > 0 ? (
                  outfitData?.map((item, index) => (
                    <div key={index}>
                      {item.part_outfit.toLowerCase() == 'top' && (
                        <>
                          <OutfitImage src={`/outfit/${item.layer.toLocaleUpperCase()}/${item.item_name}.svg`} />
                        </>
                      )}
                      {item.part_outfit.toLowerCase() == 'bottom' && (
                        <>
                          <OutfitImage src={`outfit/${item.layer.toLocaleUpperCase()}/${item.item_name}.svg`} />
                        </>
                      )}
                      {item.part_outfit.toLowerCase() == 'feet' && (
                        <>
                          <OutfitImage src={`outfit/${item.layer.toLocaleUpperCase()}/${item.item_name}.svg`} />
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
