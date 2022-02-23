import React from 'react';

import * as Interfaces from '@interfaces';

type Props = {
    user: Interfaces.User;
    className?: string;
};

const Avatar: React.FC<Props> = (props): JSX.Element => {
    return (
        <div
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-teal-500 font-montserrat font-semibold leading-none tracking-tighter text-grey-800 transition-colors duration-500 dark:text-white ${
                props.className ? props.className : ''
            }`}
        >
            {props.user.firstName[0]} {props.user.lastName[0]}
        </div>
    );
};

export default Avatar;
