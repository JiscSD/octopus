import React, { useState } from 'react';
import useSWR from 'swr';
import * as axios from 'axios';
import * as HeadlessUI from '@headlessui/react';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Stores from '@/stores';
import * as Types from '@/types';

type Props = {
    publicationId: string;
    type: Types.PublicationType;
    open: boolean;
    onClose: () => void;
};

const RelatedPublicationsSuggestModal: React.FC<Props> = (props): React.ReactElement => {
    const setToast = Stores.useToastStore((state) => state.setToast);
    const user = Stores.useAuthStore((state) => state.user);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const searchInputId = 'publication-search';
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPublicationVersion, setSelectedPublicationVersion] =
        React.useState<Interfaces.PublicationVersion | null>(null);
    const [loading, setLoading] = useState(false);
    const [createCrosslinkError, setCreateCrosslinkError] = useState('');
    const swrKey = `${Config.endpoints.publicationVersions}?type=${props.type}&limit=10&exclude=${props.publicationId}${searchTerm.length > 2 ? `&search=${searchTerm}` : ''}`;
    const {
        data: results = {
            data: [],
            metadata: { limit: 10, offset: 0, total: 0 }
        },
        isValidating
    } = useSWR<Interfaces.SearchResults<Interfaces.PublicationVersion>>(swrKey, null, {
        fallback: {
            '/publication-versions': []
        }
    });

    const getAuthorNames = (publicationVersion: Interfaces.PublicationVersion) => {
        return !publicationVersion.coAuthors.length
            ? Helpers.abbreviateUserName(publicationVersion.user)
            : publicationVersion.coAuthors.map((author) => Helpers.abbreviateUserName(author.user)).join(', ');
    };

    const selectedPublicationVersionAuthorNames = selectedPublicationVersion
        ? getAuthorNames(selectedPublicationVersion)
        : '';

    const handleSearchTermChange = Helpers.debounce(
        () => {
            setSearchTerm(searchInputRef.current?.value || '');
        },
        500,
        { maxWait: 1500 }
    );

    const handleSelectedPublicationVersionChange = (value: Interfaces.PublicationVersion) => {
        setCreateCrosslinkError('');
        setSelectedPublicationVersion(value);
    };

    const handleClearSelection = () => {
        setCreateCrosslinkError('');
        setSelectedPublicationVersion(null);
    };

    const createCrosslink = async () => {
        setLoading(true);
        if (selectedPublicationVersion && user) {
            try {
                await api.post(
                    '/crosslinks',
                    {
                        publications: [props.publicationId, selectedPublicationVersion.versionOf]
                    },
                    user.token
                );
                onClose();
                setToast({
                    visible: true,
                    dismiss: true,
                    title: 'Suggestion created',
                    icon: <OutlineIcons.CheckCircleIcon className="h-6 w-6 text-teal-400" aria-hidden="true" />,
                    message: ''
                });
            } catch (err) {
                setCreateCrosslinkError(
                    axios.isAxiosError(err)
                        ? err.response?.data?.message
                        : 'There was a problem creating the suggestion.'
                );
            }
        }
        setLoading(false);
    };

    const onClose = () => {
        setSearchTerm('');
        setSelectedPublicationVersion(null);
        setCreateCrosslinkError('');
        props.onClose();
    };

    return (
        <Components.Modal
            open={props.open}
            onClose={onClose}
            positiveActionCallback={createCrosslink}
            positiveButtonText="Suggest Link"
            positiveButtonDisabled={!!createCrosslinkError || !selectedPublicationVersion}
            cancelButtonText="Cancel"
            title="Suggest a Link"
            titleClasses="text-left"
            wide={true}
            loading={loading}
        >
            <div className="min-h-192">
                <p className="text-left mb-8">
                    Suggest a related {Helpers.formatPublicationType(props.type)} to link it to the one you are viewing
                    currently.
                </p>
                <HeadlessUI.Combobox
                    value={selectedPublicationVersion}
                    onChange={handleSelectedPublicationVersionChange}
                >
                    <label htmlFor={searchInputId} className="relative block w-full">
                        <span className="block mb-2 text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300 text-left">
                            Browse publications
                        </span>
                        <HeadlessUI.Combobox.Input
                            ref={searchInputRef}
                            id={searchInputId}
                            className="w-full rounded border border-grey-100 bg-white-50 p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400 sm:mr-0"
                            autoComplete="off"
                            displayValue={(publicationVersion: Interfaces.PublicationVersion) => {
                                return publicationVersion?.title || '';
                            }}
                            onChange={() => handleSearchTermChange()}
                            placeholder="Search for publications"
                        />
                    </label>
                    <HeadlessUI.Transition
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setSearchTerm('')}
                    >
                        <HeadlessUI.Combobox.Options className="absolute z-10 mt-2 max-h-128 overflow-scroll rounded bg-white-50 shadow-xl">
                            {!isValidating &&
                                results.data.map((publicationVersion: Interfaces.PublicationVersion, index: number) => {
                                    const authorNames = getAuthorNames(publicationVersion);
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
                                            <div className="min-h-[4rem] items-start overflow-hidden p-4 space-y-2">
                                                <div>
                                                    <p className="text-left font-semibold mb-2 leading-6 text-grey-800 transition-colors duration-500 dark:text-white-50">
                                                        {publicationVersion.title}
                                                    </p>
                                                </div>
                                                <span
                                                    className="text-left block overflow-hidden text-ellipsis whitespace-nowrap text-xs tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100"
                                                    title={authorNames}
                                                >
                                                    By {authorNames} |{' '}
                                                    {Helpers.relativeDate(publicationVersion.publishedDate || '')}
                                                </span>
                                            </div>
                                        </HeadlessUI.Combobox.Option>
                                    );
                                })}
                        </HeadlessUI.Combobox.Options>
                    </HeadlessUI.Transition>
                </HeadlessUI.Combobox>
                {selectedPublicationVersion && (
                    <div className="flex flex-col">
                        <span className="block mb-2 mt-8 text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300 text-left">
                            Suggest a link to
                        </span>
                        <div className="min-h-[4rem] items-start overflow-hidden p-4 mb-4 space-y-2 rounded border border-grey-100 shadow">
                            <div>
                                <p className="text-left font-semibold mb-2 leading-6 text-grey-800 transition-colors duration-500 dark:text-white-50">
                                    {selectedPublicationVersion.title}
                                </p>
                            </div>
                            <span
                                className="text-left block overflow-hidden text-ellipsis whitespace-nowrap text-xs tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100"
                                title={selectedPublicationVersionAuthorNames}
                            >
                                By {selectedPublicationVersionAuthorNames} |{' '}
                                {Helpers.relativeDate(selectedPublicationVersion.publishedDate || '')}
                            </span>
                        </div>
                        <Components.Button
                            title="Clear selection"
                            className="ml-auto"
                            childClassName="flex items-center text-teal-700"
                            onClick={handleClearSelection}
                        >
                            Clear Selection
                            <OutlineIcons.TrashIcon className="h-6 w-6 text-teal-700 ml-2" aria-hidden="true" />
                        </Components.Button>
                        <div aria-live="polite">
                            {createCrosslinkError && (
                                <Components.Alert severity="ERROR" title={createCrosslinkError} className="mt-4" />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Components.Modal>
    );
};

export default RelatedPublicationsSuggestModal;
