import React from 'react';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Components from '@components';

type Props = {
    link: Interfaces.LinkTo;
    deleteLink: (id: string) => void;
};

const LinkToEntry: React.FC<Props> = (props): React.ReactElement => {
    const [loading, setLoading] = React.useState(false);
    const handleClick = () => {
        setLoading(true);
        props.deleteLink(props.link.id);
    };

    return (
        <tr key={props.link.id}>
            <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                <div className="space-y-2">
                    <span className="font-montserrat text-sm font-medium text-teal-600 transition-colors duration-500 dark:text-teal-100">
                        {Helpers.formatPublicationType(props.link.publicationToRef.type)}
                    </span>
                    <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">
                        {props.link.publicationToRef.title}
                    </p>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-grey-700 transition-colors duration-500 dark:text-white-100">
                            {Helpers.formatDate(props.link.publicationToRef.publishedDate)},
                        </span>
                        <span className="text-sm text-grey-700 transition-colors duration-500 dark:text-white-100">
                            {props.link.publicationToRef.user.firstName[0]}. {props.link.publicationToRef.user.lastName}
                        </span>
                    </div>
                </div>
            </td>
            <td className="space-nowrap py-4 px-8 text-center text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50">
                {loading ? (
                    <Components.IconButton
                        className="p-2"
                        title="Refresh"
                        icon={
                            <OutlineIcons.RefreshIcon
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

export default LinkToEntry;
