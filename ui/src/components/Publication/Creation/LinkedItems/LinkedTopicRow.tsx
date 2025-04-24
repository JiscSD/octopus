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

    const iconClasses = 'h-6 w-6 text-teal-600 transition-colors duration-500 dark:text-teal-400';
    const tdClasses =
        'whitespace-nowrap py-4 px-3 sm:px-6 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50';

    return (
        <tr key={props.topic.id}>
            <td className={`w-4/5 ${tdClasses}`}>
                <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">{props.topic.title}</p>
            </td>
            <td className={`w-1/5 text-center ${tdClasses}`}>
                <div className="flex items-center justify-center">
                    {props.topic.draft ? (
                        <Components.IconButton
                            className="p-2"
                            title="Delete"
                            icon={
                                loading ? (
                                    <OutlineIcons.ArrowPathIcon
                                        className={iconClasses + ' animate-spin'}
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <OutlineIcons.TrashIcon className={iconClasses} aria-hidden="true" />
                                )
                            }
                            onClick={handleClick}
                            disabled={loading}
                        />
                    ) : (
                        <Components.IconButton
                            className="p-2"
                            disabled
                            title="Deletion forbidden as topic is inherited from previous version"
                            icon={<OutlineIcons.NoSymbolIcon className={iconClasses} aria-hidden="true" />}
                        />
                    )}
                </div>
            </td>
        </tr>
    );
};

export default LinkedTopicRow;
