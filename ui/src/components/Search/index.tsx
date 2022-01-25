import React from 'react';
import { SearchIcon } from '@heroicons/react/outline';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Mocks from '@mocks';

const Search: React.FC = (): JSX.Element => {
    const [results, setResults] = React.useState<Interfaces.SearchResult[]>([]);

    const lookup = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 1) {
            setResults(Mocks.testData.testResults);
        } else {
            setResults([]);
        }
    };

    return (
        <div className="relative rounded-md bg-white py-6 px-6 shadow-md transition-colors duration-500 dark:bg-grey-800">
            <h2 className="mb-4 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white">
                A new way to publish your scientific work that&apos;s fast, free and fair.
            </h2>
            <p className="block text-base leading-6 text-grey-700 transition-colors duration-500 dark:text-grey-100">
                Designed to replace jounrals and papers as the place to establish priority and record your work in full
                detail.
            </p>
            <div className="mt-10 mb-6">
                <label
                    htmlFor="search-input"
                    className="mt-1 flex rounded border border-grey-50 bg-white shadow-md transition-colors duration-500 dark:bg-grey-700"
                >
                    <span className="inline-flex items-center rounded-l-md border-r-0 p-4">
                        <SearchIcon className="h-8 w-8 text-teal-500" />
                    </span>
                    <input
                        type="text"
                        name="search-input"
                        id="search-input"
                        className="block w-full min-w-0 flex-1 rounded-none rounded-r-md bg-transparent p-4 text-grey-800 outline-0 transition-colors  duration-500 placeholder:text-grey-400 focus:ring-2 focus:ring-yellow-400 dark:text-white dark:placeholder:text-white"
                        placeholder="Search for a publication on Octopus"
                        onChange={(e) => lookup(e)}
                    />
                </label>
            </div>

            <Components.SearchResults results={results} />
        </div>
    );
};

export default Search;
