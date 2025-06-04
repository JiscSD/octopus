import React from 'react';

import * as SolidIcons from '@heroicons/react/24/solid';
import * as Interfaces from '@/interfaces';
import * as Components from '@/components';
import * as Helpers from '@/helpers';
import * as Config from '@/config';
import * as Assets from '@/assets';

type Props = {
    publicationVersion: Interfaces.PublicationVersion;
    bodyClassName?: string;
    buttonClassName?: string;
};

const Card: React.FC<Props> = (props): React.ReactElement => {
    const authors = React.useMemo(() => {
        const authors = props.publicationVersion.coAuthors.filter((author) => author.confirmedCoAuthor && author.user);
        return authors;
    }, [props.publicationVersion]);
    const correspondingAuthor = authors.find((author) => author.linkedUser === props.publicationVersion.createdBy);

    const { flagCount, peerReviewCount } = props.publicationVersion.publication;
    const hasFlagAndPeerReview = flagCount && peerReviewCount;
    const hasOneOfFlagOrPeerReview = flagCount || peerReviewCount;

    return (
        <div className="rounded-md shadow">
            <div
                className={`rounded-t-lg border-b border-teal-500 bg-white-50 p-4 transition-colors duration-500 dark:bg-grey-700 ${props.bodyClassName}`}
            >
                <p className="mb-4 mt-2 block min-h-[6rem] font-montserrat text-lg font-bold leading-snug text-grey-900 transition-colors duration-500 dark:text-white-50 lg:min-h-[7rem] 2xl:text-xl">
                    {props.publicationVersion.title.length > 80
                        ? Helpers.truncateString(props.publicationVersion.title, 69)
                        : props.publicationVersion.title}
                </p>
                <span className="mb-4 block font-montserrat text-sm text-grey-800 transition-colors duration-500 dark:text-white-50">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        <div className="flex">
                            <span
                                className={`${
                                    hasFlagAndPeerReview ? 'w-1/2' : hasOneOfFlagOrPeerReview ? 'w-3/4' : ''
                                } truncate`}
                            >
                                {Helpers.abbreviateUserName(correspondingAuthor?.user)}
                                {authors.length > 1 && ' et al.'}
                            </span>
                            <Components.EngagementCounts
                                className={`justify-end ${
                                    hasFlagAndPeerReview ? 'w-1/2' : hasOneOfFlagOrPeerReview ? 'w-1/4' : ''
                                }`}
                                flagCount={flagCount}
                                peerReviewCount={peerReviewCount}
                            />
                        </div>
                    </div>
                </span>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100">
                        {Helpers.formatPublicationType(props.publicationVersion.publication.type)}
                    </span>

                    <time
                        className="text-xs font-medium tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100"
                        suppressHydrationWarning
                    >
                        {props.publicationVersion.publishedDate &&
                            Helpers.formatDate(props.publicationVersion.publishedDate)}
                    </time>
                </div>
            </div>
            <Components.Link
                href={`${Config.urls.viewPublication.path}/${props.publicationVersion.publication.id}`}
                className={`flex w-full items-center justify-center rounded-b-lg rounded-t-none bg-white-50 p-4 font-montserrat font-medium tracking-tight outline-0 transition-colors duration-500 hover:bg-grey-50 focus:ring-2 focus:ring-yellow-400 dark:bg-grey-700 dark:hover:bg-grey-600 print:hidden ${props.buttonClassName}`}
            >
                <span className="mr-4 text-sm text-teal-600 dark:text-teal-300">View this publication</span>
                <SolidIcons.EyeIcon className="h-5 w-5 text-teal-500" />
            </Components.Link>
        </div>
    );
};

export default Card;
