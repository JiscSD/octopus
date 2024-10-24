import React, { useState } from 'react';
import useSWR from 'swr';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Stores from '@/stores';

type Props = {
    publicationId: string;
    open: boolean;
    onClose: () => void;
};

const RelatedPublicationsViewAllModal: React.FC<Props> = (props): React.ReactElement => {
    const user = Stores.useAuthStore((state) => state.user);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const searchInputId = 'crosslink-search';
    const recentInputId = 'sort-order-recent';
    const relevantInputId = 'sort-order-relevant';
    const sortOrderInputName = 'sort-order';
    const ownFilterInputId = 'view-own';
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'recent' | 'relevant'>('recent');
    const [ownLinks, setOwnLinks] = useState(false);
    const [offset, setOffset] = useState(0);
    const [genericError, setGenericError] = useState('');
    const limit = 5;
    const swrKey = `${Config.endpoints.publications}/${props.publicationId}/crosslinks?order=${sortOrder}&search=${searchTerm}&own=${ownLinks}&offset=${offset}&limit=${limit}`;
    const {
        data: getCrosslinksResponse,
        error: getCrosslinksError,
        isValidating,
        mutate
    } = useSWR<Interfaces.GetPublicationCrosslinksResponse>(swrKey);

    const resultCount = getCrosslinksResponse?.data?.length;

    const handleSearchTermChange = Helpers.debounce(
        () => {
            setSearchTerm(searchInputRef.current?.value || '');
        },
        500,
        { maxWait: 1500 }
    );

    const upperPageBound = getCrosslinksResponse
        ? limit + offset > getCrosslinksResponse.metadata.total
            ? getCrosslinksResponse.metadata.total
            : limit + offset
        : null;

    return (
        <Components.Modal
            open={props.open}
            onClose={props.onClose}
            cancelButtonText="Close"
            title="Related Publications"
            titleClasses="text-left"
            wide={true}
        >
            <label htmlFor={searchInputId} className="relative block w-full">
                <span className="block mb-2 text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300 text-left">
                    Search for suggested links
                </span>
                <input
                    ref={searchInputRef}
                    id={searchInputId}
                    name="filter"
                    className="w-full rounded border border-grey-100 text-grey-700 shadow focus:ring-2 focus:ring-yellow-400"
                    onChange={() => handleSearchTermChange()}
                    type="search"
                />
            </label>
            <div className="flex flex-col mt-4 gap-4 mb-4 sm:flex-row sm:items-end">
                <fieldset className="sm:w-1/2">
                    <legend className="block mb-2 text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300 text-left">
                        Sort by
                    </legend>
                    <div className="flex">
                        <label htmlFor={recentInputId} className="flex mr-6 items-center">
                            <input
                                type="radio"
                                id={recentInputId}
                                name={sortOrderInputName}
                                onChange={() => setSortOrder('recent')}
                                defaultChecked={sortOrder === 'recent'}
                            />
                            <span className="text-gray-700 ml-3 block text-sm font-medium sm:text-nowrap">
                                Most Recent
                            </span>
                        </label>
                        <label htmlFor={relevantInputId} className="flex items-center">
                            <input
                                type="radio"
                                id={relevantInputId}
                                name={sortOrderInputName}
                                onChange={() => setSortOrder('relevant')}
                                defaultChecked={sortOrder === 'relevant'}
                            />
                            <span className="text-gray-700 ml-3 block text-sm font-medium sm:text-nowrap">
                                Most Relevant
                            </span>
                        </label>
                    </div>
                </fieldset>
                {user && (
                    <label htmlFor={ownFilterInputId} className="flex items-center sm:w-1/2 sm:justify-end sm:pt-5">
                        <input
                            type="checkbox"
                            id={ownFilterInputId}
                            className="rounded-sm"
                            checked={ownLinks}
                            onChange={(event) => setOwnLinks(event.target.checked)}
                        />
                        <span className="text-gray-700 ml-3 block text-sm font-medium sm:text-nowrap">
                            View my suggestions
                        </span>
                    </label>
                )}
            </div>
            <h4 className="sr-only">Results</h4>
            {getCrosslinksError && (
                <Components.Alert
                    key="getCrosslinksError"
                    severity="ERROR"
                    title={getCrosslinksError.response.data.message || getCrosslinksError.message}
                    className="mb-4"
                />
            )}
            {genericError && (
                <Components.Alert key="genericError" severity="ERROR" title={genericError} className="mb-4" />
            )}
            <div aria-live="polite" className="sr-only">
                {!resultCount && !isValidating && 'No results found'}
            </div>
            <div className="min-h-160">
                {!resultCount && !isValidating && (
                    <Components.Alert
                        severity="INFO"
                        title="No results found"
                        details={[
                            'Try some different search criteria.',
                            'If you think something is wrong, please contact the helpdesk.'
                        ]}
                        className="mb-4"
                    />
                )}
                {!resultCount && isValidating && (
                    <OutlineIcons.ArrowPathIcon
                        className="h-5 w-5 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400 m-auto"
                        aria-hidden="true"
                    />
                )}
                {!!resultCount && (
                    <>
                        <div className="rounded flex flex-col gap-4">
                            {getCrosslinksResponse.data.map((crosslink, index: number) => {
                                let classes = '';

                                if (index === 0) {
                                    classes += 'rounded-t';
                                }

                                if (index === getCrosslinksResponse.data.length - 1) {
                                    classes += '!border-b-transparent !rounded-b';
                                }

                                return (
                                    <Components.RelatedPublicationsResult
                                        key={crosslink.id}
                                        crosslink={crosslink}
                                        setError={setGenericError}
                                        mutateList={mutate}
                                    />
                                );
                            })}
                        </div>

                        {!!getCrosslinksResponse?.data.length && (
                            <div className="mt-8 w-full items-center justify-between lg:flex lg:flex-row-reverse">
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => {
                                            setOffset((prev) => prev - limit);
                                        }}
                                        disabled={offset === 0}
                                        className="mr-6 rounded font-semibold text-grey-800 underline decoration-teal-500 decoration-2 underline-offset-4 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-500 disabled:decoration-teal-600 disabled:opacity-70 dark:text-white-50"
                                    >
                                        Previous
                                    </button>

                                    <button
                                        onClick={() => {
                                            setOffset((prev) => prev + limit);
                                        }}
                                        className="rounded font-semibold text-grey-800 underline decoration-teal-500 decoration-2 underline-offset-4 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-500 disabled:decoration-teal-600 disabled:opacity-70 dark:text-white-50"
                                        disabled={limit + offset >= getCrosslinksResponse.metadata.total}
                                    >
                                        Next
                                    </button>
                                </div>
                                <span className="mt-4 block font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                                    Showing {offset + 1} - {upperPageBound} of {getCrosslinksResponse.metadata.total}
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Components.Modal>
    );
};

export default RelatedPublicationsViewAllModal;
