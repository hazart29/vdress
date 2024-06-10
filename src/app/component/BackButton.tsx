import { useRouter } from "next/navigation";

const BackButton = () => {
    const navigate = useRouter();

    const handleClose = () => {
        navigate.back();
    }

    return (
        <>
            <span className='rounded-full flex relative scale-125 bg-gray-400 text-xs py-4 px-4 ml-6 transition-all ease-in-out duration-100 hover:scale-150'>
                <button onClick={() => handleClose()} className='absolute inset-0 m-1 flex items-center justify-center rounded-full bg-white text-slate-900'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </span>
        </>
    );
}

export default BackButton;