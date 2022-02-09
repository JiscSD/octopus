import React from 'react';
import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/outline';

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
        transition={{ type: 'tween', duration: 0.35 }}
    >
        <Components.Link
            href={`${Config.urls.viewPublication.path}/${props.id}`}
            className={`
            grid
            min-h-[4rem]
            grid-cols-1
            items-start
            overflow-hidden
            border-b
            border-grey-50
            bg-white
            py-4
            px-4
            outline-0
            transition-all
            duration-500
            hover:opacity-95
            focus:rounded
            focus:border-transparent
            focus:opacity-95
            focus:ring-2
            focus:ring-yellow-500
            dark:bg-grey-700
            lg:grid-cols-12
            ${props.className ? props.className : ''}
            `}
        >
            <div className="z-10 col-span-11 w-full">
                <span className="leading-0 mb-2 block font-montserrat text-xs font-semibold tracking-wide text-teal-500">
                    {Helpers.formatPublicationType(props.type)}
                </span>
                <h2 className="col-span-7 mb-2 leading-6 text-grey-800 transition-colors duration-500 dark:text-white">
                    {props.title}
                </h2>

                <p className="mb-4 block text-xs text-grey-700">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id, fugiat perspiciatis officia voluptates
                    aliquam delectus odio dolor ipsum modi repellat et corporis, necessitatibus quia vitae officiis quae
                    maxime repudiandae qui. Saepe atque eius tempora ut laboriosam? Consequuntur...
                </p>

                <span className="flex text-xs tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Published {Helpers.relativeDate(props.date)}, by {props.createdBy}
                </span>
            </div>

            <div className="col-span-1 mt-4 flex h-full w-full items-center justify-end lg:mt-0">
                <OutlineIcons.ChevronRightIcon className="h-5 w-5 text-teal-400" />
            </div>
        </Components.Link>
    </Framer.motion.div>
);

export default SearchResult;
