import React from 'react';

const JumpToContent: React.FC = (): JSX.Element => (
    <a
        id="top"
        href="#content"
        className="fixed top-0 left-0 flex h-0 w-0 justify-center bg-yellow-500 font-medium opacity-0 outline-none focus:z-50 focus:h-auto focus:w-full focus:py-2 focus:opacity-100"
        title="Skip to content"
    >
        Skip to content
    </a>
);

export default JumpToContent;
