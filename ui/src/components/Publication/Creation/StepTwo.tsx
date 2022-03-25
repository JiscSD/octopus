import React, { useEffect } from 'react';
import useSWR from 'swr';
import * as OutlineIcons from '@heroicons/react/outline';
import * as HeadlessUI from '@headlessui/react';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';
import * as api from '@api';

/**
 * @description Edit links
 */
const StepTwo: React.FC = (): React.ReactElement => {
    const type = Stores.usePublicationCreationStore((state: Types.PublicationCreationStoreType) => state.type);

    const [search, setSearch] = React.useState('');
    const [limit, setLimit] = React.useState(10);
    const [selectedLink, setSelectedLink] = React.useState<Interfaces.Publication | null>(null);

    const [fetchForError, setFetchForError] = React.useState<string | null>(null);
    const [confirmSaveLinks, setConfirmSaveLinks] = React.useState(false);
    const availableLinkTypes = Helpers.publicationsAvailabletoPublication(type);
    const formattedAsString = availableLinkTypes.join(',');

    const swrKey = `/publications?type=${formattedAsString}&limit=${limit}&orderBy=publishedDate&orderDirection=asc${
        search.length > 2 ? `&search=${search}` : ''
    }`;

    const {
        data: { data: results = { data: [], metadata: { limit, offset: 0, total: 0 } } } = {},
        error,
        isValidating
    } = useSWR(swrKey, null, {
        fallback: {
            '/publications': []
        },
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    return (
        <div className="space-y-6 lg:w-10/12 lg:space-y-10">
            <div>
                <Components.PublicationCreationStepTitle text="What publications do you want to linked to?" />
                <p className="mb-6 block text-grey-800 transition-colors duration-500 dark:text-white-50">
                    <span>This publicaiton can link to: </span>
                    {availableLinkTypes.map((type, index) => (
                        <span key={type}>
                            <Components.Link
                                href={`${Config.urls.about.path}#${type}`}
                                openNew={true}
                                className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                            >
                                <span>{Helpers.formatPublicationType(type)}</span>
                            </Components.Link>
                            {index !== availableLinkTypes.length - 1 ? ', ' : '.'}
                        </span>
                    ))}
                </p>
            </div>

            <div className="relative">
                <Components.PublicationCreationStepTitle text="Add links" />
                <HeadlessUI.Combobox value={selectedLink} onChange={setSelectedLink}>
                    <HeadlessUI.Combobox.Input
                        className="w-2/3 rounded border-grey-100 bg-white-50 p-3 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400"
                        autoComplete="off"
                        displayValue={(publication: Interfaces.Publication) => publication?.title || ''}
                        placeholder="Search for publications"
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <HeadlessUI.Transition
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setSearch('')}
                    >
                        <HeadlessUI.Combobox.Options className="absolute mt-2 w-2/3 rounded bg-white-50 shadow">
                            {!isValidating &&
                                results.data.map((publication: Interfaces.Publication, index: number) => (
                                    <HeadlessUI.Combobox.Option
                                        key={publication.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none p-2 text-teal-900 ${
                                                active && 'ring-2 ring-inset ring-yellow-400'
                                            } ${index === 0 && 'rounded-t'} ${
                                                index === results.length - 1 && 'rounded-b'
                                            }`
                                        }
                                        value={publication.id}
                                    >
                                        {publication.title}
                                    </HeadlessUI.Combobox.Option>
                                ))}
                        </HeadlessUI.Combobox.Options>
                    </HeadlessUI.Transition>
                </HeadlessUI.Combobox>
            </div>

            {error && !isValidating && <Components.Alert severity="ERROR" title={error} className="mb-6 w-fit" />}
            {fetchForError && (
                <Components.Alert severity="ERROR" title={fetchForError} allowDismiss={true} className="mb-6 w-fit" />
            )}
            <div>
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent md:rounded-lg">
                                <table className="min-w-full divide-y divide-grey-100 dark:divide-teal-300">
                                    <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                                        <tr>
                                            <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                                Publication
                                            </th>
                                            <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 " />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600">
                                        <tr>
                                            <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                                                <div>
                                                    <p className="mb-2">
                                                        Data attached to Messy or Ordered? Multiscale Mechanics Dictates
                                                        Shape-Morphing of 2D Networks Hierarchically Assembled of
                                                        Responsive Microfibers
                                                    </p>
                                                    <p className="text-xs text-grey-700">Nathan Sainsbury</p>
                                                </div>
                                            </td>
                                            <td className="space-nowrap py-4 px-8 text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                                                <OutlineIcons.TrashIcon className="h-5 w-5" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                                                <div>
                                                    <p className="mb-2">
                                                        Protocol for Messy or Ordered? Multiscale Mechanics Dictates
                                                        Shape-Morphing of 2D Networks Hierarchically Assembled of
                                                        Responsive Microfibers
                                                    </p>
                                                    <p className="text-xs text-grey-700">Ashley Redman</p>
                                                </div>
                                            </td>
                                            <td className="space-nowrap py-4 px-8 text-sm font-medium text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                                                <OutlineIcons.TrashIcon className="h-5 w-5" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="my-4 border-t border-grey-100 py-4 transition-colors duration-500 dark:border-grey-700 lg:my-10 lg:pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="mb-4 block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white-50">
                        Add new links to this publication?
                    </h2>
                    <button
                        className="rounded bg-teal-500 px-3 py-1 text-sm font-medium text-white-50 outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:hover:cursor-not-allowed"
                        onClick={() => setConfirmSaveLinks(true)}
                    >
                        Save &amp; create links
                    </button>
                </div>
                <div className="my-6 grid grid-cols-2 gap-4 ">
                    <div>
                        <h3>Choose from the below</h3>
                        <div className="scrollbar scrollbar-vert h-96 overflow-x-auto rounded border border-teal-500 p-4">
                            {!error &&
                                !isValidating &&
                                results.data?.length &&
                                results.data.map((availablePublication: Interfaces.Publication) => {
                                    if (availablePublication.id !== forPublicationsID) {
                                        return (
                                            <button
                                                className="mb-2 whitespace-nowrap bg-white-50 text-left text-sm"
                                                onClick={() => manageAvailableToAdd(availablePublication)}
                                                key={availablePublication.id}
                                            >
                                                {availablePublication.title}
                                            </button>
                                        );
                                    }
                                })}
                        </div>
                    </div>
                    <div>
                        <h3>Selected for linking</h3>
                        <div className="scrollbar scrollbar-vert h-96 overflow-x-auto rounded border border-teal-500 p-4">
                            {publicationLinkToList.map((addedPublication) => (
                                <div key={addedPublication.id} className="grid grid-cols-12">
                                    <span className="col-span-11">{addedPublication.title}</span>
                                    <button
                                        className="col-span-1"
                                        onClick={() => removeFromLinkToList(addedPublication)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default StepTwo;
