import React from 'react';
import useSWR from 'swr';
import * as Framer from 'framer-motion';

import * as Interfaces from '@interfaces';
import * as Config from '@config';
import * as Types from '@types';

type RatingProps = {
    label: string;
    ratingType: Types.Ratings;
    ratings?: Interfaces.Rating;
};

const Rating: React.FC<RatingProps> = (props): React.ReactElement => {
    const average = props.ratings?.aggregate.find((aggregate) => aggregate.category === props.ratingType);
    return (
        <div>
            <span className="mb-1 block text-xs text-grey-700">
                {props.label} ({average ? average._count.id : '0'})
            </span>
            <span className="relative block h-2 w-full overflow-hidden rounded bg-teal-200">
                <Framer.motion.span
                    initial={{ width: '0%' }}
                    animate={{ width: `${average?._avg.rating}0%`, type: 'spring' }}
                    transition={{ duration: 0.25 }}
                    className="absolute left-0 top-0 h-full rounded bg-teal-500"
                />
            </span>
        </div>
    );
};

type RatingsProps = {
    id: string;
    type: Types.PublicationType;
};

const Ratings: React.FC<RatingsProps> = (props): React.ReactElement => {
    const { data } = useSWR(`${Config.endpoints.publications}/${props.id}`, null, {
        fallback: {}
    });

    return (
        <>
            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-grey-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white-50 px-2 text-xs text-grey-500">Ratings</span>
                </div>
            </div>
            <div className="space-y-3">
                {Config.values.octopusInformation.publications[props.type].ratings.map((rating) => (
                    <Rating key={rating.id} label={rating.value} ratingType={rating.id} ratings={data?.data.ratings} />
                ))}
            </div>
        </>
    );
};

export default Ratings;
