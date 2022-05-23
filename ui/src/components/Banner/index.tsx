import React from 'react';

const Banner: React.FC = (): React.ReactElement => {
    return (
        <div className="flex w-full justify-center bg-teal-300 text-center align-middle text-grey-800 dark:bg-teal-700 dark:text-grey-100 md:h-10">
            <span className="py-2 align-middle">
                This is test release - we&apos;re still working on the site. Please don&apos;t use it for recording your
                real work... yet!
            </span>
        </div>
    );
};

export default Banner;
