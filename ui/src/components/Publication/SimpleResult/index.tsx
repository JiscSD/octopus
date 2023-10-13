import React, { useMemo } from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';

type Props = {
    publicationVersion: Interfaces.PublicationVersion;
    user: Interfaces.User;
};

const SimpleResult: React.FC<Props> = (props): React.ReactElement => {
    const status = useMemo(
        () => Helpers.getPublicationStatusByAuthor(props.publicationVersion, props.user),
        [props.publicationVersion, props.user]
    );

    return (
        <div className="w-full rounded border border-transparent bg-white-50 p-3 text-sm shadow transition-colors duration-500 dark:border-teal-500 dark:bg-transparent dark:shadow-none sm:text-base">
            <div className="flex justify-between gap-2">
                <div className="flex w-fit flex-col flex-wrap gap-3 sm:flex-row sm:items-center sm:gap-2">
                    <span
                        className={`${
                            props.publicationVersion.currentStatus === 'LIVE'
                                ? 'text-teal-500 dark:text-teal-300'
                                : 'text-purple-500 dark:text-purple-300'
                        } flex items-center gap-2 font-semibold leading-3 transition-colors duration-500`}
                    >
                        {props.publicationVersion.currentStatus === 'LIVE' ? (
                            <OutlineIcons.ArrowTopRightOnSquareIcon className="inline h-4 min-w-[1rem] leading-3 text-grey-600 dark:text-teal-500" />
                        ) : (
                            <OutlineIcons.PencilSquareIcon className="inline h-4 min-w-[1rem] leading-3 text-grey-600 dark:text-teal-500" />
                        )}

                        {status}
                    </span>
                    {props.user.id === props.publicationVersion.createdBy && (
                        <span className="leading-tight text-green-700 dark:text-green-300">(Corresponding Author)</span>
                    )}
                    <span className="leading-3 text-pink-500 ">
                        {Helpers.formatPublicationType(props.publicationVersion.publication.type)}
                    </span>
                    {props.publicationVersion.publishedDate ? (
                        <span className="text-xs leading-3 text-grey-600 transition-colors duration-500 dark:text-grey-100 ">
                            Published: {Helpers.formatDate(props.publicationVersion.publishedDate)}
                        </span>
                    ) : (
                        <span className="text-xs leading-3 text-grey-600 transition-colors duration-500 dark:text-grey-100 ">
                            Last updated: {Helpers.formatDate(props.publicationVersion.updatedAt)}
                        </span>
                    )}
                </div>
                <span className="right-4 text-xs text-teal-500 empty:hidden">
                    {props.publicationVersion.publication.doi}
                </span>
            </div>
            <span className="mt-2 block font-montserrat text-grey-800 transition-colors duration-500 dark:text-white-50">
                {props.publicationVersion.title}
            </span>
        </div>
    );
};

export default SimpleResult;
