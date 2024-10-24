import React from 'react';

import * as SolidIcons from '@heroicons/react/24/solid';
import * as Interfaces from '@/interfaces';
import * as Components from '@/components';
import * as Helpers from '@/helpers';
import * as Config from '@/config';

type Props = {
    sourcePublicationId: string;
    crosslink: Interfaces.RelativeCrosslink;
};

const Card: React.FC<Props> = (props): React.ReactElement => {
    const version = props.crosslink.linkedPublication.latestLiveVersion;
    return (
        <div className="rounded-md shadow my-2">
            <div
                className={`rounded-t-lg border-b border-teal-500 bg-white-50 p-4 transition-colors duration-500 dark:bg-grey-700`}
            >
                <p className="mb-4 block min-h-[3rem] font-montserrat text-sm font-bold leading-snug text-grey-900 transition-colors duration-500 dark:text-white-50 lg:min-h-[4rem] 2xl:text-md">
                    {version.title.length > 80 ? Helpers.truncateString(version.title, 80) : version.title}
                </p>
                <div className="flex">
                    <span className="w-1/2 text-xs font-medium tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100 pr-2">
                        By {Helpers.abbreviateUserName(version.user)}
                    </span>

                    {version.publishedDate && (
                        <time
                            className="w-1/2 text-xs font-medium tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100 border-l border-grey-800 dark:border-grey-100 pl-2"
                            suppressHydrationWarning
                        >
                            {Helpers.formatDate(version.publishedDate, 'short')}
                        </time>
                    )}
                </div>
            </div>
            <Components.Link
                href={`${Config.urls.viewPublication.path}/${props.crosslink.linkedPublication.id}?suggestedFrom=${props.sourcePublicationId}`}
                className={`flex w-full items-center justify-center rounded-b-lg rounded-t-none bg-white-50 p-4 font-montserrat font-medium tracking-tight outline-0 transition-colors duration-500 hover:bg-grey-50 focus:ring-2 focus:ring-yellow-400 dark:bg-grey-700 dark:hover:bg-grey-600 print:hidden`}
            >
                <span className="mr-4 text-sm text-teal-600 dark:text-teal-300">View this publication</span>
                <SolidIcons.EyeIcon className="h-5 w-5 text-teal-500" />
            </Components.Link>
        </div>
    );
};

export default Card;
