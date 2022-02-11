import React from 'react';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    publications: Interfaces.Publication[];
};

const Breakdown: React.FC<Props> = (props): JSX.Element => (
    <div className="grid w-fit grid-cols-1 gap-8 rounded-3xl border border-grey-100 bg-white px-8 py-10 transition-colors duration-500 dark:border-grey-400 dark:bg-grey-600 lg:grid-cols-2">
        <div>circle here</div>

        <div>
            {Config.values.publicationTypes.map((type) => {
                const publicationsOfType = props.publications.filter((publication) => publication.type === type);
                const count = publicationsOfType.length;

                return (
                    <div key={type} className="flex">
                        <span className="min-w-[12rem] text-right">{Helpers.formatPublicationType(type)}</span>
                        <span className="mx-4 min-w-[1.5rem]">({count})</span>
                        <Components.ProgressBar value={Helpers.percentage(count, 100)} />
                    </div>
                );
            })}
        </div>
    </div>
);

export default Breakdown;
