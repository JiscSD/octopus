import React from 'react';

import * as Interfaces from '@/interfaces';

type Props = {
    user: Pick<Interfaces.CoreUser, 'firstName' | 'lastName'>;
    className?: string;
};

// Render a circle with the user's initials, or AU (Anonymous User) if their names are hidden at orcid level.
const Avatar: React.FC<Props> = (props): React.ReactElement => (
    <div
        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-teal-500 font-montserrat font-semibold leading-none tracking-tighter text-grey-800 transition-colors duration-500 dark:text-white-50 ${
            props.className ? props.className : ''
        }`}
    >
        {!props.user.firstName && !props.user.lastName ? 'AU' : `${props.user.firstName[0]} ${props.user.lastName[0]}`}
    </div>
);

export default Avatar;
