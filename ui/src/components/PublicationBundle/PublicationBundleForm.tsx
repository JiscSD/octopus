import React from 'react';
import * as Framer from 'framer-motion';
import type { AxiosResponse } from 'axios';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Contexts from '@/contexts';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Stores from '@/stores';

type Props = {
    bundle?: Interfaces.PublicationBundle | null;
    isSaving?: boolean;
    onSave: (bundle: Pick<Interfaces.PublicationBundle, 'name' | 'publications'>) => void;
};

const PublicationBundleForm = (props: Props): JSX.Element => {
    const { bundle, isSaving: isLoading, onSave } = props;
    const { setError } = Stores.usePublicationCreationStore((state) => ({ setError: state.setError }));

    const [bundleName, setBundleName] = React.useState<string>(bundle?.name || '');
    const [deletionUpdate, setDeletionUpdate] = React.useState('');
    const [deleting, setDeleting] = React.useState(false);
    const [publications, setPublications] = React.useState<Interfaces.PublicationBundle['publications']>(
        bundle?.publications || []
    );

    const confirmation = Contexts.useConfirmationModal();

    const addPublication = async (publicationId: string) => {
        const getPublication: AxiosResponse<Interfaces.Publication> = await api.get(
            `${Config.endpoints.publications}/${publicationId}`
        );
        const publication = getPublication.data;
        const latestLiveVersion = publication.versions.find((version) => version.isLatestLiveVersion);
        if (latestLiveVersion) {
            setPublications((prev) => [
                ...prev,
                {
                    authorFirstName: latestLiveVersion.user.firstName,
                    authorLastName: latestLiveVersion.user.lastName,
                    id: publication.id,
                    publishedDate: latestLiveVersion.publishedDate || '',
                    title: latestLiveVersion.title,
                    type: publication.type
                }
            ]);
        }
    };

    const deletePublication = async (publicationId: string) => {
        const publication = publications.find((publication) => publication.id === publicationId);
        const confirmed = await confirmation(
            'Remove publication from bundle',
            <p>
                Are you sure you want to remove the publication{' '}
                <span className="font-semibold">{publication?.title}</span> from the bundle?
            </p>,
            <OutlineIcons.TrashIcon className="h-8 w-8 text-grey-600" aria-hidden="true" />,
            'Confirm'
        );
        if (confirmed) {
            setDeleting(true);
            setPublications((prev) => prev.filter((publication) => publication.id !== publicationId));
            setDeleting(false);
            setDeletionUpdate(`Publication ${publicationId} has been removed from the bundle.`);
        }
    };

    const iconClasses = 'h-6 w-6 text-teal-600 transition-colors duration-500 dark:text-teal-400';
    const thClasses =
        'whitespace-pre py-3.5 px-3 sm:px-6 text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50';
    const tdClasses = 'py-4 px-3 sm:px-6 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50';

    return (
        <div className="w-full xl:w-2/3 2xl:w-1/2 flex flex-col gap-8">
            <form className="flex flex-col gap-4">
                <label
                    className="font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100"
                    htmlFor="bundle-name"
                >
                    Name <Components.RequiredIndicator />
                </label>
                <input
                    id="bundle-name"
                    required
                    type="text"
                    value={bundleName}
                    onChange={(e) => setBundleName(e.target.value)}
                    className="block rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 focus:ring-2 focus:ring-yellow-400"
                />
                <label
                    className="mt-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100"
                    htmlFor="add-publications"
                >
                    Add publications <Components.RequiredIndicator />
                </label>
                <Components.PublicationCombobox
                    buttonText="Add to bundle"
                    buttonCallback={async (publicationId) => addPublication(publicationId)}
                    draftsOnly={false}
                    excludedIds={publications.map((publication) => publication.id)}
                    setError={setError}
                />
            </form>
            <div className="sr-only" aria-live="polite">
                {deletionUpdate}
            </div>
            {!!publications.length && (
                <Framer.motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent"
                >
                    <table
                        className="min-w-full table-fixed divide-y divide-grey-100 dark:divide-teal-300"
                        aria-label="Bundled publications table"
                    >
                        <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                            <tr>
                                <th className={`text-left ${thClasses}`}>Publication</th>
                                <th className={thClasses}>View</th>
                                <th className={thClasses}>Delete</th>
                            </tr>
                        </thead>
                        <tbody className="my-4 bg-white-50 transition-colors duration-500 dark:bg-grey-600">
                            {publications.map((publication) => (
                                <tr key={publication.id}>
                                    <td className={`w-3/5 ${tdClasses}`}>
                                        <div className="space-y-2">
                                            <span className="font-montserrat text-sm font-medium text-teal-600 transition-colors duration-500 dark:text-teal-100">
                                                {Helpers.formatPublicationType(publication.type)}
                                            </span>
                                            <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">
                                                {publication.title}
                                            </p>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs text-grey-700 transition-colors duration-500 dark:text-white-100">
                                                    <time suppressHydrationWarning>
                                                        {Helpers.formatDate(publication.publishedDate)}
                                                    </time>
                                                    ,
                                                </span>
                                                <span className="text-sm text-grey-700 transition-colors duration-500 dark:text-white-100">
                                                    {Helpers.abbreviateUserName({
                                                        firstName: publication.authorFirstName,
                                                        lastName: publication.authorLastName
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`w-1/5 text-center font-medium ${tdClasses}`}>
                                        <div className="flex items-center justify-center">
                                            <Components.Link
                                                href={`${Config.urls.viewPublication.path}/${publication.id}`}
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
                                                        <OutlineIcons.TrashIcon
                                                            className={iconClasses}
                                                            aria-hidden="true"
                                                        />
                                                    )
                                                }
                                                onClick={async () => await deletePublication(publication.id)}
                                                disabled={deleting}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Framer.motion.div>
            )}
            <Components.Button
                disabled={!bundleName || publications.length < 2 || isLoading}
                onClick={() => onSave({ name: bundleName, publications })}
                title="Save"
                variant="block"
            />
        </div>
    );
};

export default PublicationBundleForm;
