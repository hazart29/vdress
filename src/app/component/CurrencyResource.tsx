'use client'
import { useEffect, useState } from "react";
import React from "react";

interface user_resources {
    id: number;
    uid: number;
    chic_coins: number;
    glamour_gems: number;
    glamour_dust: number;
    fashion_tokens: number;
    shimmering_essence: number;
    glimmering_essence: number;
    pity: number;
    is_rate: boolean;
}

interface CurrencyResourceProps {
    activeTab: string;
}

const CurrencyResource: React.FC<CurrencyResourceProps> = ({ activeTab }) => {
    const [userData, setUserData] = useState<user_resources | null>(null);

    // Mengambil userId dan melakukan parsing ke number, handle jika null
    const userId = sessionStorage.getItem('userId') ? Number(sessionStorage.getItem('userId')) : null;

    const getData = async (userId: number) => {
        try {
            const response = await fetch('/api/user_resources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user resources');
            }

            const reqData = await response.json();
            if (reqData) {
                setUserData(reqData);
            } else {
                console.warn('No user data found for provided userId.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            getData(userId);
        } else {
            // Handle kondisi userId null (misalnya, redirect ke halaman login)
            console.error("User ID not found in session storage.");
        }
    }, [userId, activeTab]); // Jalankan useEffect saat userId atau activeTab berubah

    return (
        <>
            <div className='flex gap-2 flex-none lg:text-xs text-[10px] p-1 items-center justify-center'>
                <div className='px-2 py-1 items-center justify-center flex rounded-full bg-white w-20'>
                    <p className='text-slate-900'>
                        {userData?.glamour_dust || 0}
                    </p>
                </div>
                <div className='px-2 py-1 items-center justify-center flex rounded-full bg-white w-20'>
                    <p className='text-slate-900'>
                        {activeTab === 'limited' ? (userData?.glimmering_essence || 0) : (userData?.shimmering_essence || 0)}
                    </p>
                </div>
                <div className='px-2 py-1 items-center justify-between flex rounded-full bg-white w-20'>
                    <p className='flex text-slate-900'>
                        {userData?.glamour_gems || 0}
                    </p>
                    <span className="font-bold flex items-center justify-center text-black bg-gray-200 rounded-full px-1">
                        +
                    </span>
                </div>
                {/* ... other divs ... */}
            </div>
        </>
    );
}

export default CurrencyResource;