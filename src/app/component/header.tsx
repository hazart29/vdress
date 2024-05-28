'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const revalidate = 1;

export default function Header() {
    const router = useRouter();
    const [primo, setPrimo] = useState(null);
    const [user, setUser] = useState(null);

    const getData = async () => {
        try {
            const user = localStorage.getItem('user');
            const response = await fetch('/api/db', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const reqData = await response.json();
            setPrimo(reqData[0].primogems);
            setUser(reqData[0].username);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getData();

        const intervalId = setInterval(getData, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const handleButtonClick = () => {
        router.back(); // Go back to the previous page
    };

    return (
        <>
            <div className='flex flex-1 gap-2 w-1/3 h-full px-2 pt-2'>
                <button type='button' onClick={handleButtonClick} className='p-2 rounded-full bg-white'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
            </div>
            <div className='flex flex-1 gap-2 w-1/3 h-full px-2 pt-2'>
                <div className='flex flex-1 rounded-full bg-white bg-opacity-50 text-gray-600 text-center text-xs font-bold justify-center items-center'><p>{user}</p></div>
                <div className='flex flex-1 rounded-full bg-white bg-opacity-50 text-gray-600 text-center text-xs font-bold justify-center items-center'></div>
                <div className='flex flex-1 rounded-full bg-white bg-opacity-50 text-gray-600 text-center text-xs font-bold justify-center items-center' onClick={getData}><p>{primo}</p></div>
            </div>
        </>
    );
};
