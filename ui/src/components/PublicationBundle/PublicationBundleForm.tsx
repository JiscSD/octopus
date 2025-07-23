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
    bundle?: Interfaces.ClientPublicationBundle | null;
    isSaving?: boolean;
    editable?: boolean;
    onSave: (bundle: Omit<Interfaces.ClientPublicationBundle, 'id'>) => void;
};

const PublicationBundleForm = (props: Props): JSX.Element => {
    const { bundle, isSaving: isLoading, onSave, editable } = props;
    const { setError } = Stores.usePublicationCreationStore((state) => ({ setError: state.setError }));

    const [bundleName, setBundleName] = React.useState<string>(bundle?.name || '');
    const [deletionUpdate, setDeletionUpdate] = React.useState('');
    const [deleting, setDeleting] = React.useState(false);
    const [publications, setPublications] = React.useState<Interfaces.ClientPublicationBundle['publications']>(
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

    const numberOfPublicationsLowerLimit = publications.length < 2;
    const numberOfPublicationsUpperLimit = publications.length >= 30;
    const invalidNumberOfPublications = numberOfPublicationsLowerLimit || numberOfPublicationsUpperLimit;

    return (
        <div className="w-full xl:w-2/3 2xl:w-1/2 flex flex-col gap-8 relative">
            {editable ? (
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
                        disabled={numberOfPublicationsUpperLimit}
                    />
                </form>
            ) : null}
            <div className="sr-only" aria-live="polite">
                {deletionUpdate}
            </div>
            <div>
                {!!publications.length && (
                    <Framer.motion.div
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        className={`flex flex-col overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent ${invalidNumberOfPublications ? 'rounded-t-lg' : 'rounded-lg'}`}
                    >
                        <table
                            className="min-w-full table-fixed divide-y divide-grey-100 dark:divide-teal-300"
                            aria-label="Bundled publications table"
                        >
                            <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                                <tr>
                                    <th className={`text-left ${thClasses}`}>Publication</th>
                                    <th className={thClasses}>View</th>
                                    {editable ? <th className={thClasses}>Delete</th> : null}
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
                                        ) : null}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Framer.motion.div>
                )}
                {editable && invalidNumberOfPublications ? (
                    <div className="first:rounded-lg rounded-b-lg bg-grey-50 px-6 py-4 text-left text-sm text-grey-900 dark:bg-grey-700 dark:text-white-50 sm:text-center">
                        <h4 className="text-lg dark:text-white-50">
                            <span className="font-semibold">
                                {publications.length < 1
                                    ? 'Please add at least 2 more publication to this bundle before saving'
                                    : publications.length < 2
                                      ? 'Please add at least 1 more publication to this bundle before saving'
                                      : 'You have reached the limit of 30 publications'}
                            </span>
                        </h4>
                    </div>
                ) : null}
            </div>
            {editable ? (
                <div className="flex items-center gap-4">
                    <Components.Button href={Config.urls.viewBundles.path} title="Cancel" />
                    <Components.Button
                        disabled={!bundleName || publications.length < 2 || isLoading}
                        onClick={() => onSave({ name: bundleName, publications })}
                        title="Save"
                        variant="block"
                    />
                </div>
            ) : null}
        </div>
    );
};

export default PublicationBundleForm;
