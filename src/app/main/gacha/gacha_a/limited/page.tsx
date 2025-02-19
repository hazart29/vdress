'use client'
import React, { useEffect, useState, useMemo, useCallback } from "react"
import Image from "next/image"
import dynamic from 'next/dynamic'; // Import next/dynamic
import BoxItem from "@/app/component/gacha/BoxItem";
import GachaButton from "@/app/component/gacha/GachaButton";
import { Users, GachaItem } from "@/app/interface";
import Modal from '@/app/component/modal';
import sjcl from 'sjcl';
import { useRefresh } from "@/app/component/RefreshContext";
import Loading from "@/app/component/Loading";

// --- Constants (Move to top for clarity) ---
const PASSWORD = 'virtualdressing';  // Replace with a strong password!
const BASE_SSR_PROBABILITY = 0.006;
const BASE_SR_PROBABILITY = 0.051;
const CONSOLIDATED_SSR_PROBABILITY = 0.016;
const CONSOLIDATED_SR_PROBABILITY = 0.13;
const SOFT_PITY = 74;
const HARD_PITY = 90;
const SSR_DUPLICATE_TOKENS = 25;
const SR_DUPLICATE_TOKENS = 5;
const SSR_NEW_ITEM_TOKENS = 10;
const SR_NEW_ITEM_TOKENS = 2;
const GLAMOUR_DUST_AMOUNT = 15;
const ESSENCE_TO_GEMS_RATIO = 160;
const ACTIVE_TAB = 'limited';

interface ResourceInfo {
    dust: string;
    tokens: string;
}

// --- Helper Function: Combined Random Number Generator (Concise Version)---
function createCombinedRNG(seed: number) {
    let state = seed;

    const mcrng = () => {
        const a = 1664525;
        const c = 1013904223;
        const m = 2 ** 32;
        state = (a * state + c) % m;
        return state / m;
    };

    const xorshift32 = () => {
        state ^= state << 13;
        state ^= state >> 17;
        state ^= state << 5;
        return state;
    };

    return () => {
        const mcrngOutput = mcrng();
        return ((xorshift32() ^ mcrngOutput) >>> 0) / 2 ** 32;
    };
}

// --- API Function (Centralized and Improved) ---
async function fetchGachaApi<T>(typeFetch: string, dataFetch?: any, retries = 3): Promise<T> {
    const uid = localStorage.getItem('uid');
    if (!uid) {
        throw new Error('UID not found in localStorage');
    }

    const requestBody = {
        uid,
        typeFetch,
        ...(dataFetch || {})
    };

    const encryptedData = sjcl.encrypt(PASSWORD, JSON.stringify(requestBody));

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch('/api/gacha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ encryptedData }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response not ok (status ${response.status}): ${errorText}`);
            }

            const responseData = await response.json();
            return responseData as T;
        } catch (error: any) {
            console.error(`Error fetching (attempt ${i + 1}):`, error);
            if (i === retries - 1) {
                throw error; // Re-throw after last retry
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * (2 ** i))); // Exponential backoff
        }
    }
    throw new Error('Fetch retries exceeded'); // Should never get here, but good for completeness
}

// --- Gacha System Class (Optimized) ---
class GachaSystem {
    private random: () => number;
    private srPity: number = 0;
    public itemsToUpload: GachaItem[] = [];
    public fashionToken: number = 0;
    public glamourDust: number = 0;

    constructor(seed: number, private isRateUp: boolean, private pity: number, private localGachaData: GachaItem[]) {
        this.random = createCombinedRNG(seed);
    }

    private calculateProbabilities() {
        const pityProgress = this.pity / SOFT_PITY;
        const probabilitySSRNow = this.pity >= HARD_PITY ? 1 :
            this.pity >= SOFT_PITY ? CONSOLIDATED_SSR_PROBABILITY + (1 - CONSOLIDATED_SSR_PROBABILITY) * (1 - Math.exp(-5 * (this.pity - SOFT_PITY) / (HARD_PITY - SOFT_PITY))) :
                BASE_SSR_PROBABILITY + (CONSOLIDATED_SSR_PROBABILITY - BASE_SSR_PROBABILITY) * pityProgress;

        const probabilitySRNow = this.srPity >= 9 ? 1 : BASE_SR_PROBABILITY + (CONSOLIDATED_SR_PROBABILITY - BASE_SR_PROBABILITY) * (this.srPity / 9);
        return { probabilitySSRNow, probabilitySRNow };
    }

    private calculateRarity() {
        const { probabilitySSRNow, probabilitySRNow } = this.calculateProbabilities();
        const rand = this.random();
        if (rand < probabilitySSRNow || this.pity + 1 >= HARD_PITY) return "SSR";
        if (rand < probabilitySRNow || (this.srPity + 1) % 10 === 0) return "SR";
        return "R";
    }

    private async pullItem(rarity: string): Promise<GachaItem | null> {
        let availableItems = this.localGachaData.filter(item => item.rarity === rarity);

        if ((rarity === "SSR" || rarity === "SR")) {
            const rateUpItems = availableItems.filter(item => item.rate_up);
            const rateOffItems = availableItems.filter(item => !item.rate_up);
            availableItems = this.isRateUp ? rateUpItems : (this.random() < 0.5 ? rateOffItems : rateUpItems);
            if (!availableItems.length) availableItems = this.localGachaData.filter(item => item.rarity === rarity);
        }

        const randomItem = availableItems[Math.floor(this.random() * availableItems.length)];
        return randomItem; // No need to check for null, handle it in makeWish
    }

    private isDuplicateItem(item: GachaItem, inventory: GachaItem[]): boolean {
        return inventory.some(inventoryItem => inventoryItem.item_name === item.item_name);
    }

    private handleDuplicate(item: GachaItem) {
        const tokens = item.rarity === "SSR" ? SSR_DUPLICATE_TOKENS : (item.rarity === "SR" ? SR_DUPLICATE_TOKENS : 0);
        this.fashionToken += tokens;
    }

    private resetSSR() { this.pity = 0; }
    private resetSR() { this.srPity = this.srPity % 10; }
    private incrementPity() { this.pity += 1; this.srPity += 1; }

    // Public method to perform a single wish
    public async makeWish(inventory: GachaItem[]): Promise<GachaItem | null> {
        const rarity = this.calculateRarity();
        const pulledItem = await this.pullItem(rarity);

        if (!pulledItem) return null; // Handle the case where no item is pulled

        const isDuplicate = this.isDuplicateItem(pulledItem, inventory);

        if (!isDuplicate) {
            this.itemsToUpload.push(pulledItem);
            this.fashionToken += rarity === "SSR" ? SSR_NEW_ITEM_TOKENS : (rarity === "SR" ? SR_NEW_ITEM_TOKENS : 0);
        } else {
            this.handleDuplicate(pulledItem);
        }

        if (rarity === "R") this.glamourDust += GLAMOUR_DUST_AMOUNT;

        if (rarity === "SSR") {
            this.isRateUp = !pulledItem.islimited;
            this.resetSSR();
        } else if (rarity === "SR") {
            this.incrementPity();
            this.resetSR();
        } else {
            this.incrementPity();
        }
        return pulledItem;
    }
    public getPity(): number {
        return this.pity;
    }
    public getIsRateUp(): boolean {
        return this.isRateUp;
    }
}

// --- Dynamically Imported Components (for Code Splitting) ---
// Wrap heavy components with next/dynamic
const DynamicBoxItem = dynamic(() => Promise.resolve(BoxItem), { ssr: false });
const DynamicGachaButton = dynamic(() => Promise.resolve(GachaButton), { ssr: false });
const DynamicModal = dynamic(() => Promise.resolve(Modal), { ssr: false });

// --- Main Component ---
const Limited_A = () => {
    const [userData, setUserData] = useState<Users | null>(null);
    const [localGachaData, setLocalGachaData] = useState<GachaItem[]>([]);
    const [pulledItems, setPulledItems] = useState<GachaItem[]>([]);
    const [resourceInfo, setResourceInfo] = useState<ResourceInfo[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInsufficientModalOpen, setIsInsufficientModalOpen] = useState(false);
    const [showExchangeModal, setShowExchangeModal] = useState(false);
    const [exchangeAmount, setExchangeAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { refresh } = useRefresh();

    // --- Memoized values and callbacks ---

    // Use useMemo to create the gacha system *only* when necessary
    const gachaSystem = useMemo(() => {
        if (userData && localGachaData.length > 0) {
            return new GachaSystem(Date.now(), !!userData.user_resources[0]?.is_rate, userData.user_resources[0].pity, localGachaData);
        }
        return null; // Return null if data isn't ready
    }, [userData, localGachaData]);


    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setPulledItems([]);
        setResourceInfo([]);
        refresh();
    }, [refresh]);

    const closeInsufficientModal = useCallback(() => {
        setIsInsufficientModalOpen(false);
    }, []);

    // --- Data Fetching (Optimized with Promise.all) ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [userDataResult, gachaItemsResult]: any = await Promise.all([
                    fetchGachaApi<Users>("getUserData"),
                    fetchGachaApi("getAllGachaItems"),
                ]);
                console.log("gacha item: ", gachaItemsResult)
                setUserData(userDataResult);
                setLocalGachaData(gachaItemsResult.gachaItem);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [refresh]); // Depend on refresh to re-fetch when needed

    // --- Gacha Pull Logic (using helper function) ---

    const performPull = async (pullCount: number): Promise<GachaItem[]> => {
        if (!gachaSystem) return []; // Don't attempt to pull if gachaSystem isn't ready
        let newPulledItems: GachaItem[] = [];

        const inventory: any = userData?.inventory || []; // Get inventory *once*

        for (let i = 0; i < pullCount; i++) {
            const item = await gachaSystem.makeWish(inventory);
            if (item) {
                newPulledItems.push(item);
            }
        }

        // Batch updates (all at once)
        if (gachaSystem.itemsToUpload.length > 0) await uploadInventory(gachaSystem.itemsToUpload);
        if (gachaSystem.glamourDust !== 0) await updateGlamourDust(gachaSystem.glamourDust);
        if (gachaSystem.fashionToken !== 0) await updateFashionToken(gachaSystem.fashionToken);

        await fetchGachaApi('incPity', { incPity: gachaSystem.getPity(), type: 'limited' });
        await fetchGachaApi('updateEssence', { essence: pullCount.toString(), type: 'limited' });
        await updateHistory(newPulledItems);

        // Reset gacha system variables *after* API calls
        gachaSystem.itemsToUpload = [];
        gachaSystem.glamourDust = 0;
        gachaSystem.fashionToken = 0;

        return newPulledItems;
    };


    const openModal = async (pullCount: number) => {
        if (!userData?.user_resources?.length) {
            console.error('User data or user resources not available');
            return;
        }

        const essenceCost = pullCount;
        const gemsNeeded = essenceCost * ESSENCE_TO_GEMS_RATIO;

        if (userData.user_resources[0].glimmering_essence < essenceCost) {
            if (userData.user_resources[0].glamour_gems < gemsNeeded) {
                setIsInsufficientModalOpen(true);
                return;
            }
            setShowExchangeModal(true);
            setExchangeAmount(essenceCost);
            return;
        }

        setIsLoading(true);
        try {
            const newPulledItems = await performPull(pullCount);
            setPulledItems(newPulledItems); // Update pulled items
            if (userData && localGachaData.length > 0) {
                listGacha(newPulledItems)
            }
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error during gacha pull:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExchange = async () => {
        setIsLoading(true);
        try {
            await fetchGachaApi('exchangeGemsForEssence', {
                type: 'glimmering_essence',
                glamour_gems: (exchangeAmount * ESSENCE_TO_GEMS_RATIO).toString(),
                glimmering_essence: exchangeAmount.toString()
            });

            setShowExchangeModal(false);
            //refresh user data
            const userDataResult = await fetchGachaApi<Users>("getUserData");
            setUserData(userDataResult);
            //after refresh, do a pull
            openModal(exchangeAmount)
        } catch (error) {
            console.error('Error exchanging gems:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Helper Functions for Updates (No Changes Needed) ---
    async function updateHistory(items: GachaItem[]) {
        if (items.length === 0) return; // Don't update if no items
        try {
            const dataFetch = items.map(item => ({
                rarity: item.rarity,
                item_name: item.item_name,
                part_outfit: item.part_outfit,
                gacha_type: 'Whispers_of_Silk'
            }));
            await fetchGachaApi('batchUpHistory', { items: dataFetch });
        } catch (error) {
            console.error('Error updating history:', error);
        }
    }

    async function updateGlamourDust(amount: number) {
        if (amount === 0) return;
        try { await fetchGachaApi('updateGlamourDust', { glamour_dust: amount }); }
        catch (error) { console.error('Error updating glamour dust:', error); }
    }

    async function updateFashionToken(amount: number) {
        if (amount === 0) return;
        try { await fetchGachaApi('updateFashionTokens', { fashion_tokens: amount }); }
        catch (error) { console.error('Error updating fashion tokens:', error); }
    }

    async function uploadInventory(items: GachaItem[]) {
        if (items.length === 0) return; // Don't upload if no items
        try {
            const dataFetch = items.map(item => ({
                rarity: item.rarity,
                item_name: item.item_name,
                part_outfit: item.part_outfit,
                layer: item.layer,
                stat: item.stat,
                power: item.power,
                gacha_type: 'Whisper_of_Silk',
            }));
            await fetchGachaApi('batchUpInven', { items: dataFetch });
        } catch (error) {
            console.error('Error uploading inventory:', error);
        }
    }

    const sortPulledItems = useCallback((pulledItems: GachaItem[]) => {
        return [...pulledItems].sort((a, b) => { // Create a copy before sorting
            const rarityOrder = { R: 0, SR: 1, SSR: 2 };
            return rarityOrder[b.rarity as keyof typeof rarityOrder] - rarityOrder[a.rarity as keyof typeof rarityOrder];
        });
    }, []);

    const listGacha = useCallback(async (tenpull: GachaItem[]) => {

        const sortedTenpull = sortPulledItems(tenpull);
        setPulledItems(sortedTenpull); // Use functional update

        const currentInventory = userData?.inventory || [];
        const newResourceInfo = tenpull.map((item) => {
            const rarity = item.rarity.trim();
            const isDuplicate = currentInventory.some(inventoryItem => inventoryItem.item_name === item.item_name);

            return {
                dust: rarity === "R" ? '+15' : '',
                tokens: rarity === "SR"
                    ? (isDuplicate ? '+5' : '+2')
                    : (rarity === "SSR" ? (isDuplicate ? '+25' : '+10') : ''),
            };
        }).filter(resource => resource.dust !== '' || resource.tokens !== '');

        setResourceInfo(newResourceInfo); // Use functional update
    }, [userData?.inventory, sortPulledItems]); // Add dependencies

    // Removed:  gacha is now created in useMemo.  No need for it here.

    return (
        <>
            {isLoading && (
                <Loading />
            )}
            {!isLoading && ( // Render only when not loading
                <>
                    <div className="flex flex-1 lg:pt-10 pt-4 bg-gacha1 bg-cover lg:blur-md blur-sm animate-pulse" />
                    <div className="absolute w-full h-full flex flex-1 pt-10 bg-gradient-to-b from-transparent via-transparent to-black to-100% z-10" />
                    <div className="absolute w-full h-full flex flex-1 z-20 lg:pt-20 pt-14">
                        <div className="flex flex-none flex-shrink w-2/5">
                            <div className="relative h-full w-full transition-transform duration-200">
                                <div className="absolute flex justify-end w-full h-full -bottom-32 -right-10">
                                    <Image
                                        id="MikoImg"
                                        src={"/banner/avatar/limitedA.png"}
                                        alt={"Miko"}
                                        layout="fill"
                                        objectFit="contain"
                                        objectPosition="bottom"
                                        className="scale-150"
                                        priority
                                    />
                                </div>
                                <div className="absolute flex justify-end w-full h-full -bottom-32 -right-52">
                                    <Image
                                        id="MikoImg"
                                        src={"/banner/avatar/limitedB.png"}
                                        alt={"Miko"}
                                        layout="fill"
                                        objectFit="contain"
                                        objectPosition="bottom"
                                        className="scale-95"
                                        priority
                                    />
                                </div>
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
                                <div className="flex flex-1 flex-col gap-12">
                                    <div className="flex flex-1 items-end justify-end gap-8 pr-16">
                                        <DynamicBoxItem imageUrl={"/icons/outfit/A/MikoA.png"} altText={"Miko a"} />
                                        <DynamicBoxItem imageUrl={"/icons/outfit/B/MikoB.png"} altText={"Miko b"} />
                                        <DynamicBoxItem imageUrl={"/icons/outfit/C/MikoC.png"} altText={"Miko c"} />
                                        <p className=" flex flex-none h-20 justify-center items-center animate-pulse text-yellow-400">Rate Up!</p>
                                    </div>
                                    <div className="flex flex-none flex-col gap-4 pr-16 pb-10 justify-center">
                                        <DynamicGachaButton onClick={openModal} activeTab={ACTIVE_TAB} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gacha Modal */}
                    <DynamicModal isOpen={isModalOpen} onClose={closeModal}>
                        <div className="relative w-full h-full flex flex-1 flex-col items-center justify-center">
                            <div className="flex flex-1 flex-col w-full h-full justify-between bg-white p-8">
                                <div className="flex flex-1 flex-col flex-wrap items-center justify-center">

                                    <div id="diDapat" className="flex flex-none flex-row w-full justify-center items-center gap-1">
                                        {pulledItems.map((item, index) => (
                                            <div
                                                key={index}
                                                className={`
                                                    ${item.rarity.trim() === "SSR" ? 'bg-gradient-to-b from-transparent from-0% via-amber-500 via-50% to-transparent to-100%' :
                                                        item.rarity.trim() === "SR" ? 'bg-gradient-to-b from-transparent from-0% via-purple-800 via-50% to-transparent to-100%' :
                                                            'bg-gradient-to-b from-transparent from-0% via-gray-400 via-50% to-transparent to-100%'}
                                                    h-64 flex items-center justify-center overflow-hidden opacity-100 p-1
                                                `}
                                                style={{ animationDelay: `${index * 0.2}s` }}
                                                onAnimationEnd={(e) => {
                                                    // On animation end, set opacity to 100
                                                    (e.target as HTMLDivElement).classList.add('opacity-100', 'scale-100');
                                                }}
                                            >
                                                <img
                                                    src={`/icons/outfit/${item.layer.toLocaleUpperCase()}/${item.item_name}.png`}
                                                    alt={item.item_name}
                                                    className={`w-24 h-24 object-cover `}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div id="addResource" className="flex flex-none flex-row w-full justify-center items-center gap-1 animate-pulse text-[8px]">
                                        {resourceInfo.length > 0 && resourceInfo.map((resource, index) => (
                                            <p key={index} className="flex flex-none flex-row gap-2 justify-center items-center text-black w-[105px] p-1 font-bold">
                                                {resource.dust !== '' && (
                                                    <>
                                                        <Image src={"/icons/currency/glamour_dust.png"} alt={"glamour_dust"} width={12} height={12} />
                                                        {resource.dust}
                                                    </>
                                                )}
                                                {resource.tokens !== '' && (
                                                    <>
                                                        <Image src={"/icons/currency/fashion_tokens.png"} alt={"fashion_tokens"} width={12} height={12} />
                                                        {resource.tokens}
                                                    </>
                                                )}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        aria-label="button"
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 focus:outline-none font-bold text-2xl text-gray-400 animate-pulse"
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            </div>

                        </div>
                    </DynamicModal>

                    {/* Insufficient Gems Modal */}
                    <DynamicModal isOpen={isInsufficientModalOpen} onClose={closeInsufficientModal}>
                        <div className="p-4 flex flex-col flex-none w-2/5 justify-center items-center bg-white rounded-lg py-8">
                            <p className="text-black">Glamour Gems tidak cukup!</p>
                            <div className="flex justify-end mt-4">
                                <button
                                    aria-label="button"
                                    type="button"
                                    onClick={closeInsufficientModal}
                                    className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </DynamicModal>

                    {/* Modal Konfirmasi Penukaran */}
                    <DynamicModal isOpen={showExchangeModal} onClose={() => setShowExchangeModal(false)}>
                        <div className="p-4 flex flex-col flex-none w-2/5 justify-center items-center bg-white rounded-lg py-8">
                            <p className="text-black mb-4 text-center">
                                Glimmering Essence tidak cukup! <br />
                                Tukarkan <span className="text-amber-400">{exchangeAmount * 160} Glamour Gems</span> dengan <span className="text-blue-400">{exchangeAmount} Glimmering Essence</span>?
                            </p>
                            <div className="flex gap-4">
                                <button
                                    aria-label="button"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={handleExchange}

                                >
                                    Ya, Tukar
                                </button>
                                <button
                                    aria-label="button"
                                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => setShowExchangeModal(false)}
                                >
                                    Tidak
                                </button>
                            </div>
                        </div>
                    </DynamicModal>

                </>
            )}
        </>
    )
}

export default Limited_A;