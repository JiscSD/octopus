import React from 'react';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';

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
                <div>
                    <p className="mb-2">{props.link.publicationToRef.title}</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-grey-700">
                            {Helpers.formatDate(props.link.publicationToRef.publishedDate)},
                        </span>
                        <span className="text-xs text-grey-700">
                            {props.link.publicationToRef.user.firstName[0]}. {props.link.publicationToRef.user.lastName}
                        </span>
                    </div>
                </div>
            </td>
            <td className="space-nowrap py-4 text-center text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50">
                <button onClick={handleClick} className="rounded-full">
                    {loading ? (
                        <OutlineIcons.RefreshIcon className="h-6 w-6 animate-reverse-spin text-teal-600" />
                    ) : (
                        <OutlineIcons.TrashIcon className="h-6 w-6 text-teal-600" />
                    )}
                </button>
            </td>
        </tr>
    );
};

export default LinkToEntry;
