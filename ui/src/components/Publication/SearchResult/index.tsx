import React from 'react';

import * as Components from '@/components';
import * as Helpers from '@/helpers';
import * as Config from '@/config';
import * as Types from '@/types';

type GenericCoAuthor = { user?: { firstName: string; lastName: string } };
type Props<T extends GenericCoAuthor> = {
    coAuthors: T[];
    content: string | null;
    description: string | null;
    flagCount?: number;
    linkDestination?: string;
    peerReviewCount?: number;
    preface?: React.ReactNode;
    publicationId: string;
    publishedDate: string | null;
    title: string;
    type: Types.PublicationType;
    className?: string;
};

const SearchResult: React.FC<Props<GenericCoAuthor>> = (props): React.ReactElement => {
    const authors = React.useMemo(() => {
        return props.coAuthors.map((author) => Helpers.abbreviateUserName(author.user)).join(', ');
    }, [props.coAuthors]);

    return (
        <Components.SearchResult
            className={props.className}
            linkDestination={props.linkDestination || `${Config.urls.viewPublication.path}/${props.publicationId}`}
        >
            <div className="col-span-11">
                {props.preface && <div className="mb-2 text-grey-800 dark:text-white-50">{props.preface}</div>}
                <p className="leading-0 mb-2 font-montserrat text-xs font-semibold tracking-wide text-teal-400 dark:text-teal-200">
                    {Helpers.formatPublicationType(props.type)}
                </p>
                <p className="col-span-7 mb-2 leading-6 text-grey-800 transition-colors duration-500 dark:text-white-50">
                    {props.title}
                </p>

                <div className="mb-4 block text-xs text-grey-700 transition-colors duration-500 dark:text-grey-50">
                    {props.description ? (
                        <p>{props.description}</p>
                    ) : props.content ? (
                        Helpers.truncateString(Helpers.htmlToText(props.content), 370)
                    ) : null}
                </div>
            </div>

            <div className="flex justify-between">
                <p
                    className="overflow-hidden text-ellipsis whitespace-nowrap text-xs tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100"
                    data-testid="published-date-with-authors"
                    title={authors}
                >
                    {props.publishedDate ? (
                        <>
                            Published <time suppressHydrationWarning>{Helpers.formatDate(props.publishedDate)}</time>
                        </>
                    ) : (
                        'Draft'
                    )}
                    , by {authors}
                </p>
                <Components.EngagementCounts flagCount={props.flagCount} peerReviewCount={props.peerReviewCount} />
            </div>
        </Components.SearchResult>
    );
};

export default SearchResult;
