import * as Interfaces from '@interfaces';
import React from 'react';

type Props = {
    flag: Interfaces.Flag;
};

const Preview: React.FC<Props> = (props) => {
    return <div>{props.flag.category}</div>;
};

export default Preview;
