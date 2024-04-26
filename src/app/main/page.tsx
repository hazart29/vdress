import Image from "next/image";

export default function Home() {
    return (
        <div className='flex flex-1 flex-col h-full'>
            <div className='relative flex-none h-[30%] w-full justify-center items-start'>
                <Image src="/ui/logo.svg" layout="fill" alt="logo" priority />
            </div>
        </div>
    );
}