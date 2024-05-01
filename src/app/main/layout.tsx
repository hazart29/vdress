'use client'
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../component/navbar";

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const router = useRouter();
    const [loading, isloading] = useState(true);
    const icon = '/ui/iconVD.svg';

    // Check if user is authenticated

    useEffect(() => {
        const checkAuth = async () => {
            const session = await getSession();
            if (!session) {
                router.push('/'); // Redirect to / page if not authenticated
            } else {
                router.push('/main'); // Redirect to main page if authenticated
                isloading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return <div className='absolute flex w-full h-full z-[999] top-0 left-0 justify-center items-center'><Image src={icon} alt="none" width={40} height={40} className='animate-ping'/></div>;
    }

    return (
        <div className='relative flex flex-col w-full h-full select-none bg-hero-patterns'>
            <div className='h-[5%] w-full felx-none items-end p-4'></div>
            <div id='mainlayout' className='relative overflow-hidden flex flex-shrink flex-col h-full w-full flex-none text-white p-4 md:py-6'>
                <div className='flex-1'>
                    {children}
                </div>  
                <div className='flex-none h-[13%]'></div>
            </div>
            <div className='h-[13%] bottom-0 z-[999] w-full felx-none items-end bg-white rounded-t-lg'><Navbar /></div>
        </div>
    )
}