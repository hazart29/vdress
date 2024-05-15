'use client'
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../component/navbar";
import { jwtDecode } from 'jwt-decode';
import Header from "../component/header";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const [loading, isloading] = useState(true);
    const icon = '/ui/iconVD.svg';
    const currentUrl = usePathname();


    // Check if user is authenticated

    useEffect(() => {
        const checkAuth = () => {
            // Get the session token from local storage
            const token = sessionStorage.getItem('sessionToken');

            if (!token) {
                router.push('/'); // Redirect to '/' page if no token found
            } else {
                try {
                    const currentDate = new Date();
                    // Decode the JWT token
                    const decodedToken = jwtDecode(token);
                    // Check if the token is expired
                    if (decodedToken.exp) {
                        const isTokenExpired = decodedToken.exp * 1000 < currentDate.getTime();
                        if (isTokenExpired) {
                            // Clear expired token from local storage
                            localStorage.removeItem('sessionToken');
                            router.push('/'); // Redirect to '/' page if token is expired
                        } else {
                            router.push(currentUrl); // Redirect to '/main' page if token is valid
                            isloading(false);
                        }
                    }
                } catch (error) {
                    // Handle any errors (e.g., invalid token format)
                    console.error('Error decoding token:', error);
                    // Clear invalid token from local storage
                    localStorage.removeItem('sessionToken');
                    router.push('/'); // Redirect to '/' page
                }
            }
        };

        checkAuth();
    }, [router, isloading]);
    if (loading) {
        return <div className='absolute flex w-full h-full z-[999] top-0 left-0 justify-center items-center'><Image src={icon} alt="none" width={40} height={40} className='animate-ping' /></div>;
    }

    return (
        <div className='relative flex flex-col w-full h-full select-none bg-hero-patterns'>
            <div className='h-[7%] w-full flex-none items-end p-2'><Header /></div>
            <div id='mainlayout' className='overflow-hidden flex flex-shrink flex-col h-full w-full flex-none text-white py-2 px-6 md:py-6'>
                <div className='flex flex-1'>
                    {children}
                </div>
            </div>
            <div className='h-[10%] bottom-0 z-[999] w-full flex-none items-end bg-white rounded-t-lg'><Navbar /></div>
        </div>
    )
}