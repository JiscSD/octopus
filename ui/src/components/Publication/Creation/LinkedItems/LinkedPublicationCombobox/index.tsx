import React from 'react';
import useSWR from 'swr';
import * as HeadlessUI from '@headlessui/react';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Stores from '@/stores';
import * as Types from '@/types';

type LinkedPublicationsComboboxProps = {
    setError: (error: string | null) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
    draftsOnly: boolean;
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
    const [selectedPublication, setSelectedPublication] =
        React.useState<Types.LinkedPublicationComboboxOptionValue | null>(null);

    const availableLinkTypes = (type && Helpers.publicationsAvailabletoPublication(type)) || [];
    const formattedAsString = availableLinkTypes.join(',');

    const excludedIds = [currentPublicationId, ...linkedTo.map((link) => link.id)];

    const minimumQueryEntered = search.length > 2;
    const swrKey = props.draftsOnly
        ? `${Config.endpoints.users}/${user?.id}/publications?initialDraftsOnly=true&limit=10${minimumQueryEntered ? `&query=${search}` : ''}&exclude=${excludedIds.join(',')}&type=${formattedAsString}`
        : `/publication-versions?type=${formattedAsString}&limit=10${
              minimumQueryEntered ? `&search=${search}` : ''
          }&exclude=${excludedIds.join(',')}`;

    const {
        data: results = {
            data: [],
            metadata: { limit: 10, offset: 0, total: 0 }
        },
        error,
        isValidating
    } = useSWR<
        Interfaces.SearchResults<Interfaces.PublicationVersion> | Interfaces.SearchResults<Interfaces.Publication>
    >(swrKey, null, {
        fallback: {
            '/publications': [],
            '/publication-versions': []
        }
    });

    const drafts: Interfaces.Publication[] = props.draftsOnly ? (results.data as Interfaces.Publication[]) : [];
    const livePublications: Interfaces.PublicationVersion[] = !props.draftsOnly
        ? (results.data as Interfaces.PublicationVersion[])
        : [];

    let options: React.ReactNode = null;

    if (props.draftsOnly && drafts.length) {
        options = drafts.map((publication, index) => {
            // Every publication returned from the request is expected to have 1 version (draft).
            const version = publication.versions[0];
            return (
                <Components.LinkedPublicationsComboboxOption
                    content={version.content}
                    id={publication.id}
                    key={publication.id}
                    publishedDate={null}
                    title={version.title}
                    type={publication.type}
                    user={version.user}
                    first={index === 0}
                    last={index === drafts.length - 1}
                    // Draft publications cannot be red flagged or peer reviewed.
                    flagCount={0}
                    peerReviewCount={0}
                />
            );
        });
    } else if (!props.draftsOnly && livePublications.length) {
        options = livePublications.map((publicationVersion, index) => (
            <Components.LinkedPublicationsComboboxOption
                content={publicationVersion.content}
                id={publicationVersion.versionOf}
                key={publicationVersion.versionOf}
                publishedDate={publicationVersion.publishedDate}
                title={publicationVersion.title}
                type={publicationVersion.publication.type}
                user={publicationVersion.user}
                first={index === 0}
                last={index === livePublications.length - 1}
                flagCount={publicationVersion.publication.flagCount || 0}
                peerReviewCount={publicationVersion.publication.peerReviewCount || 0}
            />
        ));
    }

    if (error) {
        props.setError(error.message);
    }

    const createLink = async () => {
        props.setError(null);
        props.setLoading(true);
        if (selectedPublication && user) {
            try {
                setSearch('');
                setSelectedPublication(null);
                await api.post(
                    '/links',
                    {
                        to: selectedPublication.id,
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
        <HeadlessUI.Combobox value={selectedPublication} onChange={setSelectedPublication}>
            <div className="flex items-center gap-4">
                <HeadlessUI.Combobox.Input
                    className="w-full rounded border border-grey-100 bg-white-50 p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400 sm:mr-0"
                    autoComplete="off"
                    displayValue={(publication: Types.LinkedPublicationComboboxOptionValue | null) =>
                        publication?.title || ''
                    }
                    placeholder="Search for publications"
                    onChange={(event) => setSearch(event.target.value)}
                />
                <Components.Button
                    title="Add link"
                    className="flex-shrink-0"
                    disabled={isValidating || props.loading || !selectedPublication}
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
                    {options}
                </HeadlessUI.Combobox.Options>
            </HeadlessUI.Transition>
        </HeadlessUI.Combobox>
    );
};

export default React.memo(LinkedPublicationsCombobox);
