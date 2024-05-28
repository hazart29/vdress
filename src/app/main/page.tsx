'use client'
import { useEffect, useState } from 'react';
import Image from "next/image";
import MenuButton from '@/app/component/menu-button';

export default function Home() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="flex flex-1 items-center justify-center min-h-screen">
            <div className={`relative flex items-center justify-center transition-opacity duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Image
                    src={'/ui/logo2.svg'}
                    alt="logo"
                    width={200}
                    height={0}
                    className="absolute top-1/2"
                    priority />
                <Image
                    src={'/ui/imgavaatar.svg'}
                    alt="avatar"
                    width={300}
                    height={1000}
                    priority />
            </div>
            <div className={`transition-opacity duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <MenuButton />
            </div>
        </div>
    );
}
