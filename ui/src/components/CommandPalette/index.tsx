import React from 'react';
import { useRouter } from 'next/router';
import ClickAwayListener from 'react-click-away-listener';
import * as SolidIcon from '@heroicons/react/solid';
import { Switch } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import _ from 'lodash';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Assets from '@assets';
import * as Types from '@types';
import * as API from '@api';

type SearchType = 'publications' | 'users';

const CommandPalette: React.FC = (): JSX.Element => {
    const router = useRouter();
    const searchInput = React.useRef<HTMLInputElement | null>(null);
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState<Interfaces.Publication[]>([]);
    const [resultsMeta, setResultsMeta] = React.useState<Interfaces.SearchResultMeta | null>();
    const [resultsError, setResultsError] = React.useState<string | null>();
    const [loading, setLoading] = React.useState(false);
    const [searchFor, setSearchFor] = React.useState<SearchType>('publications');
    const showCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.showCmdPalette);
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);

    const toggleSearchType = () =>
        searchFor === 'publications' ? setSearchFor('users') : setSearchFor('publications');

    const handleGoToSearchResults = () => {
        toggleCmdPalette();
        router.push(`${Config.urls.search.path}?for=${searchFor}&query=${query}`);
    };

    const debouncedSearch = _.debounce(async (value: string) => {
        const endpoint = searchFor === 'users' ? Config.endpoints.users : Config.endpoints.publications;

        try {
            const response = await API.get(`${endpoint}?limit=10&search=${value}`);
            if (!response.data.data.length) throw new Config.CustomErros.SearchThrowError('No results found.');
            setResults(response.data.data);
            setResultsMeta(response.data.metadata);
            setResultsError(null);
            setLoading(false);
        } catch (err) {
            if (err instanceof Config.CustomErros.SearchThrowError) {
                setResultsError(err.message);
            } else {
                setResultsError('There was an problem fetching results.');
            }
            setLoading(false);
        }
    }, 800);

    const handleSearchRequest = (value: string) => {
        setQuery(value);
        if (value.length) {
            setLoading(true);
            debouncedSearch(value);
        } else {
            setResults([]);
        }
    };

    React.useEffect(() => {
        setQuery('');
        setResults([]);
        setResultsMeta(null);
        setResultsError(null);
        searchInput.current?.focus();
    }, [searchFor]);

    React.useEffect(() => {
        if (showCmdPalette) {
            document.body.style.overflowY = 'hidden';
            searchInput.current?.focus();
        } else {
            document.body.style.overflowY = 'auto';
            setQuery('');
        }
    }, [showCmdPalette]);

    return (
        showCmdPalette && (
            <Components.Overlay>
                <ClickAwayListener onClickAway={() => toggleCmdPalette()}>
                    <div className="mx-auto md:w-[620px]">
                        <div className="relative z-50 mx-4 flex items-center justify-between rounded-t-lg bg-grey-800 px-6 pt-4 pb-2">
                            <span className="mr-2 text-sm text-grey-100">
                                {resultsMeta && 'Results found: ' + resultsMeta.total}
                            </span>
                            <div className="flex items-center">
                                <span className="mr-2 text-sm text-grey-100">
                                    Switch to {searchFor === 'publications' ? 'user' : 'publication'} search
                                </span>
                                <Switch
                                    checked={true}
                                    onChange={(e) => toggleSearchType()}
                                    onKeyDown={(e: React.KeyboardEvent) => {
                                        if (e.key === 'Enter') toggleSearchType();
                                    }}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2  focus:ring-offset-2 ${
                                        searchFor === 'publications'
                                            ? 'bg-teal-500 focus:ring-teal-500'
                                            : 'bg-purple-400 focus:ring-purple-300'
                                    }`}
                                >
                                    <span className="sr-only">Use setting</span>
                                    <span
                                        aria-hidden="true"
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            searchFor === 'publications' ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </Switch>
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
                                    placeholder={`Search ${searchFor}`}
                                    className="w-full rounded bg-transparent px-2 py-1 text-base leading-loose tracking-wide text-white outline-0 focus:ring-2 focus:ring-yellow-500"
                                    value={query}
                                    onChange={(e) => handleSearchRequest(e.target.value)}
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
                                            searchFor === 'publications' ? 'text-teal-500' : 'text-purple-300'
                                        }`}
                                    />
                                </button>
                            </div>
                            <AnimatePresence>
                                {loading && (
                                    <div className="flex justify-center px-6 py-4">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.1, 1, 1.1, 1],
                                                rotate: [0, 400, 0, 400, 0],
                                                opacity: 1
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 3.5,
                                                type: 'spring',
                                                stiffness: 1
                                            }}
                                            initial={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Assets.Logo
                                                height={50}
                                                width={50}
                                                className={
                                                    searchFor === 'publications' ? 'fill-teal-500' : 'fill-purple-300'
                                                }
                                            />
                                        </motion.div>
                                    </div>
                                )}
                                {!loading && !resultsError && results.length > 0 && (
                                    <motion.div
                                        initial="hidden"
                                        animate="show"
                                        exit={{ maxHeight: 0, opacity: 0 }}
                                        variants={{
                                            hidden: { maxHeight: 0, opacity: 0 },
                                            show: {
                                                opacity: 1,
                                                maxHeight: 400,
                                                transition: {
                                                    staggerChildren: 0.5
                                                }
                                            }
                                        }}
                                        className="scrollbar-vert overflow-y-auto"
                                    >
                                        {results.map((result, index) => {
                                            if (searchFor === 'publications') {
                                                return (
                                                    <Components.PublicationSearchResult
                                                        key={result.id}
                                                        id={result.id}
                                                        title={result.title}
                                                        createdBy={`${result.user.firstName}. ${result.user.lastName}`}
                                                        date={result.createdAt}
                                                        type={result.type}
                                                        accent={
                                                            searchFor === 'publications'
                                                                ? 'text-teal-500'
                                                                : 'text-purple-300'
                                                        }
                                                        className={`${index === 0 ? 'mt-2' : ''} ${
                                                            index === results.length - 1 ? 'mb-2' : ''
                                                        }`}
                                                    />
                                                );
                                            }

                                            if (searchFor === 'users') {
                                                return <Components.UserSearchResult key={result.id} id={result.id} />;
                                            }
                                        })}
                                    </motion.div>
                                )}
                                {!loading && resultsError && (
                                    <motion.div
                                        initial={{ opacity: 1 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex justify-center px-6 pb-4 pt-4"
                                    >
                                        <span className="text-sm text-pink-500 dark:text-pink-300">{resultsError}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </ClickAwayListener>
            </Components.Overlay>
        )
    );
};

export default CommandPalette;
