import React from 'react';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as OutlineIcons from '@heroicons/react/24/outline';

type Props = {
    linkedPublication: Interfaces.LinkedToPublication;
    deleteLink: (id: string) => Promise<void>;
};

const LinkedPublicationRow: React.FC<Props> = (props): React.ReactElement => {
    const [loading, setLoading] = React.useState(false);
    const handleDelete = async () => {
        setLoading(true);
        await props.deleteLink(props.linkedPublication.linkId);
        setLoading(false);
    };
    const iconClasses = 'h-6 w-6 text-teal-600 transition-colors duration-500 dark:text-teal-400';
    const tdClasses =
        'whitespace-nowrap py-4 px-3 sm:px-6 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50';

    return (
        <tr key={props.linkedPublication.id}>
            <td className={`w-3/5 ${tdClasses}`}>
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
            <td className={`w-1/5 text-center font-medium ${tdClasses}`}>
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
            <td className={`w-1/5 text-center font-medium ${tdClasses}`}>
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
                    ) : (
                        <Components.IconButton
                            className="p-2"
                            disabled
                            title="Deletion forbidden as link is inherited from previous version"
                            icon={<OutlineIcons.NoSymbolIcon className={iconClasses} aria-hidden="true" />}
                        />
                    )}
                </div>
            </td>
        </tr>
    );
};

export default LinkedPublicationRow;
