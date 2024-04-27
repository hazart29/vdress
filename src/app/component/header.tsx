// pages/index.js
'use client'
import React, { useEffect, useState } from 'react';

interface Inventory {
    SSR: string[];
    SR: string[];
    R: string[];
}

interface Players {
    id: number;
    name: string;
    primogems: number;
    inventory: Inventory;
    gacha: string[];
    pityCounter: number;
    tenpull: string[];
}

interface PlayerData {
    players: Players;
}

export const revalidate = 1;

export default function Header() {
    const [data, setData] = useState<PlayerData | null>(null);
    let primo: any;

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/data/dataPlayer.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const jsonData: PlayerData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();

        const intervalId = setInterval(fetchData, 500); // Polling setiap 5 ms

        // Bersihkan interval saat komponen di-unmount
        return () => clearInterval(intervalId);
    }, []);

    if (data) {
        primo = data.players.primogems;
    }

    return (
        <div className='flex gap-2 w-full h-full px-2 pt-2'>
            <div className='flex-1 rounded-full bg-white bg-opacity-50 text-center text-sm'></div>
            <div className='flex-1 rounded-full bg-white bg-opacity-50 text-center text-sm'></div>
            <div className='flex flex-1 rounded-full bg-white bg-opacity-50 text-center text-xs justify-center items-center'><p>{primo}</p></div>
        </div>
    );
};