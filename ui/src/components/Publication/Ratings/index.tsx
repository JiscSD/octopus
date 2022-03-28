import React from 'react';
import * as Router from 'next/router';
import Image from 'next/image';
import * as OutlineIcons from '@heroicons/react/outline';
import fileDownload from 'js-file-download';
import axios from 'axios';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

const handleDownload = async (url: string, fileName: string) => {
    const res = await axios.get(url, {
        responseType: 'blob'
    });

    // @ts-ignore
    fileDownload(res.data, fileName);
};

type Props = {
    publication: Interfaces.Publication;
    sectionList?: { title: string; href: string }[];
};

const RatingsCollection: React.FC<Props> = (props): React.ReactElement => {
    const router = Router.useRouter();

    const peerReviewCount = props.publication.linkedFrom.filter(
        (publication) => publication.publicationFromRef.type === 'PEER_REVIEW'
    ).length;

    return (
        <div className="w-fit space-y-2 rounded bg-white-50 px-6 py-6 shadow transition-colors duration-500 xl:w-full">
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800">Publication type:</span>
                <span className="text-right text-sm font-medium text-grey-800">
                    {Helpers.formatPublicationType(props.publication.type)}
                </span>
            </div>
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800">Published:</span>
                <time className="text-right text-sm font-medium text-grey-800">
                    {Helpers.formatDate(props.publication.publishedDate)}
                </time>
            </div>
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800">Licence:</span>
                <Components.Link
                    href={Config.values.octopusInformation.licences[props.publication.licence].link}
                    title="licence"
                    openNew={true}
                    className="text-right text-sm font-medium text-teal-600 hover:underline"
                >
                    <div className="flex items-center">
                        {Config.values.octopusInformation.licences[props.publication.licence].nicename}
                        <span className="ml-1">4.0</span>
                        <OutlineIcons.ExternalLinkIcon className="ml-1 h-4 w-4" />
                    </div>
                </Components.Link>
            </div>
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800">DOI:</span>
                <Components.Link
                    href={`https://doi.org/${props.publication.doi}`}
                    ariaLabel={`DOI Link ${props.publication.doi}`}
                    className="flex items-center text-right text-sm font-medium text-teal-600 hover:underline"
                    openNew={true}
                >
                    <span>{props.publication.doi ?? '10.X/octopus.12345.6'}</span>
                    <OutlineIcons.ExternalLinkIcon className="ml-1 h-4 w-4" />
                </Components.Link>
            </div>
            {props.publication.type !== 'PEER_REVIEW' && (
                <div className="flex">
                    <span className="mr-2 text-sm font-semibold text-grey-800">Peer reviews:</span>
                    <Components.Link
                        href="#peer-reviews"
                        ariaLabel="Peer review count"
                        className="flex items-center text-right text-sm font-medium text-teal-600 hover:underline"
                    >
                        {peerReviewCount === 0
                            ? 'Write a review'
                            : `${peerReviewCount} review${peerReviewCount > 1 ? 's' : ''}`}
                    </Components.Link>
                </div>
            )}

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-grey-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white-50 px-2 text-xs text-grey-500">Actions</span>
                </div>
            </div>
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800">Download:</span>
                <button
                    aria-label="Print button"
                    onClick={() => window.print()}
                    className="mr-4 flex items-center text-right text-sm font-medium text-teal-600 hover:underline"
                >
                    <Image src="/images/pdf.svg" alt="PDF Icon" width={18} height={18} />
                    <span className="ml-1">pdf</span>
                </button>
                <button
                    aria-label="Download JSON"
                    onClick={() =>
                        handleDownload(
                            `https://int.api.octopus.ac/v1/publications/${props.publication.id}`,
                            `${props.publication.id}.json`
                        )
                    }
                    className="mr-4 flex items-center text-right text-sm font-medium text-teal-600 hover:underline"
                >
                    <Image src="/images/json.svg" alt="PDF Icon" width={18} height={18} />
                    <span className="ml-1">json</span>
                </button>
            </div>
            <div className="flex">
                <button
                    aria-label="Write review button"
                    onClick={() => {
                        router.push({
                            pathname: `${Config.urls.createPublication.path}`,
                            query: {
                                for: props.publication.id,
                                type: 'PEER_REVIEW'
                            }
                        });
                    }}
                    className="flex items-center text-right text-sm font-medium text-teal-600 hover:underline"
                >
                    Write a review
                </button>
            </div>
            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-grey-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white-50 px-2 text-xs text-grey-500">Sections</span>
                </div>
            </div>
            {!!props.sectionList && (
                <div className="space-y-2">
                    {props.sectionList.map((section) => (
                        <button
                            key={section.href}
                            aria-label={section.title}
                            onClick={() =>
                                document.getElementById(section.href)?.scrollIntoView({ behavior: 'smooth' })
                            }
                            className="mr-2 mb-2 block text-sm font-medium text-teal-600 hover:underline"
                        >
                            {section.title}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RatingsCollection;
