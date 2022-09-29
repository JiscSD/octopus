import React from 'react';
import parse from 'html-react-parser';
import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    publication: Interfaces.Publication;
    className?: string;
};

const SearchResult: React.FC<Props> = (props): React.ReactElement => (
    <Framer.motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'tween', duration: 0.35 }}
    >
        <Components.Link
            href={`${Config.urls.viewPublication.path}/${props.publication.id}`}
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
            py-4
            px-4
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
            <div className="z-10 col-span-11 w-full">
                <span className="leading-0 mb-2 block font-montserrat text-xs font-semibold tracking-wide text-teal-400 dark:text-teal-200">
                    {Helpers.formatPublicationType(props.publication.type)}
                </span>
                <h2 className="col-span-7 mb-2 leading-6 text-grey-800 transition-colors duration-500 dark:text-white-50">
                    {props.publication.title}
                </h2>

                <div className="mb-4 block text-xs text-grey-700 transition-colors duration-500 dark:text-grey-50">
                    {props.publication.description ? (
                        <p>{props.publication.description}</p>
                    ) : (
                        parse(Helpers.truncateString(props.publication.content, 370))
                    )}
                </div>

                <span className="flex text-xs tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Published {Helpers.relativeDate(props.publication.publishedDate)}, by{' '}
                    {props.publication.user.firstName[0]}. {props.publication.user.lastName}
                </span>
            </div>

            <div className="lg: col-span-1 mt-4 hidden h-full w-full items-center justify-end lg:mt-0 lg:flex">
                <OutlineIcons.ChevronRightIcon className="h-5 w-5 text-teal-400" />
            </div>
        </Components.Link>
    </Framer.motion.div>
);

export default SearchResult;
