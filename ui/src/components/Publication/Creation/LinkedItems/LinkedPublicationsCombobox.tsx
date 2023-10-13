import React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import * as HeadlessUI from '@headlessui/react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Interfaces from '@interfaces';
import * as Stores from '@stores';
import * as api from '@api';
import * as Config from '@config';

type LinkedPublicationsComboboxProps = {
    setError: (error: string | undefined) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
};

const LinkedPublicationsCombobox: React.FC<LinkedPublicationsComboboxProps> = (props): React.ReactElement => {
    const SWRConfig = useSWRConfig();

    const currentPublicationId = Stores.usePublicationCreationStore((state) => state.publicationVersion?.versionOf);
    const type = Stores.usePublicationCreationStore((state) => state.publicationVersion?.publication.type);
    const linkedTos = Stores.usePublicationCreationStore((state) => state.linkedTo);
    const user = Stores.useAuthStore((state) => state.user);

    const [search, setSearch] = React.useState('');
    const [selectedPublicationVersion, setSelectedPublicationVersion] =
        React.useState<Interfaces.PublicationVersion | null>(null);

    const availableLinkTypes = (type && Helpers.publicationsAvailabletoPublication(type)) || [];
    const formattedAsString = availableLinkTypes.join(',');

    const excludedIds = [currentPublicationId, ...linkedTos.map((link) => link.id)];

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
        props.setError(undefined);
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
                await SWRConfig.mutate([
                    `${Config.endpoints.publications}/${currentPublicationId}/links?direct=true`,
                    'edit'
                ]);
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
                        results.data.map((publicationVersion: Interfaces.PublicationVersion, index: number) => (
                            <HeadlessUI.Combobox.Option
                                key={publicationVersion.id}
                                className={({ active }) =>
                                    `relative cursor-default select-none p-2 text-teal-900 ${
                                        active && 'ring-2 ring-inset ring-yellow-400'
                                    } ${index === 0 && 'rounded-t'} ${index === results.length - 1 && 'rounded-b'}`
                                }
                                value={publicationVersion}
                            >
                                <div className="space-y-2">
                                    <span className="font-montserrat text-sm font-medium text-teal-600">
                                        {Helpers.formatPublicationType(publicationVersion.publication.type)}
                                    </span>
                                    <p className="text-grey-800">{publicationVersion.title}</p>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-grey-700">
                                            {publicationVersion.publishedDate &&
                                                Helpers.formatDate(publicationVersion.publishedDate)}
                                            ,
                                        </span>
                                        <span className="text-sm text-grey-700">
                                            {publicationVersion.user.firstName[0]}. {publicationVersion.user.lastName}
                                        </span>
                                    </div>
                                </div>
                            </HeadlessUI.Combobox.Option>
                        ))}
                </HeadlessUI.Combobox.Options>
            </HeadlessUI.Transition>
        </HeadlessUI.Combobox>
    );
};

export default React.memo(LinkedPublicationsCombobox);
