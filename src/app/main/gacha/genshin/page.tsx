'use client'
import React, { useEffect, useRef, useState } from 'react';
import style from './styles.module.css'
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import Modal from '@/app/component/modal';
import GenshinResource from '@/app/component/GenshinResource';

interface InventoryItem {
    player_id: number;
    rarity: string;
    item_name: string;
    source: string | null;
    alt: string | null;
    type: string | null;
    date: string | null;
}

interface Players {
    id: number;
    username: string;
    password: string;
    email: string;
    name: string;
    primogems: number;
    pitycounter: number;
    date: string;
    inventory: InventoryItem[];
}

interface players {
    players: Players[];
}

const GenshinWishBanner = () => {
    const WishBanner = 'nonse';
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sumGacha, setSumGacha] = useState(0);
    const [data, setData] = useState<players | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const banner = '/banner/banner_seifuku.webp';
    const loading = '/ui/iconVD.svg';

    let baseSSRProbability: number = 0.006;
    let baseSRProbability: number = 0.051;
    let incSSRProbability: number = 0;
    let incSRProbability: number = 0;
    let pity: number = 0;

    useEffect(() => {
        async function getData() {
            const user = localStorage.getItem('user');

            const response = await fetch('/api/db', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user }),
            });

            if (!response.ok) {
                throw new Error('data failed');
            }
            const reqData = await response.json();
            setData(reqData);
        }

        getData();
    }, []);

    const handleVideoEnd = async () => {
        if (videoRef.current) {
            videoRef.current.style.display = 'none';
            await pull(sumGacha);
        }
    };

    if (!data) {
        return <div className='absolute flex w-full h-full z-[999] top-0 left-0 justify-center items-center'><Image src={loading} alt="none" width={40} height={40} className='animate-ping' /></div>;
    }

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openModal = (a: number) => {
        if (Array.isArray(data) && data[0].primogems < (a === 1 ? 160 : 1600)) {
            setIsModalOpen(false);
            alert('not enough primo');
        } else {
            setIsModalOpen(true);
            setSumGacha(a);
        }
    };

    async function fetchApiGacha(typeFetch: string, dataFetch: any) {
        const user = localStorage.getItem('user');
        const data = { user, typeFetch, dataFetch };

        const response = await fetch('/api/gacha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        return responseData;
    }

    class GachaSystem {
        async makeWish() {
            let rarity = this.calculateRarity();
            let pulledCharacterOrItem = this.pullCharacterOrItem(rarity);

            if (pulledCharacterOrItem) {
                const dataFetch = { rarity, item: pulledCharacterOrItem };
                await fetchApiGacha('upInven', dataFetch);
            }

            if (rarity === "SSR") {
                pity = 0;
            } else {
                pity += 1;
            }

            return pulledCharacterOrItem;
        }

        calculateRarity() {
            let rand = Math.random();

            if (rand < incSSRProbability || (pity + 1) >= 90) {
                return "SSR";
            } else if (rand < incSRProbability || (pity + 1) % 10 === 0) {
                return "SR";
            } else {
                return "R";
            }
        }

        pullCharacterOrItem(rarity: string) {
            let pulledCharacterOrItem: string;
            if (rarity === "SSR") {
                pulledCharacterOrItem = "SSR";
            } else if (rarity === "SR") {
                pulledCharacterOrItem = "SR";
            } else {
                pulledCharacterOrItem = "R";
            }
            return pulledCharacterOrItem;
        }
    }

    async function pull(a: number) {
        let result: any;
        let tenpull = [];
        incSRProbability = baseSRProbability;
        incSSRProbability = baseSSRProbability;
        setIsLoading(true);

        try {
            const dataPOST = await fetchApiGacha('getPity', null);

            if (Array.isArray(dataPOST) && dataPOST.length > 0 && typeof dataPOST[0].pitycounter === 'number') {
                pity = dataPOST[0].pitycounter;
            } else {
                console.error('Invalid dataPOST structure:', dataPOST);
            }

            for (let i = 0; i < a; i++) {
                result = await gacha.makeWish();
                incSRProbability += 0.0087;
                incSSRProbability += 0.00111;
                tenpull[i] = result;
                console.log(`Wish ${i + 1}:`, result);
            }

            const dataFetch1 = { incPity: pity };
            await fetchApiGacha('incPity', dataFetch1);

            const primo = (a * 160);
            const dataFetch2 = { primogems: primo };
            await fetchApiGacha('updatePrimo', dataFetch2);
            listGacha(tenpull);
        } catch (error) {
            console.error('Error fetching API:', error);
        }

        setIsLoading(false);

    }

    const listGacha = async (tenpull: any[]) => {
        const divDapat: any = document.getElementById('diDapat');
        divDapat.innerHTML = ''; // Clear previous results
        for (let i = 0; i < tenpull.length; i++) {
            const currentItem = tenpull[i];
            let bgColorClass = '';
            if (currentItem === "SSR") {
                bgColorClass = 'bg-yellow-400';
            } else if (currentItem === "SR") {
                bgColorClass = 'bg-purple-400';
            } else {
                bgColorClass = 'bg-gray-300';
            }
            const imgElement = document.createElement('img');
            imgElement.src = `/items_gacha/${currentItem}.svg`; // Add your image source here
            imgElement.className = `w-24 h-24 ${bgColorClass} opacity-0 transition-opacity duration-500`; // Add opacity transition
            imgElement.alt = currentItem;
            divDapat.appendChild(imgElement);
    
            // Triggering reflow before adding the animation class to start animation
            void imgElement.offsetWidth;
            imgElement.classList.add('opacity-100');
    
            // Render each item with a slight delay
            await new Promise(resolve => setTimeout(resolve, 500)); // Adjust the delay time as needed
        }
    }
    

    const gacha = new GachaSystem();


    return (
        <div className={`relative flex flex-1 items-center justify-center ml-24 flex-col ${style.container}`}>
            <div className='fixed inset-0 top-0 flex max-h-fit items-center ml-24 justify-between p-8'>
                <p className='font-bold text-lg'>Genshin Wish</p>
                <div className='flex gap-2 text-xs'>
                    <GenshinResource />
                </div>
            </div>
            <div className='flex flex-none items-center bg-white w-4/5 h-[75%] justify-center ml-20 rounded-md'>
                <img src={WishBanner} alt='Wish Banner' />
            </div>
            <div className='fixed w-full bottom-0 flex max-h-fit items-end justify-between p-8 text-slate-900'>
                <div className='flex gap-2 text-sm ml-36'>
                    <button className='bg-gray-300 py-1 px-10 rounded-full border border-gray-600 hover:bg-gray-400 shadow-md'>Shop</button>
                    <button className='bg-gray-300 py-1 px-10 rounded-full border border-gray-600 hover:bg-gray-400 shadow-md'>Details</button>
                    <button className='bg-gray-300 py-1 px-10 rounded-full border border-gray-600 hover:bg-gray-400 shadow-md'>History</button>
                </div>
                <div className='mr-20 flex gap-4 text-4xl'>
                    <button onClick={() => openModal(1)} className='rounded-full py-4 px-10 shadow-md border border-yellow-500 hover:bg-yellow-300 bg-white'>Wish 1x</button>
                    <button onClick={() => openModal(10)} className='rounded-full py-4 px-10 shadow-md border border-yellow-500 hover:bg-yellow-300 bg-white'>Wish 10x</button>
                </div>
                
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div id='diDapat' className='flex flex-wrap w-full h-full justify-center items-center gap-1 p-4'></div>
                    <video ref={videoRef} id='video' onEnded={handleVideoEnd} className='flex absolute z-[999] bg-black left-0 top-0 w-auto h-screen' autoPlay muted>
                        <source src="/video/gacha.mp4" type="video/mp4" />
                    </video>
                </Modal>
            </div>
        </div>
    );
}

export default GenshinWishBanner;