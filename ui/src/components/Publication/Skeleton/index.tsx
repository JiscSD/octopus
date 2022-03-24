import React from 'react';
import * as Framer from 'framer-motion';

type Props = {
    count: number;
};

const Skeleton: React.FC<Props> = (props): React.ReactElement => (
    <>
        {new Array(props.count).fill(0).map((_, index) => (
            <Framer.motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'tween', duration: 2 }}
                className={`
                mb-4
                items-start
                overflow-hidden
                rounded-md
                border
                border-transparent
                bg-white-50
                py-4
                px-4
                shadow
                outline-0
                transition-all
                duration-500
                hover:opacity-95
                dark:border-grey-700
                dark:bg-grey-700
                dark:shadow-none
                `}
            >
                <div className="mb-3 h-3 w-11/12 animate-pulse rounded-3xl bg-grey-50 p-3 transition-colors duration-500 dark:bg-grey-600" />
                <div className="flex items-center">
                    <div className="mr-4 h-3 w-5/12 animate-pulse rounded-3xl bg-grey-50 p-3 transition-colors duration-500 dark:bg-grey-600" />
                    <div className="h-3 w-4/12 animate-pulse rounded-3xl bg-grey-50 p-3 transition-colors duration-500 dark:bg-grey-600" />
                </div>
            </Framer.motion.div>
        ))}
    </>
);

export default Skeleton;
