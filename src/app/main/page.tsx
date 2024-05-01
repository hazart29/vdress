'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const handleLogout = () => {
        // Clear session token from localStorage
        localStorage.removeItem('sessionToken');

        // Redirect to login page
        router.push('/');
    }
    return (
        <div className='flex flex-1 flex-col h-full gap-4 justify-between items-center'>
            <div className='relative flex-none h-[30%] w-full justify-center items-start'>
                <Image src="/ui/logo.svg" alt="logo" priority fill />
            </div>
            <button type="button" onClick={handleLogout} className="transform hover:scale-110 ease-in-out hover:text-orange-700 flex rounded-lg bg-gradient-to-r hover:from-orange-400 from-orange-500 hover:to-red-400 to-red-500 p-4 text-2xl text-orange-300 font-bold">Logout</button>
        </div>
    );
}