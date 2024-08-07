import React from 'react';
import useSWR from 'swr';
import * as HeadlessUI from '@headlessui/react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Components from '@/components';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Stores from '@/stores';
import * as api from '@/api';
import * as Config from '@/config';

type LinkedPublicationsComboboxProps = {
    setError: (error: string | null) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
};

const LinkedPublicationsCombobox: React.FC<LinkedPublicationsComboboxProps> = (props): React.ReactElement => {
    const user = Stores.useAuthStore((state) => state.user);
    const { currentPublicationId, type, linkedTo, updateLinkedTo } = Stores.usePublicationCreationStore((state) => ({
        currentPublicationId: state.publicationVersion.versionOf,
        type: state.publicationVersion.publication.type,
        linkedTo: state.linkedTo,
        updateLinkedTo: state.updateLinkedTo
    }));

    const [search, setSearch] = React.useState('');
    const [selectedPublicationVersion, setSelectedPublicationVersion] =
        React.useState<Interfaces.PublicationVersion | null>(null);

    const availableLinkTypes = (type && Helpers.publicationsAvailabletoPublication(type)) || [];
    const formattedAsString = availableLinkTypes.join(',');

    const excludedIds = [currentPublicationId, ...linkedTo.map((link) => link.id)];

    const swrKey = `/publication-versions?type=${formattedAsString}&limit=10${
        search.length > 2 ? `&search=${search}` : ''
    }&exclude=${excludedIds.join(',')}`;

    const {
        data: results = {
            data: [],
            metadata: { limit: 10, offset: 0, total: 0 }
        },
        error,
        isValidating
    } = useSWR(swrKey, null, {
        fallback: {
            '/publication-versions': []
        }
    });

    if (error) {
        props.setError(error.message);
    }

    const createLink = async () => {
        props.setError(null);
        props.setLoading(true);
        if (selectedPublicationVersion && user) {
            try {
                setSearch('');
                setSelectedPublicationVersion(null);
                await api.post(
                    '/links',
                    {
                        to: selectedPublicationVersion.versionOf,
                        from: currentPublicationId
                    },
                    user.token
                );

                // refetch direct links
                const response = await api.get(
                    `${Config.endpoints.publications}/${currentPublicationId}/links?direct=true`,
                    user.token
                );

                updateLinkedTo(response.data.linkedTo);
            } catch (err) {
                props.setError('There was a problem creating the link.');
            }
        }
        props.setLoading(false);
    };

    return (
        <HeadlessUI.Combobox value={selectedPublicationVersion} onChange={setSelectedPublicationVersion}>
            <div className="flex items-center gap-4">
                <HeadlessUI.Combobox.Input
                    className="w-full rounded border border-grey-100 bg-white-50 p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400 sm:mr-0"
                    autoComplete="off"
                    displayValue={(publicationVersion: Interfaces.PublicationVersion) => {
                        return publicationVersion?.title || '';
                    }}
                    placeholder="Search for publications"
                    onChange={(event) => setSearch(event.target.value)}
                />
                <Components.Button
                    title="Add link"
                    className="flex-shrink-0"
                    disabled={isValidating || props.loading || !selectedPublicationVersion}
                    onClick={createLink}
                    endIcon={
                        props.loading ? (
                            <OutlineIcons.ArrowPathIcon className="h-6 w-6 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                        ) : (
                            <OutlineIcons.PlusCircleIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                        )
                    }
                />
            </div>
            <HeadlessUI.Transition
                as={React.Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setSearch('')}
            >
                <HeadlessUI.Combobox.Options className="absolute z-10 mt-2 max-h-96 overflow-scroll rounded bg-white-50 shadow-xl">
                    {!isValidating &&
                        results.data.map((publicationVersion: Interfaces.PublicationVersion, index: number) => {
                            const { flagCount, peerReviewCount } = publicationVersion.publication;
                            const hasFlagAndPeerReview = flagCount && peerReviewCount;
                            const hasOneOfFlagOrPeerReview = flagCount || peerReviewCount;
                            return (
                                <HeadlessUI.Combobox.Option
                                    key={publicationVersion.id}
                                    className={({ active }) =>
                                        `relative cursor-default select-none p-2 text-teal-900 ${
                                            active && 'ring-2 ring-inset ring-yellow-400'
                                        } ${index === 0 && 'rounded-t'} ${index === results.data.length - 1 && 'rounded-b'}`
                                    }
                                    value={publicationVersion}
                                    title={
                                        publicationVersion.content
                                            ? Helpers.truncateString(
                                                  Helpers.htmlToText(publicationVersion.content),
                                                  220
                                              )
                                            : ''
                                    }
                                >
                                    <div className="space-y-2">
                                        <span className="font-montserrat text-sm font-medium text-teal-600">
                                            {Helpers.formatPublicationType(publicationVersion.publication.type)}
                                        </span>
                                        <p className="text-grey-800">{publicationVersion.title}</p>
                                        <div className="flex flex-col space-y-2 sm:flex-row">
                                            <div
                                                className={`flex items-end space-x-2 ${
                                                    hasFlagAndPeerReview
                                                        ? 'sm:w-1/2'
                                                        : hasOneOfFlagOrPeerReview
                                                          ? 'sm:w-3/4'
                                                          : ''
                                                }`}
                                            >
                                                <span className="text-xs leading-none text-grey-700">
                                                    {publicationVersion.publishedDate && (
                                                        <time suppressHydrationWarning>
                                                            {Helpers.formatDate(publicationVersion.publishedDate)}
                                                        </time>
                                                    )}
                                                    ,
                                                </span>
                                                <span className="text-xs leading-none text-grey-700">
                                                    {Helpers.abbreviateUserName(publicationVersion.user)}
                                                </span>
                                            </div>
                                            <Components.EngagementCounts
                                                flagCount={flagCount}
                                                peerReviewCount={peerReviewCount}
                                                className={`justify-start text-sm sm:justify-end ${
                                                    hasFlagAndPeerReview ? 'w-1/2' : 'w-1/4'
                                                }`}
                                                childClasses="text-grey-700 dark:text-grey-700"
                                            />
                                        </div>
                                    </div>
                                </HeadlessUI.Combobox.Option>
                            );
                        })}
                </HeadlessUI.Combobox.Options>
            </HeadlessUI.Transition>
        </HeadlessUI.Combobox>
    );
};

export default React.memo(LinkedPublicationsCombobox);
