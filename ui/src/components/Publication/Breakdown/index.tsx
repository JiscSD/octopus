import React from 'react';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    publications: Interfaces.Publication[];
};

const Breakdown: React.FC<Props> = (props): JSX.Element => {
    const [values, _] = React.useState([
        ...Config.values.publicationTypes.map((type) => {
            const publicationsOfType = props.publications.filter((publication) => publication.type === type);
            const count = publicationsOfType.length;

            return {
                title: Helpers.formatPublicationType(type),
                color: Helpers.randomColor(),
                value: count ? count : 0
            };
        })
    ]);

    return (
        <div className="w-fit rounded-3xl border border-grey-100 bg-white px-8 py-10 transition-colors duration-500 dark:border-grey-400 dark:bg-grey-600">
            <div className="inline-flex">
                <Components.ProgressCircle
                    title="100"
                    subTitle="text here"
                    values={values}
                    width={100}
                    height={100}
                    thickness={15}
                />
            </div>

            <div className="inline-block">
                {values.map((value) => (
                    <div key={value.value} className="flex">
                        <span className="min-w-[12rem] text-right">{value.title}</span>
                        <span className="mx-4 min-w-[1.5rem]">({value.value})</span>
                        <Components.ProgressBar
                            value={Math.round(Helpers.percentage(value.value, props.publications.length))}
                            color={value.color}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Breakdown;
