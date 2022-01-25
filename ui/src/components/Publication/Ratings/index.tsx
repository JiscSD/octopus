import React from 'react';
import useSWR from 'swr';
import { StarIcon as StarIconOutline } from '@heroicons/react/outline';
import { DownloadIcon, StarIcon as StarIconSolid } from '@heroicons/react/solid';

import * as Interfaces from '@interfaces';
import * as Config from '@config';
import * as Helpers from '@helpers';

type RateProps = {
    title: string;
    value: number;
};

const Rate: React.FC<RateProps> = (props): JSX.Element => {
    const arrange = (value: number) => {
        return (
            <div className="flex items-center justify-end">
                {new Array(value).fill(0).map((_, i) => (
                    <StarIconSolid key={i} className="h-6 w-6 text-teal-700" />
                ))}
                {new Array(5 - value).fill(0).map((_, i) => (
                    <StarIconOutline key={i} className="h-6 w-6 text-teal-700" />
                ))}
            </div>
        );
    };

    return (
        <div className="mb-2 grid grid-cols-2 items-center gap-8">
            <span className="font-montserrat text-sm font-medium text-grey-800">
                {props.title}({props.value})
            </span>
            {arrange(props.value)}
        </div>
    );
};

type Props = {
    publication: Interfaces.Publication;
};

const Ratings: React.FC<Props> = (props): JSX.Element => {
    // Make api call to get publications ratings
    // const { data, error } = useSWR(`${Config.endpoints.ratings}?id=${props.publicationId}`);

    // Mock
    const data = {
        wellDefined: {
            title: 'Well defined',
            value: 3
        },
        original: {
            title: 'Original',
            value: 2
        },
        valid: {
            title: 'Scientifically valid',
            value: 4
        }
    };

    const [ratings, setRatings] = React.useState(data);

    const writeReview = (e: React.MouseEvent) => {
        console.log(e);
    };

    return (
        <div className="rounded-xl">
            <div className="rounded-t-lg bg-teal-100 px-8 py-6 transition-colors duration-500">
                {/* {Object.values(ratings).map((rate: RateProps, index) => (
                    <Rate key={index} title={rate.title} value={rate.value} />
                ))} */}

                {/* <button
                    type="button"
                    onClick={(e) => writeReview(e)}
                    className="f my-6 block rounded border-transparent text-sm font-bold underline outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    Rate this publication
                </button> */}

                <div className="grid grid-cols-2 gap-8">
                    <span className="text-sm font-semibold text-grey-800">Date added:</span>
                    <time className="text-right text-sm font-medium text-grey-800">
                        {Helpers.formatDate(props.publication.createdAt)}
                    </time>
                </div>
            </div>
            <button
                type="button"
                onClick={() => window.print()}
                className="flex w-full items-center justify-between rounded rounded-b-lg border-transparent bg-teal-700 px-8 py-6 font-montserrat font-semibold text-white outline-0 transition-colors duration-500 hover:text-grey-100 focus:ring-2 focus:ring-yellow-400"
            >
                Download as PDF
                <DownloadIcon className="h-6 w-6" />
            </button>
        </div>
    );
};

export default Ratings;
