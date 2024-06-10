import React, { useState, useEffect } from 'react';
import Image from 'next/image'

const PWAInstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState<boolean>(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        }

        window.location.reload();
    };

    if (isInstalled) {
        return null;
    }

    return (
        <div className="install-prompt select-none bg-white flex flex-1 h-full justify-center items-center">
            <Image src={'ui/imgavaatar.svg'} width={250} height={0} alt='avatar' className='pointer-events-none' />
            <span className='flex flex-col gap-4 flex-none w-1/6'>
                <p className='text-slate-700 text-2xl font-bold'>Install this application to access its content!.</p>
                <button onClick={handleInstallClick} className='bg-blue-500 hover:bg-blue-400 text-white animate-pulse hover:animate-none font-bold max-w-fit transition-all duration-150 ease-in-out hover:scale-110 rounded-sm py-2 px-4'>Install</button>
            </span>
        </div>
    );
};

export default PWAInstallPrompt;
