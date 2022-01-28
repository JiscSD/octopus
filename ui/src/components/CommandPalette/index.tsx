import React from 'react';
import { useRouter } from 'next/router';
import ClickAwayListener from 'react-click-away-listener';
import * as SolidIcon from '@heroicons/react/solid';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as Mocks from '@mocks';

type SearchType = 'publications' | 'authors';

const CommandPalette: React.FC = (): JSX.Element => {
    const router = useRouter();
    const searchInput = React.useRef<HTMLInputElement | null>(null);
    const [query, setQuery] = React.useState('');
    // @ts-ignore
    const [results, setResults] = React.useState<Interfaces.Publication[]>([
        Mocks.testData.testSinglePublication,
        Mocks.testData.testSinglePublication2,
        Mocks.testData.testSinglePublication3,
        Mocks.testData.testSinglePublication,
        Mocks.testData.testSinglePublication2,
        Mocks.testData.testSinglePublication3
    ]);
    const [searchFor, setSearchFor] = React.useState<SearchType>('publications');
    const showCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.showCmdPalette);
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);

    const handleGoToSearchResults = () => {
        toggleCmdPalette(); // Close palette before going to results page
        router.push(`${Config.urls.search.path}?for=${searchFor}&query=${query}`);
    };

    React.useEffect(() => {
        if (showCmdPalette) {
            searchInput.current?.focus();
        } else {
            setQuery('');
        }
    }, [showCmdPalette]);

    React.useEffect(() => {
        if (results.length) {
        }
    }, [results]);

    return (
        showCmdPalette && (
            <Components.Overlay>
                <ClickAwayListener onClickAway={() => toggleCmdPalette()}>
                    <div className="relative z-50 mx-4 overflow-hidden rounded-lg bg-teal-50 py-1 shadow shadow-grey-600 dark:bg-grey-700 dark:shadow-none lg:w-[600px]">
                        <div className="mb-2 flex items-center pl-4">
                            <input
                                ref={searchInput}
                                type="text"
                                placeholder="Search publications"
                                className="w-full rounded bg-transparent px-2 text-sm leading-loose tracking-wide outline-0 focus:ring-2 focus:ring-yellow-500 dark:text-white"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleGoToSearchResults();
                                }}
                            />
                            <div className="rounded-l-lg py-2 px-4">
                                <SolidIcon.SearchIcon className="h-6 w-6 text-teal-500" />
                            </div>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {results.map((result) => (
                                <Components.PublicationResult
                                    key={result.id}
                                    id={result.id}
                                    title={result.title}
                                    createdBy={`${result.user.firstName}. ${result.user.lastName}`}
                                    date={result.createdAt}
                                    type={result.type}
                                />
                            ))}
                        </div>
                        {/* <Components.Link
                            href={`${Config.urls.search.path}?for=${searchFor}&query=${query}`}
                            className={`${results.length > 0 ? '' : ''}`}
                        >
                            <span>hello</span>
                        </Components.Link> */}
                        {/* <button type="button" onClick={() => handleGoToSearchResults()}>
                            See more results
                        </button> */}
                    </div>
                </ClickAwayListener>
            </Components.Overlay>
        )
    );
};

export default CommandPalette;
