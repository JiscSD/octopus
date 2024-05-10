import React, { useState } from 'react';
import useSWR from 'swr';
import * as Framer from 'framer-motion';
import * as SolidIcons from '@heroicons/react/24/solid';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Interfaces from '@/interfaces';
import * as Stores from '@/stores';

type Props = {
    publicationId: string;
    open: boolean;
    onClose: () => void;
};

const RelatedPublicationsModal: React.FC<Props> = (props): React.ReactElement => {
    const user = Stores.useAuthStore((state) => state.user);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const searchInputId = 'crosslink-search';
    const recentInputId = 'sort-order-recent';
    const relevantInputId = 'sort-order-relevant';
    const sortOrderInputName = 'sort-order';
    const ownFilterInputId = 'view-own';
    const formId = 'crosslink-search-form';
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

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setSearchTerm(searchInputRef.current?.value || '');
    };

    const handleClose = () => {
        setGenericError('');
        props.onClose();
    };

    return (
        <Components.Modal
            open={props.open}
            onClose={handleClose}
            cancelButtonText="Close"
            title="Related Content"
            titleClasses="text-left"
        >
            <form name="crosslink-search-form" id={formId} onSubmit={handleFormSubmit}>
                <label htmlFor={searchInputId} className="relative block w-full">
                    <span className="block mb-2 text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300 text-left">
                        Search for suggested links
                    </span>
                    <input
                        ref={searchInputRef}
                        id={searchInputId}
                        name="filter"
                        className="w-full rounded border border-grey-100 text-grey-700 shadow focus:ring-2 focus:ring-yellow-400"
                    />
                    <button
                        form={formId}
                        type="submit"
                        aria-label="Search related content"
                        className="absolute right-px p-2 outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-70"
                        disabled={isValidating}
                    >
                        <SolidIcons.MagnifyingGlassIcon className="h-6 w-6 text-teal-500" />
                    </button>
                </label>
            </form>
            <div className="flex mt-4 items-end gap-4 mb-4">
                <fieldset className="w-1/2">
                    <legend className="block mb-2 text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300 text-left">
                        Sort by
                    </legend>
                    <div className="flex">
                        <label htmlFor={recentInputId} className="flex mr-6">
                            <input
                                type="radio"
                                id={recentInputId}
                                name={sortOrderInputName}
                                onChange={() => setSortOrder('recent')}
                                defaultChecked={sortOrder === 'recent'}
                            />
                            <span className="text-gray-700 mb-2 ml-3 block text-sm font-medium">Most Recent</span>
                        </label>
                        <label htmlFor={relevantInputId} className="flex">
                            <input
                                type="radio"
                                id={relevantInputId}
                                name={sortOrderInputName}
                                onChange={() => setSortOrder('relevant')}
                                defaultChecked={sortOrder === 'relevant'}
                            />
                            <span className="text-gray-700 mb-2 ml-3 block text-sm font-medium">Most Relevant</span>
                        </label>
                    </div>
                </fieldset>
                {user && (
                    <label htmlFor={ownFilterInputId} className="w-1/2 flex justify-end pt-5">
                        <input
                            type="checkbox"
                            id={ownFilterInputId}
                            className="rounded-sm"
                            checked={ownLinks}
                            onChange={(event) => setOwnLinks(event.target.checked)}
                        />
                        <span className="text-gray-700 mb-2 ml-3 block text-sm font-medium">View my suggestions</span>
                    </label>
                )}
            </div>
            <Framer.AnimatePresence>
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
                {!getCrosslinksResponse?.data?.length && !isValidating && (
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
                {getCrosslinksResponse?.data?.length && (
                    <>
                        <div className="rounded flex flex-col gap-4">
                            {getCrosslinksResponse.data.map((crosslink, index: number) => {
                                let classes = '';
                                index === 0 ? (classes += 'rounded-t') : null;
                                index === getCrosslinksResponse.data.length - 1
                                    ? (classes += '!border-b-transparent !rounded-b')
                                    : null;

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
                            <Components.Delay delay={getCrosslinksResponse.data.length * 50}>
                                <Framer.motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: 'tween', duration: 0.75 }}
                                    className="mt-8 w-full items-center justify-between lg:flex lg:flex-row-reverse"
                                >
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
                                        Showing {offset + 1} -{' '}
                                        {limit + offset > getCrosslinksResponse.metadata.total
                                            ? getCrosslinksResponse.metadata.total
                                            : limit + offset}{' '}
                                        of {getCrosslinksResponse.metadata.total}
                                    </span>
                                </Framer.motion.div>
                            </Components.Delay>
                        )}
                    </>
                )}
            </Framer.AnimatePresence>
        </Components.Modal>
    );
};

export default RelatedPublicationsModal;
