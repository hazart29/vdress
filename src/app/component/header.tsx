// pages/index.js
'use client'
import React, { useEffect, useState } from 'react';

export const revalidate = 1;

export default function Header() {
    let primo: any;
    const [data,setData] = useState(null);

    useEffect(() => {
        
    
        getData();

        const intervalId = setInterval(getData, 5000); // Polling setiap

        // // Bersihkan interval saat komponen di-unmount
        return () => clearInterval(intervalId);
    }, []);

    async function getData() {
        const user = localStorage.getItem('user');

        // Kirim permintaan ke endpoint API di Next.js dengan menggunakan fetch atau library HTTP client lainnya
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
          setData(reqData[0].primogems)
    }

    if (data) {
       primo = data
    } 

    return (
        <div className='flex gap-2 w-full h-full px-2 pt-2'>
            <div className='flex-1 rounded-full bg-white bg-opacity-50 text-center text-sm'></div>
            <div className='flex-1 rounded-full bg-white bg-opacity-50 text-center text-sm'></div>
            <div onClick={getData} className='flex flex-1 rounded-full bg-white bg-opacity-50 text-gray-600 text-center text-xs font-bold justify-center items-center'><p>{primo}</p></div>
        </div>
    );
};