import React from 'react';
import * as SolidIcons from '@heroicons/react/24/solid';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    publicationVersion: Interfaces.PublicationVersion;
    linkedFrom: Interfaces.LinkedFromPublication[];
    flags: Interfaces.Flag[];
};

const General: React.FC<Props> = (props): React.ReactElement => {
    const peerReviewCount = props.linkedFrom.filter((publication) => publication.type === 'PEER_REVIEW').length;

    const activeFlags = React.useMemo(() => props.flags.filter((flag) => !flag.resolved), [props.flags]);

    const uniqueRedFlagCategoryList = React.useMemo(
        () => Array.from(new Set(activeFlags.map((flag) => flag.category))),
        [activeFlags]
    );

    return (
        <>
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Publication type:
                </span>
                <span className=" text-sm font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                    {Helpers.formatPublicationType(props.publicationVersion.publication.type)}
                </span>
            </div>
            {props.publicationVersion.publishedDate && (
                <div className="flex">
                    <span className="mr-2 text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100">
                        Published:
                    </span>
                    <time
                        className=" text-sm font-medium text-grey-800 transition-colors duration-500 dark:text-white-50"
                        suppressHydrationWarning
                    >
                        {Helpers.formatDate(props.publicationVersion.publishedDate)}
                    </time>
                </div>
            )}
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Language:
                </span>
                <span className=" text-sm font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                    {
                        Config.values.octopusInformation.languages.find(
                            (l) => l.code === props.publicationVersion.language
                        )?.name
                    }
                </span>
            </div>
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Licence:
                </span>
                <Components.Link
                    href={Config.values.octopusInformation.licences[props.publicationVersion.licence].link}
                    title="licence"
                    openNew={true}
                    className=" text-sm font-medium text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                >
                    <div className="flex items-center">
                        {Config.values.octopusInformation.licences[props.publicationVersion.licence].nicename}
                        <OutlineIcons.ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                    </div>
                </Components.Link>
            </div>

            <div className="flex w-full whitespace-normal">
                <span className="mr-2 text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    DOI:
                </span>
                <Components.Link
                    href={`https://doi.org/${props.publicationVersion.publication.doi}`}
                    ariaLabel={`DOI link: https://doi.org/${props.publicationVersion.publication.doi}`}
                    className="flex w-full items-center text-sm font-medium text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                    openNew={true}
                >
                    <p className="break-words break-all">https://doi.org/{props.publicationVersion.publication.doi}</p>
                    <OutlineIcons.ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                </Components.Link>
            </div>
            {props.publicationVersion.publication.type !== 'PEER_REVIEW' && (
                <div className="flex">
                    <span className="mr-2 text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100">
                        Peer reviews: ({peerReviewCount})
                    </span>
                </div>
            )}
            {!!activeFlags && (
                <div className="flex">
                    <span className="mr-2 flex items-center text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100">
                        Red flags:
                        {uniqueRedFlagCategoryList.map((category) => (
                            <SolidIcons.FlagIcon key={category} className="ml-1 h-4 w-4 text-red-500" />
                        ))}
                        <p className="ml-1">({activeFlags.length})</p>
                    </span>
                </div>
            )}
        </>
    );
};

export default General;
