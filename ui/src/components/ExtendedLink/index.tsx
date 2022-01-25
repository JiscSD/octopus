import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/solid';

import * as Components from '@components';

type Props = {
    href: string;
    title: string;
    className?: string;
};

const ExtendedLink: React.FC<Props> = (props): JSX.Element => {
    return (
        <Components.Link
            href={props.href}
            className={`group inline-flex items-center text-grey-800 dark:text-white rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400 ${props.className}`}
        >
            <span className='mr-4 py-2 font-montserrat font-bold text-base border-b-4 border-teal-500 group-hover:border-teal-700 transition-colors duration-500'>
                {props.title}
            </span>
            <ArrowRightIcon className='w-9 h-9 stroke-4 text-teal-500 group-hover:text-teal-700 transition-colors duration-500' />
        </Components.Link>
    );
};

export default ExtendedLink;
