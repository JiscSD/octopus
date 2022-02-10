import React from 'react';

import * as Interfaces from '@interfaces';
import * as Types from '@types';

type Props = {
    user: Interfaces.User;
};

const Breakdown: React.FC<Props> = (props): JSX.Element => {
    console.log(props.user);

    return (
        <div className="w-fit rounded-lg border border-grey-100 bg-white p-8 transition-colors duration-500 dark:border-grey-400 dark:bg-grey-600"></div>
    );
};

export default Breakdown;
