import React from 'react';
import * as Charts from 'react-minimal-pie-chart';

interface Data {
    color: string;
    value: number;
    key?: string | number;
    title?: string | number;
    [key: string]: any;
}

type Props = {
    width: number;
    height: number;
    thickness: number;
    values: Data[];
};

const Circle: React.FC<Props> = (props): React.ReactElement => (
    <Charts.PieChart
        data={props.values}
        animate={true}
        viewBoxSize={[props.width, props.height]}
        lineWidth={props.thickness}
    />
);

export default Circle;
