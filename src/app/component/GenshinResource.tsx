import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const GenshinResource = () => {
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

    const handleClose = () => {
        router.back();
    }

    return (
        <>
            <span className='flex-none flex gap-2'>
                <span className='px-2 py-1 items-center justify-center flex rounded-full bg-white w-20'>
                    <p className='text-slate-900'>1</p>
                </span>
                <span className='px-2 py-1 items-center justify-center flex rounded-full bg-white w-20'>
                    <p className='text-slate-900' onClick={getData}>
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
            <span className='rounded-full flex relative bg-gray-400 text-xs py-4 px-4 ml-6 transition-all ease-in-out duration-100 hover:scale-125'>
                <button onClick={() => handleClose()} className='absolute inset-0 m-1 flex items-center justify-center rounded-full bg-white text-slate-900'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </span>
        </>
    );
}

export default GenshinResource;