import React from 'react';
import ClickAwayListener from 'react-click-away-listener';
import useSWR from 'swr';
import * as Router from 'next/router';
import * as SolidIcon from '@heroicons/react/solid';
import * as HeadlessUI from '@headlessui/react';
import * as Framer from 'framer-motion';

import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';

const CommandPalette: React.FC = (): React.ReactElement | null => {
    const router = Router.useRouter();
    const searchInput = React.useRef<HTMLInputElement | null>(null);
    const showCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.showCmdPalette);
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);
    const [query, setQuery] = React.useState('');
    const [searchType, setSearchType] = React.useState<Types.SearchType>('publications');

    const {
        data: { data: results = [] } = {},
        error,
        isValidating
    } = useSWR(`/${searchType}?search=${encodeURIComponent(query)}&limit=10`, null, {
        fallback: {
            '/publications': []
        },
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    const toggleSearchType = () =>
        searchType === 'publications' ? setSearchType('authors') : setSearchType('publications');

    const handleGoToSearchResults = () => {
        toggleCmdPalette();
        router.push({
            pathname: `${Config.urls.search.path}`,
            query: {
                for: searchType,
                query: query
            }
        });
    };

    React.useEffect(() => {
        if (showCmdPalette) {
            document.body.style.overflowY = 'hidden';
            searchInput.current?.focus();
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [showCmdPalette]);

    return showCmdPalette ? (
        <Components.Overlay>
            <ClickAwayListener onClickAway={() => toggleCmdPalette()}>
                <div className="mx-auto md:w-[720px]">
                    <div className="relative z-50 mx-4 flex flex-col items-center justify-between rounded-t-lg bg-grey-800 px-6 pt-4 pb-2 sm:flex-row">
                        <span className="mr-2 text-sm text-grey-100">
                            {!isValidating && !error && results?.data && 'Results found: ' + results?.data?.length}
                        </span>
                        <div className="flex items-center">
                            <span className="mr-2 text-sm text-grey-100">
                                Switch to {searchType === 'publications' ? 'user' : 'publication'} search
                            </span>
                            <HeadlessUI.Switch
                                checked={true}
                                onChange={(e) => toggleSearchType()}
                                onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === 'Enter') toggleSearchType();
                                }}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2  focus:ring-offset-2 ${
                                    searchType === 'publications'
                                        ? 'bg-teal-500 focus:ring-teal-500'
                                        : 'bg-purple-400 focus:ring-purple-300'
                                }`}
                            >
                                <span className="sr-only">Use setting</span>
                                <span
                                    aria-hidden="true"
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white-50 shadow ring-0 transition duration-200 ease-in-out ${
                                        searchType === 'publications' ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </HeadlessUI.Switch>
                        </div>
                    </div>
                    <div
                        className="relative z-50 mx-4 overflow-hidden rounded-b-lg bg-grey-800 pt-4 pb-2 shadow shadow-grey-600 dark:shadow-none "
                        aria-modal={showCmdPalette}
                    >
                        <div className="flex items-center pl-4 pb-2">
                            <input
                                ref={searchInput}
                                type="text"
                                placeholder={`Search ${searchType}`}
                                className="w-full rounded bg-transparent px-2 py-1 text-base leading-loose tracking-wide text-white-50 outline-0 focus:ring-2 focus:ring-yellow-500"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === 'Enter') handleGoToSearchResults();
                                }}
                            />
                            <button
                                type="button"
                                onClick={(e) => handleGoToSearchResults()}
                                className="mr-2 rounded-lg py-2 px-2 outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                <SolidIcon.SearchIcon
                                    className={`h-6 w-6 ${
                                        searchType === 'publications' ? 'text-teal-500' : 'text-purple-300'
                                    }`}
                                />
                            </button>
                        </div>
                        <Framer.AnimatePresence>
                            {!isValidating && !error && results?.data?.length && (
                                <Framer.motion.div
                                    initial="hidden"
                                    animate="show"
                                    exit={{ maxHeight: 50, opacity: 0 }}
                                    variants={{
                                        hidden: { maxHeight: 50, opacity: 0 },
                                        show: {
                                            opacity: 1,
                                            maxHeight: 400
                                        }
                                    }}
                                    className="scrollbar-vert overflow-y-auto"
                                >
                                    {results?.data.map((result: any, index: number) => {
                                        if (searchType === 'publications') {
                                            return (
                                                <Components.CommandPaletteResult
                                                    key={result.id}
                                                    id={result.id}
                                                    title={result.title}
                                                    excerpt={`${result.user.firstName[0]}. ${result.user.lastName}`}
                                                    link={`${Config.urls.viewPublication.path}/${result.id}`}
                                                    meta={Helpers.formatPublicationType(result.type)}
                                                    date={Helpers.formatDate(result.publishedDate)}
                                                    accentColor={'text-teal-300'}
                                                    className={`${index === 0 ? 'mt-2' : ''} ${
                                                        index === results.length - 1 ? 'mb-2' : ''
                                                    }`}
                                                />
                                            );
                                        }

                                        if (searchType === 'authors') {
                                            return (
                                                <Components.CommandPaletteResult
                                                    key={result.id}
                                                    id={result.id}
                                                    title={`${result.firstName} ${result?.lastName}`}
                                                    link={`${Config.urls.viewUser.path}/${result.id}`}
                                                    accentColor={'text-purple-300'}
                                                    className={`${index === 0 ? 'mt-2' : ''} ${
                                                        index === results.length - 1 ? 'mb-2' : ''
                                                    }`}
                                                />
                                            );
                                        }
                                    })}
                                </Framer.motion.div>
                            )}

                            {!isValidating && !error && results?.data?.length === 0 && (
                                <Framer.motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-center px-6 pb-4 pt-4"
                                >
                                    <span className="text-sm text-teal-500">No results found for `{query}`</span>
                                </Framer.motion.div>
                            )}

                            {!isValidating && error && (
                                <Framer.motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-center px-6 pb-4 pt-4"
                                >
                                    <span className="text-sm text-pink-500 dark:text-pink-300">
                                        There was a problem fetching publications.
                                    </span>
                                </Framer.motion.div>
                            )}
                        </Framer.AnimatePresence>
                    </div>
                </div>
            </ClickAwayListener>
        </Components.Overlay>
    ) : null;
};

export default CommandPalette;
