import React from 'react';

const JumpToContent: React.FC = (): JSX.Element => {
    return (
        <a
            id='top'
            href='#content'
            className='flex justify-center fixed bottom-0 left-0 w-0 h-0 focus:z-50 focus:w-full focus:h-auto focus:py-2 outline-none bg-yellow-500 font-medium'
            title='Skip to content'
        >
            Skip to content
        </a>
    );
};

export default JumpToContent;
