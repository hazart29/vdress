'use client'
import React, { useEffect, useRef, useState } from "react";
import BackButton from "@/app/component/BackButton";
import CurrencyResource from "@/app/component/CurrencyResource";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Limited_A from "./limited/page";
import Standard_A from "./standard/page";
import GachaButton from "@/app/component/GachaButton";
import Modal from '@/app/component/modal';
import MoreBox from "@/app/component/gacha/MoreBox";
import { Users, GachaItem } from "@/app/interface";
import ErrorAlert from "@/app/component/ErrorAlert";
import Image from "next/image";
import loading from '../../../public/img/loading.svg'

interface PityResponse {
    pity: number;
}

export default function GachaALayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [userData, setUserData] = useState<Users | null>(null);
    const [gachaItem, setGachaItem] = useState<GachaItem[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sumGacha, setSumGacha] = useState(0);
    const [isInsufficientModalOpen, setIsInsufficientModalOpen] = useState(false); // State for insufficient gems modal
    const userId = sessionStorage.getItem('userId');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [pulledItem, setPulledItem] = useState<GachaItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    let baseSSRProbability: number = 0.006;
    let baseSRProbability: number = 0.051;
    let ProbabilitySSRNow: number;
    let ProbabilitySRNow: number;
    let pity: number;

    // State untuk menyimpan tab yang aktif
    const [activeTab, setActiveTab] = useState<string>('limited');

    useEffect(() => {
        // Mengambil nilai tab dari URL saat komponen dimuat
        const tabFromUrl = searchParams.get('tab') || 'limited';
        setActiveTab(tabFromUrl);
    }, [searchParams]); // Jalankan useEffect saat searchParams berubah

    useEffect(() => {
        fetchUserResourceApi("getUserData", null);
    }, []); // Empty dependency array ensures this runs once on component mount

    const fetchUserResourceApi = async (typeFetch: string, dataFetch?: any) => {
        try {
            const userId = sessionStorage.getItem('userId'); // Pastikan userId tersedia

            // Bangun URL dengan query parameters
            const url = new URL('/api/gacha', window.location.origin);
            url.searchParams.set('userId', userId!);
            url.searchParams.set('typeFetch', typeFetch);

            // Tambahkan dataFetch sebagai query parameters jika ada
            if (dataFetch) {
                for (const key in dataFetch) {
                    url.searchParams.set(key, dataFetch[key]);
                }
            }

            const response = await fetch(url.toString(), {
                method: 'POST', // Gunakan metode POST karena API Anda sekarang hanya menerima POST
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Tangani response berdasarkan typeFetch
            switch (typeFetch) {
                case "getUserData":
                    const reqData: Users = await response.json();
                    setUserData(reqData);
                    break;
                case "getPity":
                    const pityData = await response.json();
                    pity = Number(pityData[0].pity); // Konversi ke number
                    break;
                case "getRateUpItem":
                    const RateUpItems = await response.json();
                    return RateUpItems;
                case "getRateOn":
                    const isRateOn = await response.json();
                    return isRateOn;
                default:
                    const responseData = await response.json();
                    return responseData;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return <ErrorAlert message='Terjadi kesalahan. Muat ulang kembali.' />;
        }
    }

    const handleTabChange = (tab: string) => {
        // Memperbarui URL dan state saat tab berubah
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('tab', tab);
        router.push(`${pathname}?${newSearchParams.toString()}`);
        setActiveTab(tab);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeInsufficientModal = () => {
        setIsInsufficientModalOpen(false);
    };

    const openModal = (a: number) => {
        if (!userData || !userData.user_resources || userData.user_resources.length === 0) {
            // Tangani kasus di mana userData atau user_resources belum tersedia
            console.error('User data or user resources not available');
            return; // Atau tampilkan pesan error
        }

        if (userData.user_resources[0].glamour_gems < (a === 1 ? 160 : 1600)) {
            setIsInsufficientModalOpen(true);
        } else {
            setIsModalOpen(true);
            pull(a)
                .then((pulledItems: GachaItem[]) => { // <-- Tambahkan tipe data di sini
                    // Simpan hasil pull di state
                    setGachaItem(pulledItems);
                })
                .catch(error => {
                    console.error('Error during gacha pull:', error);
                    // Handle error, misalnya tampilkan pesan error
                });
        }
    };

    const handleVideoEnd = async () => {
        if (videoRef.current) {
            videoRef.current.style.display = 'none';
            if (gachaItem) {
                listGacha(gachaItem);
            }
        }
    };

    class GachaSystem {
        async makeWish() {
            try {
                let rarity = this.calculateRarity();
                let pulledCharacterOrItem = await this.pullCharacterOrItem(rarity);

                if (pulledCharacterOrItem) {
                    const dataFetch = {
                        rarity: pulledCharacterOrItem.rarity,
                        item_name: pulledCharacterOrItem.item_name,
                        part_outfit: pulledCharacterOrItem.part_outfit,
                        layer: pulledCharacterOrItem.layer,
                        gacha_type: 'Whisper of Silk'
                    };

                    try {
                        await fetchUserResourceApi('upInven', dataFetch);
                        await fetchUserResourceApi('upHistoryA', dataFetch);
                    } catch (error) {
                        console.error('Error updating inventory or history:', error);
                    }
                }

                if (rarity === "SSR") {
                    pity = 0;
                } else {
                    pity += 1;
                }

                return pulledCharacterOrItem;
            } catch (error) {
                console.error('Error in makeWish:', error);
                return null;
            }
        }

        calculateRarity() {
            let rand = Math.random();
            console.log(rand, ':', ProbabilitySSRNow)

            if (rand < ProbabilitySSRNow || (pity + 1) >= 90) {
                return "SSR";
            } else if (rand < ProbabilitySRNow || (pity + 1) % 10 === 0) {
                return "SR";
            } else {
                return "R";
            }
        }

        async pullCharacterOrItem(rarity: string) {
            let pulledCharacterOrItem: any;
            const dataFetch = { rarity };
            let data;

            if (rarity === "SSR" || rarity === "SR") {
                const isRateUp = await fetchUserResourceApi('getRateOn');

                if (isRateUp && rarity === "SSR") {
                    // Rate ON: Ambil item limited
                    data = await fetchUserResourceApi('getRateUpItem', dataFetch);
                } else {
                    // Rate OFF: 50:50 limited atau tidak (untuk SSR dan SR)
                    if (Math.random() < 0.5) {
                        data = await fetchUserResourceApi('getRateUpItem', dataFetch);
                    } else {
                        data = await fetchUserResourceApi('getRateOffItem', dataFetch);
                    }
                }

                // Pilih item dari data yang sudah difilter
                const keys = Object.keys(data);
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                const randomItem = data[randomKey];
                console.log('rand item : ', randomItem);
                setPulledItem(randomItem);
                pulledCharacterOrItem = randomItem;

                // Update is_rate (khusus SSR)
                if (rarity === "SSR") {
                    if (randomItem.islimited) {
                        await fetchUserResourceApi('setRateOff');
                    } else {
                        await fetchUserResourceApi('setRateOn');
                    }
                }
            } else { // Untuk rarity R
                data = await fetchUserResourceApi('getGachaItem', dataFetch);

                // Pilih item dari data 
                const keys = Object.keys(data);
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                const randomItem = data[randomKey];
                console.log('rand item : ', randomItem);
                setPulledItem(randomItem);
                pulledCharacterOrItem = randomItem;
            }

            console.log('pulled : ', pulledCharacterOrItem)

            return pulledCharacterOrItem;
        }
    }

    async function pull(a: number): Promise<GachaItem[]> {
        let tenpull: GachaItem[] = [];
        setIsLoading(true);

        try {
            await fetchUserResourceApi('getPity');

            for (let i = 0; i < a; i++) {
                // Hitung probabilitas SR dan SSR berdasarkan pity saat ini
                ProbabilitySRNow = baseSRProbability + ((pity % 10) * 0.0087);
                ProbabilitySSRNow = baseSSRProbability + (pity * 0.00111);
                console.log('ProbabilitySRNow', ProbabilitySRNow)

                const result = await gacha.makeWish();
                // Gunakan if-else untuk incSRProbability
                if (ProbabilitySRNow >= 1) {
                    ProbabilitySSRNow = baseSRProbability;
                }

                // Gunakan if-else untuk incSSRProbability
                if (ProbabilitySSRNow >= 1) {
                    ProbabilitySSRNow = baseSSRProbability;
                }

                tenpull[i] = result;
            }

            console.log('pity after loop:', pity);

            // Update pity di server
            await fetchUserResourceApi('incPity', { incPity: pity });

            // Update glamour_gems di server (pastikan endpoint API Anda mengharapkan string)
            const glamourGems = (a * 160).toString();
            await fetchUserResourceApi('updatePrimo', { glamour_gems: glamourGems });

            return tenpull;

        } catch (error) {
            console.error('Error fetching API:', error);
            setIsLoading(false);
            return [];
        }
    }

    const listGacha = async (tenpull: any[]) => {
        console.log('tenpull : ', tenpull);
        const divDapat: any = document.getElementById('diDapat');
        divDapat.innerHTML = '';
        for (let i = 0; i < tenpull.length; i++) {
            const currentItem = tenpull[i];
            let bgColorClass = '';
            if (currentItem.rarity.trim() === "SSR") {
                bgColorClass = 'bg-yellow-400';
            } else if (currentItem.rarity.trim() === "SR") {
                bgColorClass = 'bg-purple-400';
            } else {
                bgColorClass = 'bg-gray-300';
            }
            const imgElement = document.createElement('img');
            imgElement.src = `/items_gacha/${currentItem.item_name}.svg`;
            imgElement.className = `w-24 h-24 ${bgColorClass} opacity-0 transition-opacity duration-500`;
            imgElement.alt = currentItem.item_name;
            divDapat.appendChild(imgElement);

            void imgElement.offsetWidth;
            imgElement.classList.add('opacity-100');

            await new Promise(resolve => setTimeout(resolve, 300));
        }

        setIsLoading(false);
    }

    const gacha = new GachaSystem();

    return (
        <div className="relative flex flex-col w-full h-screen">
            <div className="relative flex flex-1 flex-col">
                <div className="absolute w-full p-6 lg:h-20 h-16 z-[60] flex flex-row items-center inset-0 top-0">
                    <div className="flex flex-1 justify-start gap-4 items-center text-xs lg:text-base">
                        <BackButton href="/main" />
                        <p className="font-bold">{activeTab === 'standar' ? 'Symphony of Silk' : 'Whispers of Silk'}</p>
                    </div>
                    <div className="flex flex-1 justify-end items-center">
                        <CurrencyResource activeTab={activeTab} />
                    </div>
                </div>

                {activeTab === 'standar' ? <Standard_A /> : <Limited_A />}
            </div>
            <div className="absolute flex flex-col gap-4 -left-8 lg:bottom-36 bottom-16 z-50">
                <button
                    className={`flex flex-1 lg:p-8 p-4 shadow-black shadow-xl transform skew-x-12 pl-12 
                    ${activeTab === 'limited' ? 'bg-white opacity-70 text-black' : 'bg-black opacity-50'} 
                    hover:bg-white hover:text-black hover:opacity-100 transition-colors duration-300`}
                    onClick={() => handleTabChange('limited')}
                >
                    <p className="transform -skew-x-12 lg:text-2xl text-xs font-bold">Japanese Miko</p>
                </button>
                <button
                    className={`flex flex-1 lg:p-8 p-4  shadow-black shadow-xl transform skew-x-12 pl-12 
                    ${activeTab === 'standar' ? 'bg-white opacity-70 text-black' : 'bg-black opacity-50'} 
                    hover:bg-white hover:text-black hover:opacity-100 transition-colors duration-300`}
                    onClick={() => handleTabChange('standar')}
                >
                    <p className="transform -skew-x-12 lg:text-2xl text-xs font-bold">Symphony of Silk</p>
                </button>
            </div>
            <div className="absolute flex flex-col gap-4 lg:right-16 lg:bottom-16 right-8 bottom-6 z-50">
                <GachaButton onClick={openModal} />
            </div>
            <div className="absolute flex flex-col gap-4 lg:left-44 lg:bottom-16 left-10 bottom-4 z-[70]">
                <MoreBox />
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="relative w-full h-full flex items-center justify-center">
                    <video
                        ref={videoRef}
                        id='video'
                        onEnded={handleVideoEnd}
                        className='w-auto h-screen absolute'
                        autoPlay
                        muted
                    >
                        <source src="/video/gacha.mp4" type="video/mp4" />
                    </video>
                    <div id='diDapat' className='flex flex-wrap w-full justify-center items-center gap-1 p-4'>asas</div>
                </div>
            </Modal>

            {/* Modal for insufficient gems */}
            <Modal isOpen={isInsufficientModalOpen} onClose={closeInsufficientModal}>
                <div className="p-4 flex justify-center items-center bg-white">
                    <p className="text-black">Glamour Gems tidak cukup!</p>
                    {/* You can add more content or styling here */}
                </div>
            </Modal>
        </div>
    )
}