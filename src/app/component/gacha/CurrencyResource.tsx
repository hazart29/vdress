'use client'
import { useEffect, useState } from "react";
import React from "react";
import { Users, User_resources } from "@/app/interface";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CurrencyResourceProps {
    activeTab: string;
    refreshTrigger: number; // Tambahkan refreshTrigger di sini
}

const CurrencyResource: React.FC<CurrencyResourceProps> = ({ activeTab, refreshTrigger }) => {

    const [userData, setUserData] = useState<User_resources | null>(null);
    const router = useRouter();

    // Mengambil uid dan melakukan parsing ke number, handle jika null
    const uid = sessionStorage.getItem('uid') ? Number(sessionStorage.getItem('uid')) : null;

    const getData = async (uid: number) => {
        try {
            const response = await fetch('/api/user_resources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: uid }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user resources');
            }

            const reqData = await response.json();
            if (reqData) {
                setUserData(reqData);
            } else {
                console.warn('No user data found for provided uid.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (uid) {
            getData(uid);
        } else {
            // Handle kondisi uid null (misalnya, redirect ke halaman login)
            console.error("User ID not found in session storage.");
        }
    }, [uid, activeTab, refreshTrigger]); // Jalankan useEffect saat uid atau activeTab berubah

    return (
        <>
            <div className='flex gap-2 flex-1 lg:text-xs text-[10px] p-1 items-center justify-end'>
                <div className='px-2 py-1 items-center justify-center flex gap-2 rounded-full bg-white w-20'>
                    <Image src={"/icons/currency/fashion_tokens.png"} alt={"fashion_tokens"} width={20} height={20} />
                    <p className='text-slate-900'>
                        {userData?.fashion_tokens || 0}
                    </p>
                </div>
                <div className='px-2 py-1 items-center justify-center flex gap-2 rounded-full bg-white w-20'>
                    <Image src={"/icons/currency/glamour_dust.png"} alt={"fashion_tokens"} width={20} height={20} />
                    <p className='text-slate-900'>
                        {userData?.glamour_dust || 0}
                    </p>
                </div>
                {activeTab !== 'SHOP' && (
                    <div id="essence" className='px-2 py-1 items-center justify-center flex gap-2 rounded-full bg-white w-20'>
                        {activeTab === 'limited' ?
                            <Image src={"/icons/currency/glimmering_essence.png"} alt={"fashion_tokens"} width={20} height={20} />
                            :
                            <Image src={"/icons/currency/shimmering_essence.png"} alt={"fashion_tokens"} width={20} height={20} />
                        }

                        <p className='text-slate-900'>
                            {activeTab === 'limited' ? (userData?.glimmering_essence || 0) : (userData?.shimmering_essence || 0)}
                        </p>
                    </div>
                )}
                <div className='px-2 py-1 items-center justify-between flex gap-2 rounded-full bg-white w-fit'>
                    <Image src={"/icons/currency/glamour_gems.png"} alt={"fashion_tokens"} width={20} height={20} />
                    <span className="flex gap-1">
                        <p className='flex text-slate-900'>
                            {userData?.glamour_gems || 0}
                        </p>
                        <a href={"/main/shop/top-up"} className="font-bold flex items-center justify-center text-black bg-gray-200 rounded-full px-1">
                            +
                        </a>
                    </span>
                </div>
                {/* ... other divs ... */}
            </div>
        </>
    );
}

export default CurrencyResource;