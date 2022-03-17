import React from 'react';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    publications: Interfaces.Publication[];
};

const Breakdown: React.FC<Props> = (props): JSX.Element => {
    const values = React.useMemo(
        () => [
            ...Config.values.publicationTypes.map((type) => {
                const publicationsOfType = props.publications.filter((publication) => publication.type === type);
                const count = publicationsOfType.length;

                return {
                    title: Helpers.formatPublicationType(type),
                    color: Helpers.publicationColor(type),
                    value: count ? count : 0
                };
            })
        ],
        [props.publications]
    );

    const totalCount = React.useMemo(() => values.reduce((sum, curr) => sum + curr.value, 0), [values]);
    const highestValue = React.useMemo(
        () => values.reduce((sum, curr) => (sum > curr.value ? sum : curr.value), 0),
        [values]
    );

    return (
        <div className="grid w-full gap-8 rounded-3xl border border-grey-100 bg-white px-8 py-10 transition-colors duration-500 dark:border-grey-400 dark:bg-grey-600 lg:w-1/2 3xl:grid-cols-3">
            {/** circle */}
            <div className="relative mx-auto">
                <Components.ProgressCircle values={values} width={100} height={100} thickness={20} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="mb-4 block text-center font-montserrat text-5xl font-medium text-teal-500 transition-colors duration-500 dark:text-white">
                        {totalCount}
                    </span>
                    <span className="block text-center font-montserrat text-2xl transition-colors duration-500 dark:text-grey-50">
                        Publications
                    </span>
                </div>
            </div>

            {/** bars */}
            <div className="grid items-center gap-y-3 lg:gap-y-0">
                {values.map((value) => {
                    const valuePercentage = Math.round(Helpers.percentage(value.value, props.publications.length));
                    const highestPercentage = Math.round(Helpers.percentage(highestValue, props.publications.length));

                    let max = highestPercentage;
                    if (highestPercentage > 350) max = 350;
                    if (highestPercentage < 200) max = 200;

                    return (
                        <div
                            key={value.title}
                            className="grid grid-cols-[auto_auto] lg:grid-cols-[minmax(12.5rem_,_max-content)_minmax(6rem_,_max-content)_auto]"
                        >
                            <span
                                key={value.title}
                                className="font-montserrat transition-colors duration-500 dark:text-grey-100 lg:text-right"
                            >
                                {value.title}
                            </span>
                            <span
                                key={value.value}
                                className="mx-4 text-right font-montserrat transition-colors duration-500 dark:text-grey-100 lg:text-center"
                            >
                                ({value.value})
                            </span>
                            <Components.ProgressBar
                                key={value.color}
                                value={Helpers.percentage(valuePercentage, highestPercentage)}
                                color={value.color}
                                width={max}
                                className="col-span-2 mt-1 h-4 lg:col-span-1 lg:mt-0 lg:h-full"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Breakdown;
