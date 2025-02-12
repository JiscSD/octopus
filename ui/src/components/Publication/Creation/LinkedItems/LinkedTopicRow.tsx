import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as Interfaces from '@/interfaces';
import * as Components from '@/components';

type Props = {
    topic: Interfaces.BaseTopic;
    deleteTopic: (id: string) => Promise<void>;
};

const LinkedTopicRow: React.FC<Props> = (props): React.ReactElement => {
    const [loading, setLoading] = React.useState(false);
    const handleClick = async () => {
        setLoading(true);
        await props.deleteTopic(props.topic.id);
        setLoading(false);
    };

    return (
        <tr key={props.topic.id}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">{props.topic.title}</p>
            </td>
            <td className="whitespace-nowrap px-8 py-4 text-center text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50">
                {props.topic.draft ? (
                    loading ? (
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
                    )
                ) : (
                    <Components.IconButton
                        className="p-2"
                        disabled
                        title="Deletion forbidden as topic is inherited from previous version"
                        icon={
                            <OutlineIcons.NoSymbolIcon
                                className="h-6 w-6 text-teal-600 transition-colors duration-500 dark:text-teal-400"
                                aria-hidden="true"
                            />
                        }
                    />
                )}
            </td>
        </tr>
    );
};

export default LinkedTopicRow;
