import React from 'react';
import useSWR from 'swr';
import * as Framer from 'framer-motion';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Types from '@types';

type RatingProps = {
    label: string;
    ratingType: Types.Ratings;
    ratings?: Interfaces.Rating;
};

const Rating: React.FC<RatingProps> = (props): React.ReactElement => {
    const average = props.ratings?.aggregate.find((aggregate) => aggregate.category === props.ratingType);

    const percentage = React.useMemo(() => {
        return average?._avg.rating ? Helpers.percentage(Math.round(average._avg.rating), 10) : 0;
    }, [average]);

    return (
        <div>
            <span className="mb-1 block text-xs text-grey-700 transition-colors duration-500 dark:text-grey-50">
                {props.label} ({average ? average._count.id : '0'})
            </span>
            <span className="relative block h-2 w-full overflow-hidden rounded bg-teal-200 transition-colors duration-500 dark:bg-teal-100">
                <Framer.motion.span
                    initial={{ width: '0%' }}
                    animate={{ width: `${percentage}%`, type: 'spring' }}
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
            <Components.SectioBreak name="Ratings" />
            <div className="space-y-3">
                {Object.values(Config.values.octopusInformation.publications[props.type].ratings).map((rating) => (
                    <Rating key={rating.id} label={rating.value} ratingType={rating.id} ratings={data?.data.ratings} />
                ))}
            </div>
        </>
    );
};

export default Ratings;
