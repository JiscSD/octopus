import React from 'react';

import * as Interfaces from '@interfaces';

type Props = {
    user: Interfaces.User;
    className?: string;
};

const Avatar: React.FC<Props> = (props): JSX.Element => {
    return (
        <div
            className={`flex h-14 w-14 items-center justify-center rounded-full border-2 border-teal-500 ${
                props.className ? props.className : ''
            }`}
        >
            <span className="font-montserrat font-semibold leading-none tracking-tighter text-grey-800">
                {props.user.firstName[0]} {props.user.lastName[0]}
            </span>
        </div>
    );
};

export default Avatar;
