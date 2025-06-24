import React from 'react';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as OutlineIcons from '@heroicons/react/24/outline';

type Props = {
    deleteLink: (id: string) => Promise<void>;
    linkedPublication: Interfaces.LinkedToPublication;
    markLinkForDeletion: (id: string, toDelete: boolean) => Promise<void>;
};

const LinkedPublicationRow: React.FC<Props> = (props): React.ReactElement => {
    const [loading, setLoading] = React.useState(false);
    const inherited = !props.linkedPublication.draft;

    const handleDelete = async () => {
        setLoading(true);
        await props.deleteLink(props.linkedPublication.linkId);
        setLoading(false);
    };
    const handleMarkForDeletion = async (toDelete: boolean) => {
        setLoading(true);
        await props.markLinkForDeletion(props.linkedPublication.linkId, toDelete);
        setLoading(false);
    };
    const iconClasses = 'h-6 w-6 text-teal-600 transition-colors duration-500 dark:text-teal-400';
    const tdClasses = 'py-4 px-3 sm:px-6 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50';

    return (
        <tr key={props.linkedPublication.id}>
            <td className={`${inherited ? 'w-1/2' : 'w-2/3'} ${tdClasses}`}>
                <div className="space-y-2">
                    <span className="font-montserrat text-sm font-medium text-teal-600 transition-colors duration-500 dark:text-teal-100">
                        {Helpers.formatPublicationType(props.linkedPublication.type)}
                    </span>
                    <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">
                        {props.linkedPublication.title}
                    </p>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-grey-700 transition-colors duration-500 dark:text-white-100">
                            {props.linkedPublication.publishedDate ? (
                                <time suppressHydrationWarning>
                                    {Helpers.formatDate(props.linkedPublication.publishedDate)}
                                </time>
                            ) : (
                                'Draft'
                            )}
                            ,
                        </span>
                        <span className="text-sm text-grey-700 transition-colors duration-500 dark:text-white-100">
                            {Helpers.abbreviateUserName({
                                firstName: props.linkedPublication.authorFirstName,
                                lastName: props.linkedPublication.authorLastName
                            })}
                        </span>
                    </div>
                </div>
            </td>
            {inherited && (
                <td className={`w-1/6 font-medium ${tdClasses}`}>
                    {props.linkedPublication.pendingDeletion
                        ? 'To be deleted when published'
                        : 'To be retained when published'}
                </td>
            )}
            <td className={`w-1/6 text-center font-medium ${tdClasses}`}>
                <div className="flex items-center justify-center">
                    <Components.Link
                        href={`${Config.urls.viewPublication.path}/${props.linkedPublication.id}`}
                        openNew={true}
                        ariaLabel={'Visit publication'}
                        className="p-2"
                    >
                        <OutlineIcons.ArrowTopRightOnSquareIcon className={iconClasses} />
                    </Components.Link>
                </div>
            </td>
            <td className={`w-1/6 text-center font-medium ${tdClasses}`}>
                <div className="flex items-center justify-center">
                    {props.linkedPublication.draft ? (
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
                            onClick={handleDelete}
                            disabled={loading}
                        />
                    ) : props.linkedPublication.pendingDeletion ? (
                        <Components.IconButton
                            className="p-2"
                            title="Cancel pending deletion"
                            icon={
                                loading ? (
                                    <OutlineIcons.ArrowPathIcon
                                        className={iconClasses + ' animate-spin'}
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <OutlineIcons.ArrowUturnLeftIcon className={iconClasses} aria-hidden="true" />
                                )
                            }
                            onClick={() => handleMarkForDeletion(false)}
                            disabled={loading}
                        />
                    ) : (
                        <Components.IconButton
                            className="p-2"
                            title="Mark for deletion"
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
                            onClick={() => handleMarkForDeletion(true)}
                            disabled={loading}
                        />
                    )}
                </div>
            </td>
        </tr>
    );
};

export default LinkedPublicationRow;
