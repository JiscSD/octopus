import { FC, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ClickAwayListener from 'react-click-away-listener';

import * as Lib from '@lib';
import * as Config from '@config';
import * as Components from '@components';

type Props = {
    results: Lib.I.SearchResult[];
};

const SearchResults: FC<Props> = (props): JSX.Element => {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        if (props.results.length) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [props.results]);

    return (
        <AnimatePresence>
            {open && (
                <ClickAwayListener onClickAway={toggle}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                        exit={{ opacity: 0 }}
                        className="absolute max-h-72 overflow-y-auto overflow-x-hidden z-20 top-full p-6 mt-4 left-0 w-full rounded bg-white dark:bg-grey-800 text-grey-800 dark:text-white shadow transition-colors duration-500"
                    >
                        <ul>
                            {props.results.map((result, index) => (
                                <li key={result.id} className="mb-6 pb-4 border-b border-grey-700">
                                    <Components.Link
                                        href={`${Config.urls.viewPublication.path}/${result.url_slug}`}
                                        className="block rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                                    >
                                        <div className="">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex mb-2">
                                                    <h5 className="mr-4">{result.title}</h5>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium uppercase tracking-wider text-xs text-grey-300">
                                                    {result.doi}
                                                </span>
                                                <span className="text-sm text-grey-700 dark:text-grey-200">
                                                    {Lib.H.formatDate(result.createdAt)}
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
