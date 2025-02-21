import React from 'react';

const Loading = () => {
    return (
        <div className='flex min-h-screen justify-center items-center'>
            <div className='relative w-16 h-16'>
                <div className='absolute inset-0 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin'></div>
                <div className='absolute inset-2 border-4 border-t-blue-300 border-b-blue-300 border-l-transparent border-r-transparent rounded-full animate-spin-slower'></div>
            </div>
        </div>
    );
};

export default Loading;