import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BackButton from "./BackButton";

const GenshinResource = () => {
    const [primo, setPrimo] = useState(null);
    const [user, setUser] = useState(null);
    const userId = sessionStorage.getItem('userId');

    const getData = async (userId: number) => {
        try {
            const response = await fetch('/api/db', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                throw new Error('failed');
            }

            const reqData = await response.json();
            setPrimo(reqData[0].primogems);
            setUser(reqData[0].username);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {

        getData(Number(userId));

        const intervalId = setInterval(getData, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <span className='flex-none flex gap-2'>
                <span className='px-2 py-1 items-center justify-center flex rounded-full bg-white w-20'>
                    <p className='text-slate-900'>1</p>
                </span>
                <span className='px-2 py-1 items-center justify-center flex rounded-full bg-white w-20'>
                    <p className='text-slate-900'>
                        {primo}
                    </p>
                </span>
                <span className='px-2 py-1 items-center justify-center flex rounded-full bg-white w-20'>
                    <p className='text-slate-900'>1</p>
                </span>
                <span className='px-2 py-1 items-center justify-center flex rounded-full bg-white w-20'>
                    <p className='text-slate-900'>1</p>
                </span>
            </span>
            <BackButton />
        </>
    );
}

export default GenshinResource;