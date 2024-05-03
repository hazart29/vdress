'use client'

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LoginForm from './component/login-form';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

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
  const icon = '/ui/iconVD.svg';
  const [isloading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', {
        scope: '.'
      }).then(function (registration) {
        // Registration was successful
        console.log('Laravel PWA: ServiceWorker registration successful with scope: ', registration.scope);
        setLoading(false)
      }, function (err) {
        // registration failed :(
        console.log('Laravel PWA: ServiceWorker registration failed: ', err);
      });
    }

    
  }, []);


  if (isloading) {
    return <div className='absolute flex w-full h-full z-[999] top-0 left-0 justify-center items-center'><Image src={icon} alt="none" width={40} height={40} className='animate-ping' /></div>;
  }

  return (
    <div className='flex flex-1 flex-col items-center justify-start h-full'>
      <div className='flex flex-col flex-1 py-10'>
        <div className='flex flex-col flex-1 w-full justify-center items-center gap-8'>
          <Image src="/ui/logo.svg" alt="logo" className='w-2/3' sizes='10vw' width={40} height={70} priority />
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Home;