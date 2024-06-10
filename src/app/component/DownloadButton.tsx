import React from 'react';

interface DownloadButtonProps {
    onClick: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick }) => {
    return (
        <>
            <span className='rounded-full flex relative scale-125 bg-gray-400 text-xs py-4 px-4 ml-6 transition-all ease-in-out duration-100 hover:scale-150'>
                <button onClick={onClick} className='absolute inset-0 m-1 flex items-center justify-center rounded-full bg-white text-slate-900'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                    </svg>
                </button>
            </span>
        </>
    );
};

export default DownloadButton;
