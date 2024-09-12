import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BackButton from "./BackButton";

interface users {
    uid: number;
    username: string;
    password: string;
    email: string;
    name: string;
    primogems: number;
    pity_counter: number;
    rate_on: boolean;
    created_at: string;
}

const GenshinResource = () => {
    const [primo, setPrimo] = useState(null);
    const [userData, setUser] = useState<users>();
    const [data, setData] = useState<users | null>(null);
    const userId: number = Number(sessionStorage.getItem('userId'));

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
            if (reqData) {
                setData(reqData);
            } else {
                console.warn('No user data found for provided userId.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getData(userId);

        console.log(userData);

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