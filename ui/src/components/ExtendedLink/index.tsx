import React from 'react';
import * as SolidIcons from '@heroicons/react/24/solid';

import * as Components from '@/components';

type Props = {
    href: string;
    title: string;
    className?: string;
};

const ExtendedLink: React.FC<Props> = (props): React.ReactElement => {
    return (
        <Components.Link
            href={props.href}
            className={`group inline-flex items-center rounded border-transparent text-grey-800 outline-0 focus:ring-2 focus:ring-yellow-400 dark:text-white-50 ${
                props.className ? props.className : ''
            }`}
        >
            <span className="mr-4 border-b-4 border-teal-500 py-2 font-montserrat text-base font-bold transition-colors duration-500 group-hover:border-teal-700">
                {props.title}
            </span>
            <SolidIcons.ArrowRightIcon className="h-9 w-9 stroke-4 text-teal-500 transition-colors duration-500 group-hover:text-teal-700" />
        </Components.Link>
    );
};

export default ExtendedLink;
