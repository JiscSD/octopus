import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    publicationRef: Interfaces.PublicationRef;
    showType: boolean;
    direction?: 'LEFT' | 'RIGHT';
};

const Link: React.FC<Props> = (props) => (
    <div className="mb-2 w-full">
        {props.showType && (
            <span
                className={`mb-4 flex w-fit items-center text-sm text-grey-800 transition-colors duration-500 dark:text-white-50 ${
                    props.direction === 'RIGHT' ? 'lg:ml-auto' : ''
                }`}
            >
                {!!props.direction && props.direction == 'LEFT' && (
                    <OutlineIcons.ArrowLeftIcon className="mr-2 h-4 w-4 text-grey-800 transition-colors duration-500 dark:text-white-50" />
                )}
                {Helpers.formatPublicationType(props.publicationRef.type)}
                {!!props.direction && props.direction == 'RIGHT' && (
                    <OutlineIcons.ArrowRightIcon className="ml-2 h-4 w-4 text-grey-800 transition-colors duration-500 dark:text-white-50" />
                )}
            </span>
        )}
        <Components.Link
            href={`${Config.urls.viewPublication.path}/${props.publicationRef.id}`}
            className="block w-fit rounded text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
        >
            <span className="block font-normal leading-relaxed">{props.publicationRef.versions[0].title}</span>
        </Components.Link>
    </div>
);

export default Link;
