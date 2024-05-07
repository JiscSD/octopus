import React from 'react';
import * as SolidIcons from '@heroicons/react/24/solid';

import * as Components from '@/components';

const Modal: React.FC = (): React.ReactElement => {
    const isValidating = false;

    const filterInputId = 'crosslink-filter';
    const recentInputId = 'sort-order-recent';
    const relevantInputId = 'sort-order-relevant';
    const ownFilterInputId = 'view-own';
    const formId = 'crosslink-search-form';

    return (
        <Components.Modal
            open={true}
            onClose={() => console.log('close')}
            loading={false}
            cancelButtonText="Cancel"
            title="Related Content"
        >
            <form name="crosslink-search-form" id={formId} onSubmit={() => console.log('form submit')}>
                <label htmlFor={filterInputId} className="relative block w-full">
                    <span className="block mb-2 text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300 text-left">
                        Search for suggested links
                    </span>
                    <input
                        id={filterInputId}
                        name="filter"
                        className="w-full rounded border border-grey-100 text-grey-700 shadow focus:ring-2 focus:ring-yellow-400"
                    />
                    <button
                        type="submit"
                        form={formId}
                        aria-label="Search related content"
                        className="absolute right-px p-2 outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-70"
                        disabled={isValidating}
                    >
                        <SolidIcons.MagnifyingGlassIcon className="h-6 w-6 text-teal-500" />
                    </button>
                </label>
                <div className="flex mt-4 items-end gap-4">
                    <fieldset className="w-1/2">
                        <legend className="block mb-2 text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300 text-left">
                            Sort by
                        </legend>
                        <div className="flex">
                            <label htmlFor={recentInputId} className="flex mr-6">
                                <input type="radio" id={recentInputId} />
                                <span className="text-gray-700 mb-2 ml-3 block text-sm font-medium">Most Recent</span>
                            </label>
                            <label htmlFor={recentInputId} className="flex">
                                <input type="radio" id={relevantInputId} />
                                <span className="text-gray-700 mb-2 ml-3 block text-sm font-medium">Most Relevant</span>
                            </label>
                        </div>
                    </fieldset>
                    <label htmlFor={ownFilterInputId} className="w-1/2 flex justify-end pt-5">
                        <input type="checkbox" id={ownFilterInputId} className="rounded-sm" />
                        <span className="text-gray-700 mb-2 ml-3 block text-sm font-medium">View my suggestions</span>
                    </label>
                </div>
            </form>
        </Components.Modal>
    );
};

export default Modal;
