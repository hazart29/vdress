'use client'
import React, { useEffect, useState } from 'react';

export const revalidate = 1;

export default function Header() {
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

    return (
        <div className='flex gap-2 w-full h-full px-2 pt-2'>
            <div className='flex-1 rounded-full bg-white bg-opacity-50 text-center text-sm'><p>{user}</p></div>
            <div className='flex-1 rounded-full bg-white bg-opacity-50 text-center text-sm'></div>
            <div className='flex flex-1 rounded-full bg-white bg-opacity-50 text-gray-600 text-center text-xs font-bold justify-center items-center' onClick={getData}><p>{primo}</p></div>
        </div>
    );
};