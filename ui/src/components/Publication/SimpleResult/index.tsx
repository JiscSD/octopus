import React from 'react';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';

type Props = {
    publication: Interfaces.UserPublication;
    user: Interfaces.User;
};

const SimpleResult: React.FC<Props> = (props): React.ReactElement => (
    <div className="w-full rounded border border-transparent bg-white-50 p-3 shadow transition-colors duration-500 dark:border-teal-500 dark:bg-transparent dark:shadow-none">
        <div className="flex justify-between gap-2">
            <div className="flex w-fit flex-col flex-wrap gap-3 sm:flex-row sm:items-center sm:gap-2">
                <span
                    className={`${
                        props.publication.currentStatus === 'LIVE'
                            ? 'text-teal-500 dark:text-teal-300'
                            : 'text-purple-500 dark:text-purple-300'
                    } flex items-center gap-2 font-semibold leading-3 transition-colors duration-500`}
                >
                    {props.publication.currentStatus === 'LIVE' ? (
                        <OutlineIcons.ExternalLinkIcon className="inline h-4 w-4 leading-3 text-grey-600 dark:text-teal-500" />
                    ) : (
                        <OutlineIcons.PencilAltIcon className="inline h-4 w-4 leading-3 text-grey-600 dark:text-teal-500" />
                    )}
                    {Helpers.formatStatus(props.publication.currentStatus)}
                </span>
                {props.user.id === props.publication.createdBy && (
                    <span className="leading-tight text-green-700 dark:text-green-300">(Corresponding Author)</span>
                )}
                <span className="leading-3 text-pink-500 ">
                    {Helpers.formatPublicationType(props.publication.type)}
                </span>
                {props.publication.publishedDate ? (
                    <span className="text-xs leading-3 text-grey-600 transition-colors duration-500 dark:text-grey-100 ">
                        Published: {Helpers.formatDate(props.publication.publishedDate)}
                    </span>
                ) : (
                    <span className="text-xs leading-3 text-grey-600 transition-colors duration-500 dark:text-grey-100 ">
                        Last updated: {Helpers.formatDate(props.publication.updatedAt)}
                    </span>
                )}
            </div>
            <span className="absolute right-4 text-xs text-teal-500 empty:hidden sm:relative sm:right-0">
                {props.publication.doi}
            </span>
        </div>
        <span className="mt-2 block font-montserrat text-grey-800 transition-colors duration-500 dark:text-white-50">
            {props.publication.title}
        </span>
    </div>
);

export default SimpleResult;
