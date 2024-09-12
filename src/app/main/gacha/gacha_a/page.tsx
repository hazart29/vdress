'use client'
import React, { useEffect, useRef, useState } from 'react';
import style from './styles.module.css'
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import Modal from '@/app/component/modal';
import GenshinResource from '@/app/component/GenshinResource';
import ErrorAlert from '@/app/component/ErrorAlert';

interface InventoryItem {
    uid: number;
    rarity: string;
    item_name: string;
    part_outfit: string | null;
    date: string | null;
}

interface users {
    uid: number;
    username: string;
    password: string;
    email: string;
    name: string;
    primogems: number;
    pitycounter: number;
    rate_on: boolean;
    created_at: string;
    inventory: InventoryItem[];
}

interface users {
    users: users[];
}

interface pulledItem {
    id: number;
    item_name: string;
    part_outfit: string;
    rarity: string;
    rate_up: boolean;
    type: string;
}

const GenshinWishBanner = () => {
    const WishBanner = '/banner/banner_seifuku.webp';
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sumGacha, setSumGacha] = useState(0);
    const [data, setData] = useState<users | null>(null);
    const [pulledItem, setPulledItem] = useState<pulledItem | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const banner = '/banner/banner_seifuku.webp';
    const loading = '/ui/iconVD.svg';
    const userId = sessionStorage.getItem('userId');

    let baseSSRProbability: number = 0.006;
    let baseSRProbability: number = 0.051;
    let incSSRProbability: number = 0;
    let incSRProbability: number = 0;
    let pity: number = 0;

    useEffect(() => {
        async function getData(userId: number) {
            const response = await fetch('/api/db', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                return <ErrorAlert message='terjadi kesalahan muat ulang kembali' />
            }
            const reqData = await response.json();
            setData(reqData);
        }

        getData(Number(userId));
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
        const data = { userId, typeFetch, dataFetch };

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
            let pulledCharacterOrItem = await this.pullCharacterOrItem(rarity);

            if (pulledCharacterOrItem) {
                console.log('pulled : ', pulledCharacterOrItem.rarity);

                const dataFetch = { rarity, item: pulledCharacterOrItem };
                console.log('datafetch: ', dataFetch)
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
                return "SSR";
            } else {
                return "R";
            }
        }

        async pullCharacterOrItem(rarity: string) {
            let pulledCharacterOrItem: any;
            const dataFetch = { rarity };
            let data, randomItem;
            if (rarity === "SSR") {
                const rateON = await fetchApiGacha('getRateOn', null);
                if (rateON) {
                    data = await fetchApiGacha('getLimitedItem', dataFetch);
                    const keys = Object.keys(data);
                    const randomKey = keys[Math.floor(Math.random() * keys.length)];
                    const randomItem = data[randomKey];
                    console.log(randomItem);
                    setPulledItem(randomItem);
                    pulledCharacterOrItem = randomItem;
                    await fetchApiGacha('setRateOff', null);
                } else {
                    data = await fetchApiGacha('getGachaItem', dataFetch);
                    const keys = Object.keys(data);
                    const randomKey = keys[Math.floor(Math.random() * keys.length)];
                    const randomItem = data[randomKey];
                    console.log(randomItem);
                    setPulledItem(randomItem);
                    pulledCharacterOrItem = randomItem;
                    if (randomItem.type === "standard") {
                        await fetchApiGacha('setRateOn', null);
                    }
                }
            } else if (rarity === "SR") {
                const data = await fetchApiGacha('getGachaItem', dataFetch);
                console.log('data item gacha : ', data);
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
            //await fetchApiGacha('incPity', dataFetch1);

            const primo = (a * 160);
            const dataFetch2 = { primogems: primo };
            //await fetchApiGacha('updatePrimo', dataFetch2);
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
        <>
            <div className='flex flex-1 gap-4'>
                <div className='flex flex-none w-[12%] gap-8 justify-end'>
                    <div className='bg-slate-900 flex flex-none w-1/2'>a</div>
                </div>
                <div className='flex flex-1 flex-col'>
                    <div className='flex p-4 items-center justify-between'>
                        <p className='font-bold text-lg'>Genshin Wish</p>
                        <div className='flex gap-2 text-xs'>
                            <GenshinResource />
                        </div>
                    </div>
                    <div className='flex flex-1 rounded-md justify-end overflow-hidden'>
                        <img src={WishBanner} alt='Wish Banner' className='flex-none w-3/4 h-full bg-white rounded-md mr-20' />
                    </div>
                    <div className='flex justify-between py-4 px-2 max-h-fit text-slate-900'>
                        <div className='flex gap-2 text-sm'>
                            <button className='bg-gray-300 py-1 px-10 rounded-full border border-gray-600 hover:bg-gray-400 shadow-md'>Shop</button>
                            <button className='bg-gray-300 py-1 px-10 rounded-full border border-gray-600 hover:bg-gray-400 shadow-md'>Details</button>
                            <button className='bg-gray-300 py-1 px-10 rounded-full border border-gray-600 hover:bg-gray-400 shadow-md'>History</button>
                        </div>
                        <div className='fixed bottom-0 right-0 p-4 flex gap-4 text-4xl'>
                            <button onClick={() => openModal(1)} className='rounded-full py-4 px-10 shadow-md border border-yellow-500 hover:bg-yellow-300 bg-white'>Wish 1x</button>
                            <button onClick={() => openModal(10)} className='rounded-full py-4 px-10 shadow-md border border-yellow-500 hover:bg-yellow-300 bg-white'>Wish 10x</button>
                        </div>
                    </div>

                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <div id='diDapat' className='flex flex-wrap w-full h-full justify-center items-center gap-1 p-4'></div>
                        <video ref={videoRef} id='video' onEnded={handleVideoEnd} className='flex absolute z-[999] bg-black left-0 top-0 w-auto h-screen' autoPlay muted>
                            <source src="/video/gacha.mp4" type="video/mp4" />
                        </video>
                    </Modal>
                </div>
            </div>
        </>
    );

}

export default GenshinWishBanner;