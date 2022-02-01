import React from 'react';
import { EyeIcon } from '@heroicons/react/solid';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    publication: Interfaces.Publication;
};

const Card: React.FC<Props> = (props): JSX.Element => {
    return (
        <div className="rounded-lg ">
            <div className="rounded-t-lg border-b border-grey-100 bg-white p-4 transition-colors duration-500 dark:bg-grey-700">
                {/** Averaged rating to go here */}
                <p className="mb-4 mt-2 block font-montserrat text-lg font-bold leading-snug text-grey-900 transition-colors duration-500 dark:text-white 2xl:text-2xl">
                    {props.publication.title}
                </p>
                <span className="mb-4 block font-montserrat text-sm text-grey-800 transition-colors duration-500 dark:text-white">
                    {props.publication.user.firstName}. {props.publication.user.lastName}
                </span>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100">
                        {Helpers.formatPublicationType(props.publication.type)}
                    </span>
                    <time className="text-xs font-medium tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100">
                        {Helpers.formatDate(props.publication.createdAt)}
                    </time>
                </div>
            </div>
            <Components.Link
                href={`${Config.urls.viewPublication.path}/${props.publication.id}`}
                className="flex w-full items-center justify-center rounded-b-lg bg-white p-4 font-montserrat font-medium tracking-tight outline-0 transition-colors duration-500 hover:bg-grey-50 focus:ring-2 focus:ring-yellow-400 dark:bg-grey-700 dark:hover:bg-grey-600 print:hidden"
            >
                <span className="mr-4 text-teal-600 dark:text-teal-300">View this publication</span>
                <EyeIcon className="h-6 w-6 text-teal-500" />
            </Components.Link>
        </div>
    );
};

export default Card;
