import Navbar from "../component/navbar";
import Header from "../component/header";

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className='relative flex flex-col w-full h-full select-none bg-hero-patterns'>
            <div className='h-[7%] w-full felx-none items-end p-2'><Header/></div>
            <div className='overflow-hidden flex flex-shrink flex-col h-full w-full flex-none text-white p-4 md:py-6'>
                <div className='flex-1'>
                    {children}
                </div>  
            </div>
            <div className='h-[13%] w-full felx-none items-end bg-white rounded-t-lg'><Navbar /></div>
        </div>
    )
}