import React from 'react';
import * as SolidIcons from '@heroicons/react/solid';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    publication: Interfaces.Publication;
};

const General: React.FC<Props> = (props): React.ReactElement => {
    const peerReviewCount = props.publication.linkedFrom.filter(
        (publication) => publication.publicationFromRef.type === 'PEER_REVIEW'
    ).length;

    const activeFlags = React.useMemo(
        () => props.publication.publicationFlags.filter((flag) => !flag.resolved),
        [props.publication]
    );

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
                    {Helpers.formatPublicationType(props.publication.type)}
                </span>
            </div>
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Published:
                </span>
                <time className=" text-sm font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                    {Helpers.formatDate(props.publication.publishedDate)}
                </time>
            </div>
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Language:
                </span>
                <span className=" text-sm font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                    {
                        Config.values.octopusInformation.languages.find((l) => l.code === props.publication.language)
                            ?.name
                    }
                </span>
            </div>
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    Licence:
                </span>
                <Components.Link
                    href={Config.values.octopusInformation.licences[props.publication.licence].link}
                    title="licence"
                    openNew={true}
                    className=" text-sm font-medium text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                >
                    <div className="flex items-center">
                        {Config.values.octopusInformation.licences[props.publication.licence].nicename}
                        <OutlineIcons.ExternalLinkIcon className="ml-1 h-4 w-4" />
                    </div>
                </Components.Link>
            </div>

            <div className="flex w-full whitespace-normal">
                <span className="mr-2 text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    DOI:
                </span>
                <Components.Link
                    href={`https://doi.org/${props.publication.doi}`}
                    ariaLabel={`DOI link: https://doi.org/${props.publication.doi}`}
                    className="flex w-full items-center text-sm font-medium text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                    openNew={true}
                >
                    <p className="break-words break-all">https://doi.org/{props.publication.doi}</p>
                    <OutlineIcons.ExternalLinkIcon className="ml-1 h-4 w-4" />
                </Components.Link>
            </div>
            {props.publication.type !== 'PEER_REVIEW' && (
                <div className="flex">
                    <span className="mr-2 text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100">
                        Peer reviews:
                    </span>
                    <Components.Link
                        href="#peer-reviews"
                        ariaLabel="Peer review count"
                        className="flex items-center  text-sm font-medium text-teal-600 transition-colors duration-500 hover:underline dark:text-teal-400"
                    >
                        {peerReviewCount === 0
                            ? 'Write a review'
                            : `${peerReviewCount} review${peerReviewCount > 1 ? 's' : ''}`}
                    </Components.Link>
                </div>
            )}
            {!!activeFlags && (
                <div className="flex">
                    <span className="mr-2 flex items-center text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-100">
                        Red flags:{' '}
                        <div className="mx-1 inline-flex">
                            {uniqueRedFlagCategoryList.map((category) => (
                                <SolidIcons.FlagIcon key={category} className="h-4 w-4 text-red-500" />
                            ))}
                        </div>
                        ({activeFlags.length})
                    </span>
                </div>
            )}
        </>
    );
};

export default General;
