import { FC, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ClickAwayListener from 'react-click-away-listener';

import * as Interfaces from '@interfaces';
import * as Config from '@config';
import * as Components from '@components';
import * as Helpers from '@helpers';

type Props = {
    results: Interfaces.SearchResult[];
};

const SearchResults: FC<Props> = (props): JSX.Element => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (props.results.length) setOpen((prevState) => !prevState);
    }, [props.results]);

    return (
        <AnimatePresence>
            {open && (
                <ClickAwayListener onClickAway={() => setOpen((prevState) => !prevState)}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-full left-0 z-20 mt-4 max-h-72 w-full overflow-y-auto overflow-x-hidden rounded bg-white p-6 text-grey-800 shadow transition-colors duration-500 dark:bg-grey-800 dark:text-white"
                    >
                        <ul>
                            {props.results.map((result, index) => (
                                <li key={result.id} className="mb-6 border-b border-grey-700 pb-4">
                                    <Components.Link
                                        href={`${Config.urls.viewPublication.path}/${result.url_slug}`}
                                        className="block rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                                    >
                                        <div className="">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className="mb-2 flex">
                                                    <h5 className="mr-4">{result.title}</h5>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium uppercase tracking-wider text-grey-300">
                                                    {result.doi}
                                                </span>
                                                <span className="text-sm text-grey-700 dark:text-grey-200">
                                                    {Helpers.formatDate(result.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </Components.Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </ClickAwayListener>
            )}
        </AnimatePresence>
    );
};

export default SearchResults;
