import React from 'react';
import * as Framer from 'framer-motion';

import * as Components from '@/components';
import * as Helpers from '@/helpers';

type Props = {
    className?: string;
    error?: string;
    isValidating: boolean;
    limit: number;
    noResultsMessage?: string;
    offset: number;
    results: React.ReactNode;
    setOffset: (offset: React.SetStateAction<number>) => void;
    total: number;
};
const PaginatedResults: React.FC<Props> = (props: Props) => {
    const upperPageBound = props.limit + props.offset > props.total ? props.total : props.limit + props.offset;
    return (
        <article className={props.className}>
            <div aria-live="polite" className="sr-only">
                {props.error ? props.error : `${props.total} result${props.total !== 1 ? 's' : ''}`}
            </div>
            {props.error ? (
                <Components.Alert severity="ERROR" title={props.error} />
            ) : (
                <Framer.AnimatePresence>
                    {!props.error && props.total === 0 && !props.isValidating && (
                        <Components.Alert
                            key="no-results-alert"
                            severity="INFO"
                            title="No results found"
                            details={
                                props.noResultsMessage
                                    ? [props.noResultsMessage]
                                    : [
                                          'Try some different search criteria.',
                                          'If you think something is wrong, please contact the helpdesk.'
                                      ]
                            }
                        />
                    )}
                    {props.results}
                    {!props.isValidating && props.total > 0 && (
                        <Framer.motion.div
                            key="pagination-controls"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'tween', duration: 0.75 }}
                            className="mt-8 w-full justify-between lg:flex lg:flex-row-reverse"
                        >
                            <div className="flex justify-between">
                                <Components.Button
                                    className="mr-6"
                                    onClick={() => {
                                        props.setOffset(props.offset - props.limit);
                                        Helpers.scrollTopSmooth();
                                    }}
                                    disabled={props.offset === 0}
                                    title="Previous"
                                />
                                <Components.Button
                                    onClick={() => {
                                        props.setOffset(props.offset + props.limit);
                                        Helpers.scrollTopSmooth();
                                    }}
                                    disabled={props.limit + props.offset >= props.total}
                                    title="Next"
                                />
                            </div>
                            <span
                                id="pagination-info"
                                className="mt-4 block font-medium text-grey-800 transition-colors duration-500 dark:text-white-50"
                            >
                                Showing {props.offset + 1} - {upperPageBound} of {props.total}
                            </span>
                        </Framer.motion.div>
                    )}
                </Framer.AnimatePresence>
            )}
        </article>
    );
};

export default PaginatedResults;
