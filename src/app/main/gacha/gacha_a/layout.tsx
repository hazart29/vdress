'use client'
import React, { useEffect, useRef, useState } from "react";
import BackButton from "@/app/component/BackButton";
import CurrencyResource from "@/app/component/gacha/CurrencyResource";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Limited_A from "./limited/page";
import Standard_A from "./standard/page";
import MoreBox from "@/app/component/gacha/MoreBox";

interface PityResponse {
    pity: number;
}

export default function GachaALayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // State untuk menyimpan tab yang aktif
    const [activeTab, setActiveTab] = useState<string>('limited');

    useEffect(() => {
        // Mengambil nilai tab dari URL saat komponen dimuat
        const tabFromUrl = searchParams.get('tab') || 'limited';
        setActiveTab(tabFromUrl);
    }, [searchParams]); // Jalankan useEffect saat searchParams berubah

    const handleTabChange = (tab: string) => {
        // Memperbarui URL dan state saat tab berubah
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('tab', tab);
        router.push(`${pathname}?${newSearchParams.toString()}`);
        setActiveTab(tab);
    };


    return (
        <div className="relative flex flex-col w-full h-screen">
            <div className="relative flex flex-1 flex-col">
                <div className="absolute w-full p-6 lg:h-20 h-16 z-[60] flex flex-row items-center inset-0 top-0 transition-transform duration-300">
                    <div className="flex flex-1 justify-start gap-4 items-center text-xs lg:text-base">
                        <BackButton href="/main" />
                        <p className="font-bold transition-opacity duration-300">
                            {activeTab === "standar" ? "Symphony of Silk" : "Whispers of Silk"}
                        </p>
                    </div>
                    <div className="flex flex-1 justify-end items-center">
                        <CurrencyResource activeTab={activeTab} refreshTrigger={refreshTrigger} />
                    </div>
                </div>

                {/* Content */}
                <div className=" flex flex-1 bg-blue-800 transition-opacity duration-500 ease-in-out">
                    {activeTab === "standar" ? <Standard_A /> : <Limited_A />}
                </div>
            </div>

            {/* Side Buttons */}
            <div className="absolute flex flex-col gap-4 -left-8 lg:bottom-36 bottom-16 z-50">
                <button
                    className={`flex flex-1 lg:p-8 p-4 shadow-black shadow-xl transform skew-x-12 pl-12 
            ${activeTab === "limited" ? "bg-white opacity-70 text-black" : "bg-black opacity-50"} 
            hover:bg-white hover:text-black hover:opacity-100 duration-300
            hover:scale-105 transform transition-transform`}
                    onClick={() => handleTabChange("limited")}
                >
                    <p className="transform -skew-x-12 lg:text-2xl text-xs font-bold pl-4">Japanese Miko</p>
                </button>
                <button
                    className={`flex flex-1 lg:p-8 p-4 shadow-black shadow-xl transform skew-x-12 pl-12 
            ${activeTab === "standar" ? "bg-white opacity-70 text-black" : "bg-black opacity-50"} 
            hover:bg-white hover:text-black hover:opacity-100 duration-300
            hover:scale-105 transform transition-transform`}
                    onClick={() => handleTabChange("standar")}
                >
                    <p className="transform -skew-x-12 lg:text-2xl text-xs font-bold pl-4">Symphony of Silk</p>
                </button>
            </div>

            {/* More Box */}
            <div className="absolute flex flex-col gap-4 lg:left-44 lg:bottom-16 left-10 bottom-4 z-[70]">
                <MoreBox activeTab={activeTab} />
            </div>
        </div>
    )
}