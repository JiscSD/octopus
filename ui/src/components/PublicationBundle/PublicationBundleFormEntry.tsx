import * as OutlineIcons from '@heroicons/react/24/outline';
import React from 'react';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Props = {
    entry: Interfaces.ClientPublicationBundle['entries'][number];
    onDelete: (publicationId: string) => Promise<void>;
    editable?: boolean;
    deleting?: boolean;
};

const PublicationBundleFormEntry = (props: Props): JSX.Element => {
    const { entry, editable, onDelete, deleting } = props;

    const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
        id: entry.id
    });

    const getItemStyle = (isDragging: boolean): React.CSSProperties => ({
        boxShadow: isDragging ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' : undefined,
        filter: isDragging ? 'opacity(0.7)' : undefined,
        position: isDragging ? 'relative' : 'inherit',
        userSelect: 'none',
        zIndex: isDragging ? 1000 : 1
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...getItemStyle(isDragging)
    };

    const iconClasses = 'h-6 w-6 text-teal-600 transition-colors duration-500 dark:text-teal-400';

    const tdClasses = 'py-4 px-3 sm:px-6 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50';

    return (
        <tr key={entry.id} ref={setNodeRef} style={style}>
            {editable ? (
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                    <span
                        className="rounded-sm outline-2 outline-offset-2 outline-yellow-400 hover:cursor-grab"
                        title="Drag to reorder authors"
                        {...attributes}
                        {...listeners}
                    >
                        <OutlineIcons.Bars3Icon className="h-5 w-5 text-teal-700 transition-colors duration-500 dark:text-white-50" />
                    </span>
                </td>
            ) : null}
            <td className={`w-3/5 ${tdClasses}`}>
                <div className="space-y-2">
                    <span className="font-montserrat text-sm font-medium text-teal-600 transition-colors duration-500 dark:text-teal-100">
                        {Helpers.formatPublicationType(entry.publication.type)}
                    </span>
                    <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">
                        {entry.publication.title}
                    </p>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-grey-700 transition-colors duration-500 dark:text-white-100">
                            <time suppressHydrationWarning>{Helpers.formatDate(entry.publication.publishedDate)}</time>,
                        </span>
                        <span className="text-sm text-grey-700 transition-colors duration-500 dark:text-white-100">
                            {Helpers.abbreviateUserName({
                                firstName: entry.publication.authorFirstName,
                                lastName: entry.publication.authorLastName
                            })}
                        </span>
                    </div>
                </div>
            </td>
            <td className={`w-1/5 text-center font-medium ${tdClasses}`}>
                <div className="flex items-center justify-center">
                    <Components.Link
                        href={`${Config.urls.viewPublication.path}/${entry.publicationId}`}
                        openNew={true}
                        ariaLabel={'Visit publication'}
                        className="p-2"
                    >
                        <OutlineIcons.ArrowTopRightOnSquareIcon className={iconClasses} />
                    </Components.Link>
                </div>
            </td>
            {editable ? (
                <td className={`w-1/5 text-center font-medium ${tdClasses}`}>
                    <div className="flex items-center justify-center">
                        <Components.IconButton
                            className="p-2"
                            title="Delete"
                            icon={
                                deleting ? (
                                    <OutlineIcons.ArrowPathIcon
                                        className={iconClasses + ' animate-spin'}
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <OutlineIcons.TrashIcon className={iconClasses} aria-hidden="true" />
                                )
                            }
                            onClick={async () => await onDelete(entry.id)}
                            disabled={deleting}
                        />
                    </div>
                </td>
            ) : null}
        </tr>
    );
};

export default PublicationBundleFormEntry;
