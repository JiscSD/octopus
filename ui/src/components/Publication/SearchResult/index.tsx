import React from 'react';

import * as Components from '@/components';
import * as Interfaces from '@/interfaces';
import * as Helpers from '@/helpers';
import * as Config from '@/config';

type Props = {
    publicationVersion: Interfaces.PublicationVersion;
    className?: string;
};

const SearchResult: React.FC<Props> = (props): React.ReactElement => {
    const authors = React.useMemo(() => {
        const authors = props.publicationVersion.coAuthors.map((author) => Helpers.abbreviateUserName(author.user));

        // make sure authors list include the corresponding author
        if (
            !props.publicationVersion.coAuthors.find((author) => author.linkedUser === props.publicationVersion.user.id)
        ) {
            authors.unshift(Helpers.abbreviateUserName(props.publicationVersion.user));
        }

        return authors.join(', ');
    }, [props.publicationVersion.coAuthors, props.publicationVersion.user]);

    const { flagCount, peerReviewCount } = props.publicationVersion.publication;

    return (
        <Components.SearchResult
            className={props.className}
            linkDestination={`${Config.urls.viewPublication.path}/${props.publicationVersion.versionOf}`}
        >
            <div className="col-span-11">
                <span className="leading-0 mb-2 block font-montserrat text-xs font-semibold tracking-wide text-teal-400 dark:text-teal-200">
                    {Helpers.formatPublicationType(props.publicationVersion.publication.type)}
                </span>
                <h2 className="col-span-7 mb-2 leading-6 text-grey-800 transition-colors duration-500 dark:text-white-50">
                    {props.publicationVersion.title}
                </h2>

                <div className="mb-4 block text-xs text-grey-700 transition-colors duration-500 dark:text-grey-50">
                    {props.publicationVersion.description ? (
                        <p>{props.publicationVersion.description}</p>
                    ) : props.publicationVersion.content ? (
                        Helpers.truncateString(Helpers.htmlToText(props.publicationVersion.content), 370)
                    ) : null}
                </div>
            </div>

            <div className="flex justify-between">
                <span
                    className="block overflow-hidden text-ellipsis whitespace-nowrap text-xs tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100"
                    title={authors}
                >
                    {props.publicationVersion.publishedDate
                        ? `Published ${Helpers.relativeDate(props.publicationVersion.publishedDate)}`
                        : 'Draft'}
                    , by {authors}
                </span>
                <Components.EngagementCounts flagCount={flagCount} peerReviewCount={peerReviewCount} />
            </div>
        </Components.SearchResult>
    );
};

export default SearchResult;
