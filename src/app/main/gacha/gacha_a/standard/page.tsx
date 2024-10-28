'use client'
import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import BoxItem from "@/app/component/gacha/BoxItem";
import GachaButton from "@/app/component/gacha/GachaButton";
import { Users, GachaItem } from "@/app/interface";
import Modal from '@/app/component/modal';
import ErrorAlert from "@/app/component/ErrorAlert";

const Standard_A = () => {
    const [userData, setUserData] = useState<Users | null>(null);
    const [gachaItem, setGachaItem] = useState<GachaItem[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInsufficientModalOpen, setIsInsufficientModalOpen] = useState(false); // State for insufficient gems modal
    const videoRef = useRef<HTMLVideoElement>(null);
    const [pulledItem, setPulledItem] = useState<GachaItem | null>(null);

    const [showExchangeModal, setShowExchangeModal] = useState(false);
    const [exchangeAmount, setExchangeAmount] = useState(0);

    let baseSSRProbability: number = 0.006;
    let baseSRProbability: number = 0.051;
    let ProbabilitySSRNow: number;
    let ProbabilitySRNow: number;
    let pity: number;

    useEffect(() => {
        fetchGachaApi("getUserData", null);
    }, []); // Empty dependency array ensures this runs once on component mount

    const fetchGachaApi = async (typeFetch: string, dataFetch?: any) => {
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


    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeInsufficientModal = () => {
        setIsInsufficientModalOpen(false);
    };

    const openModal = async (a: number) => {
        if (!userData || !userData.user_resources || userData.user_resources.length === 0) {
            console.error('User data or user resources not available');
            return;
        }

        await fetchGachaApi("getUserData", null);
        console.log('ge: ', userData.user_resources[0].shimmering_essence);

        const essenceCost = a === 1 ? 1 : 10;

        if (userData.user_resources[0].shimmering_essence < essenceCost) {
            const gemsNeeded = essenceCost * 160;
            if (userData.user_resources[0].glamour_gems < gemsNeeded) {
                setIsInsufficientModalOpen(true);
                return;
            } else {
                // Tampilkan modal konfirmasi penukaran
                setShowExchangeModal(true);
                setExchangeAmount(essenceCost);
            }
        } else {
            // Jika essence cukup, langsung jalankan gacha
            setIsModalOpen(true);
            try {
                const pulledItems = await pull(a);
                setGachaItem(pulledItems);
            } catch (error) {
                console.error('Error during gacha pull:', error);
            }
        }
        await fetchGachaApi("getUserData", null);
    };

    const handleExchange = async () => {
        try {
            await fetchGachaApi('exchangeGemsForEssence', {
                glamour_gems: (exchangeAmount * 160).toString(),
                shimmering_essence: exchangeAmount.toString()
            });
            await fetchGachaApi("getUserData", null);

            setShowExchangeModal(false); // Tutup modal konfirmasi 

            // Jalankan gacha setelah penukaran berhasil
            setIsModalOpen(true);
            try {
                const pulledItems = await pull(exchangeAmount === 1 ? 1 : 10);
                setGachaItem(pulledItems);
            } catch (error) {
                console.error('Error during gacha pull:', error);
            }

            await fetchGachaApi("getUserData", null);

        } catch (error) {
            console.error('Error exchanging gems:', error);
        }
    }

    const handleVideoEnd = async () => {
        const videoDiv = document.getElementById('video');
        if (videoRef.current) {
            videoDiv?.classList.add('hidden');
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
                        await fetchGachaApi('upInven', dataFetch);
                        await fetchGachaApi('upHistoryA', dataFetch);
                        // Tambahkan glamour_dust jika rarity R
                        if (rarity === "R") {
                            await fetchGachaApi('updateGlamourDust', { glamour_dust: '15' });
                        } else if (rarity === "SR") {
                            await fetchGachaApi('updateFashionTokens', { fashion_tokens: '5' });
                        } else if (rarity === "SSR") {
                            await fetchGachaApi('updateFashionTokens', { fashion_tokens: '25' });
                        }
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
                const isRateUp = await fetchGachaApi('getRateOn');

                if (isRateUp && rarity === "SSR") {
                    // Rate ON: Ambil item limited
                    data = await fetchGachaApi('getRateUpItem', dataFetch);
                } else {
                    // Rate OFF: 50:50 limited atau tidak (untuk SSR dan SR)
                    if (Math.random() < 0.5) {
                        data = await fetchGachaApi('getRateUpItem', dataFetch);
                    } else {
                        data = await fetchGachaApi('getRateOffItem', dataFetch);
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
                        await fetchGachaApi('setRateOff');
                    } else {
                        await fetchGachaApi('setRateOn');
                    }
                }
            } else { // Untuk rarity R
                data = await fetchGachaApi('getGachaItem', dataFetch);

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

        try {
            await fetchGachaApi('getPity');

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
            await fetchGachaApi('incPity', { incPity: pity });

            // Update glamour_gems di server (pastikan endpoint API Anda mengharapkan string)
            const GlimmeringEssence = (a).toString();
            await fetchGachaApi('updateshimmering_essence', { shimmering_essence: GlimmeringEssence });

            return tenpull;

        } catch (error) {
            console.error('Error fetching API:', error);
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

    }

    const gacha = new GachaSystem();

    return (
        <>
            <div className="flex flex-1 lg:pt-10 pt-4 bg-gacha1 bg-cover lg:blur-md blur-sm animate-pulse" />
            <div className="absolute w-full h-full flex flex-1 pt-10 bg-gradient-to-b from-transparent via-transparent to-black to-100% z-10" />
            <div className="absolute w-full h-full flex flex-1 z-20 lg:pt-20 pt-14">
                <div className="flex flex-none flex-shrink w-2/5">
                    <div className="relative h-full w-full hover:scale-105 transition-transform duration-200">
                        <Image
                            id="mikoImg"
                            src={"/banner/avatar/limited.svg"}
                            alt={"miko"}
                            layout="fill"
                            objectFit="contain"
                            objectPosition="bottom"
                        />
                    </div>
                </div>
                <div className="relative flex flex-1">
                    <div className="absolute z-40 flex flex-1 w-full h-full flex-col lg:gap-4 gap-2">
                        <div className="absolute flex items-center justify-end px-12 transform -skew-x-12 bg-gradient-to-r from-transparent via-red-600 to-red-600 to-100% bg-opacity-50 -right-10 transition-opacity duration-1000">
                            <p className="lg:text-8xl text-5xl text-end font-black transform skew-x-12 text-white pr-12">JAPANESE MIKO</p>
                        </div>

                        {/* transparent div */}
                        <div className="flex items-end justify-end px-12 transform -skew-x-12 bg-transparent">
                            <p className="lg:text-8xl text-5xl text-end font-black transform skew-x-12 text-transparent pr-12">JAPANESE MIKO</p>
                        </div>
                        {/* transparent div */}

                        <div className="flex flex-none items-start justify-end pr-16">
                            <p className="text-end lg:text-sm text-[9px] lg:w-5/6 w-full">Rasakan keagungan kuil dengan gacha Miko terbaru! Dapatkan kostum gadis kuil yang cantik dengan jubah putih bersih dan rok merah menyala, lengkap dengan aksesoris seperti gohei dan ofuda. Raih kesempatan untuk memanggil roh keberuntungan dan keindahan! Jangan lewatkan kesempatan langka ini, tersedia untuk waktu terbatas!</p>
                        </div>
                        <div className="flex flex-none flex-col gap-12">
                            <div className="flex flex-1 items-center justify-end gap-8">
                                <BoxItem imageUrl={"/icons/outfit/A/mikoA.svg"} altText={"miko a"} />
                                <BoxItem imageUrl={"/icons/outfit/B/mikoB.svg"} altText={"miko b"} />
                                <BoxItem imageUrl={"/icons/outfit/C/mikoC.svg"} altText={"miko c"} />
                                <p className="pr-16 flex animate-pulse text-yellow-400">Rate Up!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Gacha Button */}
            <div className="absolute flex flex-col gap-4 lg:right-16 lg:bottom-16 right-8 bottom-6 z-50">
                <GachaButton onClick={openModal} />
            </div>

            {/* Gacha Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="relative w-full h-full flex flex-1 flex-col items-center justify-center">
                    <div id="video" className="fixed flex flex-1 inset-0 z-50 bg-black justify-center items-center">
                        <video
                            ref={videoRef}
                            id="video"
                            onEnded={handleVideoEnd}
                            autoPlay
                            muted
                        >
                            <source className="bg-black" src="/video/gacha.mp4" type="video/mp4" />
                        </video>
                    </div>
                    <div className="flex flex-1 flex-col w-full h-full bg-white p-8">
                        <div id="diDapat" className="bg-red-300 flex flex-1 flex-wrap w-full justify-center items-center gap-1 p-4 animate-pulse">
                            {/* Result will be displayed here */}
                        </div>
                        <div id="addResource" className="bg-yellow-200 flex flex-none flex-warp w-full justify-center items-center gap-1 p-4 animate-pulse">
                            {/* Resource will be displayed here */}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 focus:outline-none font-bold text-2xl text-gray-400 animate-pulse"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Insufficient Gems Modal */}
            <Modal isOpen={isInsufficientModalOpen} onClose={closeInsufficientModal}>
                <div className="p-4 flex flex-col flex-none w-2/5 justify-center items-center bg-white rounded-lg py-8">
                    <p className="text-black">Glamour Gems tidak cukup!</p>
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={closeInsufficientModal}
                            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal Konfirmasi Penukaran */}
            <Modal isOpen={showExchangeModal} onClose={() => setShowExchangeModal(false)}>
                <div className="p-4 flex flex-col flex-none w-2/5 justify-center items-center bg-white rounded-lg py-8">
                    <p className="text-black mb-4 text-center">
                        Glimmering Essence tidak cukup! <br />
                        Tukarkan <span className="text-amber-400">{exchangeAmount * 160} Glamour Gems</span> dengan <span className="text-blue-400">{exchangeAmount} Glimmering Essence</span>?
                    </p>
                    <div className="flex gap-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleExchange}

                        >
                            Ya, Tukar
                        </button>
                        <button
                            className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setShowExchangeModal(false)}
                        >
                            Tidak
                        </button>
                    </div>
                </div>
            </Modal>

        </>

    )
}

export default Standard_A;