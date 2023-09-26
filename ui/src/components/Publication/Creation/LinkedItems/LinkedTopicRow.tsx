import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Components from '@components';

type Props = {
    topic: Interfaces.BaseTopic;
    deleteTopic: (id: string) => void;
};

const LinkedTopicRow: React.FC<Props> = (props): React.ReactElement => {
    const [loading, setLoading] = React.useState(false);
    const handleClick = () => {
        setLoading(true);
        props.deleteTopic(props.topic.id);
    };

    return (
        <tr key={props.topic.id}>
            <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">{props.topic.title}</p>
            </td>
            <td className="space-nowrap px-8 py-4 text-center text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50">
                {loading ? (
                    <Components.IconButton
                        className="p-2"
                        title="Refresh"
                        icon={
                            <OutlineIcons.ArrowPathIcon
                                className="h-6 w-6 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400"
                                aria-hidden="true"
                            />
                        }
                        onClick={handleClick}
                    />
                ) : (
                    <Components.IconButton
                        className="p-2"
                        title="Delete"
                        icon={
                            <OutlineIcons.TrashIcon
                                className="h-6 w-6 text-teal-600 transition-colors duration-500 dark:text-teal-400"
                                aria-hidden="true"
                            />
                        }
                        onClick={handleClick}
                    />
                )}
            </td>
        </tr>
    );
};

export default LinkedTopicRow;
