import React from 'react';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';

type Props = {
    title: string;
    content: string;
    icon: React.ReactElement;
    link: string;
    linkText: string;
};

const ActionCard: React.FC<Props> = (props): React.ReactElement => (
    <div className="space-y-6 rounded-xl bg-white py-6 px-6 shadow-lg transition-colors duration-500 dark:bg-grey-700">
        {props.icon}
        <h3 className="block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white">
            {props.title}
        </h3>
        <p className="block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50">
            {props.content}
        </p>
        <Components.Button
            link
            href={props.link}
            title={props.linkText}
            iconPosition="RIGHT"
            icon={
                <OutlineIcons.ArrowRightIcon className="h-4 w-4 text-teal-500 transition-colors duration-500 dark:text-white" />
            }
        />
    </div>
);

export default ActionCard;
