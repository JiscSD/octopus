import React from 'react';
import * as Framer from 'framer-motion';

import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Types from '@types';
import * as Assets from '@assets';

type Props = {
    id: string;
    title: string;
    createdBy: string;
    type: Types.PublicationType;
    date: string;
    className?: string;
};

const SearchResult: React.FC<Props> = (props): JSX.Element => (
    <Framer.motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'tween', duration: 2 }}
    >
        <Components.Link
            href={`${Config.urls.viewPublication.path}/${props.id}`}
            className={`
            relative
            grid
            min-h-[4rem]
            grid-cols-1
            items-start
            overflow-hidden
            rounded-md
            border
            border-transparent
            bg-white
            py-4
            px-4
            shadow
            outline-0
            transition-all
            duration-500
            hover:opacity-95
            focus:rounded
            focus:border-transparent
            focus:opacity-95
            focus:ring-2
            focus:ring-yellow-500
            dark:border-grey-700
            dark:bg-grey-700
            dark:shadow-none
            lg:grid-cols-12
            ${props.className && props.className}
            `}
        >
            <Assets.Logo
                height={128}
                width={128}
                className="absolute -right-3 top-2 z-10 mr-8 rotate-12 fill-grey-400 opacity-10 transition-colors duration-500 dark:fill-grey-900"
            />

            <div className="z-10 col-span-10 w-full">
                <h2 className="col-span-7 mb-4 font-montserrat leading-7 text-grey-800 transition-colors duration-500 dark:text-white">
                    {props.title}
                </h2>
                <span className="flex text-xs tracking-wide text-grey-700 transition-colors duration-500 dark:text-grey-100">
                    Published by {props.createdBy}, {Helpers.formatDate(props.date)}
                </span>
            </div>

            <div className="col-span-2 mt-4 lg:mt-0">
                <span className="leading-0 col-span-1 block font-montserrat text-sm font-semibold tracking-wide text-teal-500 lg:text-right">
                    {Helpers.formatPublicationType(props.type)}
                </span>
            </div>
        </Components.Link>
    </Framer.motion.div>
);

export default SearchResult;
