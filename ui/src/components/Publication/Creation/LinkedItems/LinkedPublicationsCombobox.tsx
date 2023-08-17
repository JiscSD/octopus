import React from 'react';
import * as HeadlessUI from '@headlessui/react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import useSWR, { useSWRConfig } from 'swr';

import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Interfaces from '@interfaces';
import * as Stores from '@stores';
import * as Types from '@types';

import * as api from '@api';

type LinkedPublicationsComboboxProps = {
    fetchAndSetLinks: (token: string, entityType: Types.LinkedEntityType) => void;
    setError: (error: string | undefined) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
};

const LinkedPublicationsCombobox: React.FC<LinkedPublicationsComboboxProps> = (props): React.ReactElement => {
    const SWRConfig = useSWRConfig();

    const currentPublicationId = Stores.usePublicationCreationStore((state) => state.id);
    const type = Stores.usePublicationCreationStore((state) => state.type);
    const linkTos = Stores.usePublicationCreationStore((state) => state.linkTo);
    const user = Stores.useAuthStore((state) => state.user);

    const [search, setSearch] = React.useState('');
    const [selectedPublication, setSelectedPublication] = React.useState<Interfaces.Publication | null>(null);

    const availableLinkTypes = Helpers.publicationsAvailabletoPublication(type);
    const formattedAsString = availableLinkTypes.join(',');

    const excludedIds = [currentPublicationId, ...linkTos.map((link) => link.publicationToRef.id)];

    const swrKey = `/publications?type=${formattedAsString}&limit=10${
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
            '/publications': []
        }
    });

    if (error) {
        props.setError(error.message);
    }

    const createLink = async () => {
        props.setError(undefined);
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
            } catch (err) {
                props.setError('There was a problem creating the link.');
            }
            props.fetchAndSetLinks(user.token, 'PUBLICATION');
            SWRConfig.mutate(swrKey);
        }
        props.setLoading(false);
    };

    return (
        <HeadlessUI.Combobox value={selectedPublication} onChange={setSelectedPublication}>
            <div className="flex flex-wrap items-center sm:flex-nowrap sm:space-x-4">
                <HeadlessUI.Combobox.Input
                    className="mr-4 mt-4 w-2/3 rounded border border-grey-100 bg-white-50 p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400 sm:mr-0"
                    autoComplete="off"
                    displayValue={(publication: Interfaces.Publication) => {
                        return publication?.title || '';
                    }}
                    placeholder="Search for publications"
                    onChange={(event) => setSearch(event.target.value)}
                />
                <Components.Button
                    title="Add link"
                    className="mt-4"
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
                <HeadlessUI.Combobox.Options className="absolute z-10 mt-2 max-h-96 w-2/3 overflow-scroll rounded bg-white-50 shadow-xl">
                    {!isValidating &&
                        results.data.map((publication: Interfaces.Publication, index: number) => (
                            <HeadlessUI.Combobox.Option
                                key={publication.id}
                                className={({ active }) =>
                                    `relative cursor-default select-none p-2 text-teal-900 ${
                                        active && 'ring-2 ring-inset ring-yellow-400'
                                    } ${index === 0 && 'rounded-t'} ${index === results.length - 1 && 'rounded-b'}`
                                }
                                value={publication}
                            >
                                <div className="space-y-2">
                                    <span className="font-montserrat text-sm font-medium text-teal-600">
                                        {Helpers.formatPublicationType(publication.type)}
                                    </span>
                                    <p className="text-grey-800">{publication.title}</p>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-grey-700">
                                            {Helpers.formatDate(publication.publishedDate)},
                                        </span>
                                        <span className="text-sm text-grey-700">
                                            {publication.user.firstName[0]}. {publication.user.lastName}
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

export default LinkedPublicationsCombobox;
