import React from 'react';
import * as OutlineIcons from '@heroicons/react/outline';
import * as SolidIcons from '@heroicons/react/solid';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    publicationId: string;
    flag: Interfaces.Flag;
};

const Preview: React.FC<Props> = (props) => (
    <Components.Link
        href={`${Config.urls.viewFlagThread.path}/${props.publicationId}/flag/${props.flag.id}`}
        title={`View ${props.flag.resolved ? 'resolved' : ''} comment thread`}
        ariaLabel={`Red flag preview by ${props.flag.user.firstName} ${props.flag.user.lastName}`}
        className={`block w-fit space-y-1 decoration-grey-800 dark:decoration-grey-100 ${
            props.flag.resolved ? 'line-through opacity-50 dark:opacity-75' : 'hover:underline'
        }`}
    >
        <span className="flex items-center space-x-2">
            {props.flag.resolved ? (
                <OutlineIcons.FlagIcon className="h-4 w-4 text-red-500" />
            ) : (
                <SolidIcons.FlagIcon className="h-4 w-4 text-red-500" />
            )}
            <span className="text-grey-800 transition-colors duration-500 dark:text-white-100">
                {Config.values.octopusInformation.redFlagReasons[props.flag.category].nicename}
            </span>
        </span>
        <span className="ml-6 text-sm text-grey-600 transition-colors duration-500 dark:text-grey-100">
            Flagged by {props.flag.user.firstName} {props.flag.user.lastName},{' '}
            {Helpers.formatDate(props.flag.createdAt)}
        </span>
    </Components.Link>
);

export default Preview;
