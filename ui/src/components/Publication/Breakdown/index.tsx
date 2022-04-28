import React from 'react';
import * as Chart from 'react-chartjs-2';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    publications: Interfaces.Publication[];
};

const data = {};

const Breakdown: React.FC<Props> = (props): React.ReactElement => {
    const values = React.useMemo(
        () => [
            ...Object.values(Config.values.octopusInformation.publications).map((publication) => ({
                heading: publication.heading,
                count: props.publications.filter((pub) => pub.type === publication.id).length || 0
            }))
        ],
        [props.publications]
    );

    const data = React.useMemo(
        () => ({
            labels: values.map((value) => value.heading),
            datasets: [
                {
                    label: 'Publications',
                    data: values.map((value) => value.count),
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }
            ]
        }),
        [values]
    );

    return (
        <div>
            <Chart.Radar data={data} />
        </div>
    );
};

export default Breakdown;
