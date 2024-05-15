'use client'
import React, { useEffect, useRef, useState } from 'react';
import Modal from '../../component/modal';
import Image from 'next/image';
import Header from '@/app/component/header';

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

export default function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sumGacha, setSumGacha] = useState(0);
    const [data, setData] = useState<players | null>(null);
    const [dataPOST, setDataPOST] = useState<players | null>(null);
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

    const handleVideoEnd = () => {
        if (videoRef.current) {
            videoRef.current.style.display = 'none';
            pull(sumGacha);
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

            if (rand < incSSRProbability || (pity+1) >= 90) {
                return "SSR";
            } else if (rand < incSRProbability || (pity+1) % 10 === 0) {
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
    }

    const listGacha = (tenpull: any[]) => {
        const divDapat: any = document.getElementById('diDapat');
        divDapat.innerHTML = ''; // Clear previous results
        for (let i of tenpull) {
            if (i === "SSR") {
                divDapat.innerHTML += '<img src="" class="bg-yellow-400 w-24 lg:w-20 h-24 lg:h-20" alt="' + i + '" />';
            } else if (i === "SR") {
                divDapat.innerHTML += '<img src="" class="bg-purple-400 w-24 lg:w-20 h-24 lg:h-20" alt="' + i + '" />';
            } else {
                divDapat.innerHTML += '<img src="" class="bg-gray-300 w-24 lg:w-20 h-24 lg:h-20" alt="' + i + '" />';
            }
        }
    }

    const gacha = new GachaSystem();

    return (
        <div className='flex flex-col gap-2 w-full h-full px-4'>
            <div className="flex flex-col flex-1 bg-gradient-to-br from-white to-gray-300 rounded-lg p-4">
                <div className="relative overflow-hidden flex-1 bg-red-400 rounded-lg">
                    <Image src={banner} alt="none" sizes='33vw' fill priority />
                </div>
            </div>
            <div className="flex flex-none w-full bottom-0 gap-4 p-2 font-bold h-[13%] justify-center items-center">
                <button onClick={() => openModal(1)} type="button" className="rounded-full flex-1 h-full bg-gradient-to-br from-green-300 via-teal-400 to-emerald-500 text-green-700 hover:scale-110 transform ease-in-out focus:outline-none hover:ring hover:ring-white hover:text-white">1x</button>
                <button onClick={() => openModal(10)} type="button" className="rounded-full flex-1 h-full bg-gradient-to-br from-violet-300 via-purple-400 to-fuchsia-500 text-purple-700 hover:scale-110 transform ease-in-out focus:outline-none hover:ring hover:ring-white hover:text-white">10x</button>

                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <video ref={videoRef} id='video' onEnded={handleVideoEnd} className='flex absolute z-[999] bg-black left-0 top-0 w-auto h-screen' autoPlay muted>
                        <source src="/video/gacha.mp4" type="video/mp4" />
                    </video>
                    <div id='diDapat' className='flex flex-wrap w-full h-full justify-center items-center gap-1 p-2'></div>
                </Modal>
            </div>
        </div>
    );
};
