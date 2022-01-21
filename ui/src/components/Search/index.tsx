import { ChangeEvent, FC, useState } from 'react';
import { SearchIcon } from '@heroicons/react/outline';

import * as Components from '@components';
import * as Lib from '@lib';
import * as Mocks from '@mocks';

const Search: FC = (): JSX.Element => {
    const [results, setResults] = useState<Lib.I.SearchResult[]>([]);

    const lookup = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 1) {
            setResults(Mocks.testData.testResults);
        } else {
            setResults([]);
        }
    };

    return (
        <div className="relative py-6 px-6 bg-white dark:bg-grey-800 rounded-md shadow-md transition-colors duration-500">
            <h2 className="block mb-4 font-montserrat font-bold text-lg text-grey-800 dark:text-white transition-colors duration-500">
                A new way to publish your scientific work that&apos;s fast, free and fair.
            </h2>
            <p className="block text-base leading-6 text-grey-700 dark:text-grey-100 transition-colors duration-500">
                Designed to replace jounrals and papers as the place to establish priority and record your work in full
                detail.
            </p>
            <div className="mt-10 mb-6">
                <label
                    htmlFor="search-input"
                    className="mt-1 flex rounded shadow-md border border-grey-50 bg-white dark:bg-grey-700 transition-colors duration-500"
                >
                    <span className="inline-flex items-center p-4 rounded-l-md border-r-0">
                        <SearchIcon className="text-teal-500 w-8 h-8" />
                    </span>
                    <input
                        type="text"
                        name="search-input"
                        id="search-input"
                        className="flex-1 min-w-0 block w-full p-4 bg-transparent rounded-none rounded-r-md outline-0 focus:ring-2 focus:ring-yellow-400  text-grey-800 dark:text-white placeholder:text-grey-400 dark:placeholder:text-white transition-colors duration-500"
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
