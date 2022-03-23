import React from 'react';
import * as Router from 'next/router';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    publication: Interfaces.Publication;
};

const RatingsCollection: React.FC<Props> = (props): React.ReactElement => {
    const router = Router.useRouter();
    return (
        <div className="w-fit space-y-2 rounded bg-white-50 px-6 py-6 transition-colors duration-500 xl:w-full">
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
                    href={
                        Config.values.licenceTypes.find((licence) => licence.value === props.publication.licence)
                            ?.link || ''
                    }
                    title="licence"
                    openNew={true}
                    className="text-right text-sm font-medium text-teal-600 underline"
                >
                    <div className="flex items-center">
                        {
                            Config.values.licenceTypes.find((licence) => licence.value === props.publication.licence)
                                ?.nicename
                        }
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
                    className="flex items-center text-right text-sm font-medium text-teal-600 underline"
                    openNew={true}
                >
                    <span>{props.publication.doi ?? '10.X/octopus.12345.6'}</span>
                    <OutlineIcons.ExternalLinkIcon className="ml-1 h-4 w-4" />
                </Components.Link>
            </div>
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800">Peer reviews:</span>
                <Components.Link
                    href="#peer-reviews"
                    ariaLabel="Peer review count"
                    className="flex items-center text-right text-sm font-medium text-teal-600 underline"
                >
                    (7)
                </Components.Link>
            </div>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-grey-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white-50 px-2 text-xs text-grey-500">Actions</span>
                </div>
            </div>
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800">Download PDF:</span>
                <button
                    aria-label="Print button"
                    onClick={() => window.print()}
                    className="flex items-center text-right text-sm font-medium text-teal-600 underline"
                >
                    Click here
                </button>
            </div>
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800">Write a review:</span>
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
                    className="flex items-center text-right text-sm font-medium text-teal-600 underline"
                >
                    Click here
                </button>
            </div>
        </div>
    );
};

export default RatingsCollection;
