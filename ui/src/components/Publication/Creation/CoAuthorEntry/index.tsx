import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as Components from '@/components';
import * as Interfaces from '@/interfaces';
import * as Config from '@/config';

import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

type Props = {
    coAuthor: Interfaces.CoAuthor;
    deleteCoAuthor: (id: string) => void;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
    isMainAuthor?: boolean;
    entryProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
};

const CoAuthorEntry: React.FC<Props> = (props): React.ReactElement => {
    const handleClick = () => {
        props.deleteCoAuthor(props.coAuthor.id);
    };

    return (
        <tr {...props.entryProps}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                <span
                    {...props.dragHandleProps}
                    className="rounded-sm outline-2 outline-offset-2 outline-yellow-400"
                    title="Drag to reorder authors"
                >
                    <OutlineIcons.Bars3Icon className="h-5 w-5 text-teal-700 transition-colors duration-500 dark:text-white-50" />
                </span>
            </td>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                <div className="space-y-2">
                    {props.isMainAuthor ? (
                        <span className="leading-10">N/A</span>
                    ) : props.coAuthor.confirmedCoAuthor ? (
                        <span title={`${props.coAuthor.email} has given approval for this publication to published.`}>
                            <OutlineIcons.CheckBadgeIcon className="h-5 w-5 text-orcid transition-colors duration-500 dark:text-white-50" />
                        </span>
                    ) : (
                        <span
                            title={`${props.coAuthor.email} is yet to give approval for this publication to be published.`}
                        >
                            <div title="Request to be sent when draft editing is complete">
                                <OutlineIcons.ShieldExclamationIcon className="h-5 w-5 text-red-700 transition-colors duration-500 dark:text-white-50" />
                            </div>
                        </span>
                    )}
                </div>
            </td>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                <div className="space-y-2">
                    {props.isMainAuthor ? (
                        'N/A'
                    ) : props.coAuthor.approvalRequested ? (
                        <span title="Request sent">
                            <div title="Request sent">
                                <OutlineIcons.EnvelopeIcon className="h-5 w-5 text-green-400 transition-colors duration-500 dark:text-green-50" />
                            </div>
                        </span>
                    ) : (
                        <span title="Request to be sent when draft editing is complete">
                            <div title="Request to be sent when draft editing is complete">
                                <OutlineIcons.EnvelopeOpenIcon className="h-5 w-5 text-yellow-600 transition-colors duration-500 dark:text-yellow-500" />
                            </div>
                        </span>
                    )}
                </div>
            </td>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                <div className="space-y-2">
                    <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">
                        {props.coAuthor.email}
                    </p>
                </div>
            </td>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                <div className="space-y-2">
                    {props.coAuthor.user ? (
                        <Components.Link
                            href={`${Config.urls.viewUser.path}/${props.coAuthor.linkedUser}`}
                            openNew={true}
                            className="underline"
                        >
                            <div className="min-w-[200px]">
                                {props.coAuthor.user.firstName} {props.coAuthor.user.lastName} (
                                {props.coAuthor.user.orcid})
                            </div>
                        </Components.Link>
                    ) : (
                        <span title={`${props.coAuthor.email} has not yet confirmed they are a co-author.`}>
                            <OutlineIcons.MinusCircleIcon className="h-5 w-5 text-grey-600 transition-colors duration-500 dark:text-white-50" />
                        </span>
                    )}
                </div>
            </td>
            <td className="whitespace-nowrap px-8 py-4 text-center text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50">
                {!props.isMainAuthor && (
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

export default React.memo(CoAuthorEntry);
