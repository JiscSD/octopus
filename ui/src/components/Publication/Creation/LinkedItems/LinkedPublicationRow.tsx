import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Interfaces from '@/interfaces';
import * as Helpers from '@/helpers';
import * as Components from '@/components';

type Props = {
    linkedPublication: Interfaces.LinkedToPublication;
    deleteLink: (id: string) => Promise<void>;
};

const LinkedPublicationRow: React.FC<Props> = (props): React.ReactElement => {
    const [loading, setLoading] = React.useState(false);
    const handleClick = async () => {
        setLoading(true);
        await props.deleteLink(props.linkedPublication.linkId);
        setLoading(false);
    };

    return (
        <tr key={props.linkedPublication.id}>
            <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                <div className="space-y-2">
                    <span className="font-montserrat text-sm font-medium text-teal-600 transition-colors duration-500 dark:text-teal-100">
                        {Helpers.formatPublicationType(props.linkedPublication.type)}
                    </span>
                    <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">
                        {props.linkedPublication.title}
                    </p>
                    <div className="flex items-center space-x-2">
                        <time
                            className="text-xs text-grey-700 transition-colors duration-500 dark:text-white-100"
                            suppressHydrationWarning
                        >
                            {Helpers.formatDate(props.linkedPublication.publishedDate)},
                        </time>
                        <span className="text-sm text-grey-700 transition-colors duration-500 dark:text-white-100">
                            {props.linkedPublication.authorFirstName[0]}. {props.linkedPublication.authorLastName}
                        </span>
                    </div>
                </div>
            </td>
            <td className="space-nowrap px-8 py-4 text-center text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50">
                {props.linkedPublication.draft ? (
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
                        title="Deletion forbidden as link is inherited from previous version"
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

export default LinkedPublicationRow;
