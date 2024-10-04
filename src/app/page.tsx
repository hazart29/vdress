'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LoginForm from './component/login-form';
import PWAInstallPrompt from './component/PWAInstallPompt';

function Home() {
  const icon = '/ui/iconVD.svg';
  const [isloading, setLoading] = useState(true);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);


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

    if ((window.matchMedia('(display-mode: fullscreen)').matches) || (window.matchMedia('(display-mode: standalone)').matches)) {
       setIsInstalled(true);
    }


  }, []);

  if (isloading) {
    return <div className='absolute flex w-full h-full z-[999] top-0 left-0 justify-center items-center'><Image src={icon} alt="none" width={40} height={40} className='animate-ping' /></div>;
  }

  if (!isInstalled) {
  return <PWAInstallPrompt />;
  }  

  return (
    <div className='flex flex-col flex-1 justify-center items-center gap-8'>
      <Image src="/ui/logo2.svg" alt="logo" className='pointer-events-none select-none' width={200} height={70} priority />
      <LoginForm />
    </div>
  );
}

export default Home;