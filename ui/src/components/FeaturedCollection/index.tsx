import React from 'react';

import * as Interfaces from '@interfaces';
import * as Components from '@components';

type Props = {
    publications: Interfaces.Publication[];
    limit: number;
};

const FeaturedCollection: React.FC<Props> = (props): JSX.Element => (
    <div className="rounded-xl bg-teal-100 p-6 transition-colors duration-500 dark:bg-grey-900 lg:p-10">
        <h2 className="mb-6 block font-montserrat text-xl font-bold leading-none text-grey-800 transition-colors duration-500 dark:text-white">
            Featured publications
        </h2>
        <h3 className="mb-6 block font-montserrat text-lg font-medium text-grey-700 transition-colors duration-500 dark:text-grey-50 ">
            Here&apos;s what the Octopus team have been interested in this month
        </h3>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {props.publications.map(
                (publication: Interfaces.Publication, index: number): JSX.Element => (
                    <Components.PublicationCard key={index} publication={publication} />
                )
            )}
        </div>
    </div>
);

export default FeaturedCollection;
