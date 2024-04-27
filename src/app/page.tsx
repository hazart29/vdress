'use client'

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Inventory {
  SSR: string[];
  SR: string[];
  R: string[];
}

interface Players {
  id: number;
  name: string;
  primogems: number;
  inventory: Inventory;
  gacha: string[];
  pityCounter: number;
}

interface PlayerData {
  players: Players;
}

function Home() {
  const [data, setData] = useState<Players | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/dataPlayer.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData: PlayerData = await response.json();
        setData(jsonData.players);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  console.log(data);
  
  return (
    <div className='flex flex-1 flex-col items-center justify-start h-full'>
            <div className='flex flex-col flex-1 py-40'>
                <div className='flex flex-col flex-1 w-full justify-between items-center'>
                    <Image src="/ui/logo.svg" alt="logo" className='w-2/3' sizes='10vw' width={40} height={70} priority/>
                    <Link href="/main">
                        <p className="transform hover:scale-110 ease-in-out hover:text-orange-700 flex rounded-lg bg-gradient-to-r hover:from-orange-400 from-orange-500 hover:to-red-400 to-red-500 p-4 text-2xl text-orange-300 font-bold">Play</p>
                    </Link>
                </div>
            </div>
        </div>
  );
}

export default Home;