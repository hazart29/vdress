import Navbar from "../component/navbar";

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
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