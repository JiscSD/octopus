import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/24/outline';
import React from 'react';

import * as Components from '@/components';

type Props = {
    children?: React.ReactNode;
    className?: string;
    linkDestination: string;
};

const SearchResult: React.FC<Props> = (props): React.ReactElement => {
    return (
        <Framer.motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', duration: 0.35 }}
        >
            <Components.Link
                href={props.linkDestination}
                role="button"
                className={`
                    grid
                    min-h-[4rem]
                    grid-cols-1
                    items-start
                    overflow-hidden
                    rounded-none
                    border-b
                    border-grey-50
                    bg-white-50
                    px-4
                    py-4
                    shadow
                    outline-0
                    transition-colors
                    duration-500
                    hover:opacity-95
                    focus:overflow-hidden
                    focus:border-transparent
                    focus:opacity-95
                    focus:ring-2
                    focus:ring-yellow-500
                    dark:border-grey-600
                    dark:bg-grey-700
                    lg:grid-cols-12
                    ${props.className ? props.className : ''}
                `}
            >
                <div className="z-10 col-span-11 w-full">{props.children}</div>
                <div className="col-span-1 mt-4 hidden h-full w-full items-center justify-end lg:mt-0 lg:flex">
                    <OutlineIcons.ChevronRightIcon className="h-5 w-5 text-teal-400" />
                </div>
            </Components.Link>
        </Framer.motion.div>
    );
};

export default SearchResult;
