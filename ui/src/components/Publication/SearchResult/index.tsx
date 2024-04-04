import React from 'react';
import parse from 'html-react-parser';
import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/24/outline';

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
        const authors = props.publicationVersion.coAuthors.map(
            (author) => `${author.user?.firstName[0]}. ${author.user?.lastName}`
        );

        // make sure authors list include the corresponding author
        if (
            !props.publicationVersion.coAuthors.find((author) => author.linkedUser === props.publicationVersion.user.id)
        ) {
            const { firstName, lastName } = props.publicationVersion.user;
            authors.unshift(`${firstName[0]}. ${lastName}`);
        }

        return authors.join(', ');
    }, [props.publicationVersion.coAuthors, props.publicationVersion.user]);

    const { flagCount, peerReviewCount } = props.publicationVersion.publication;

    return (
        <Framer.motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', duration: 0.35 }}
        >
            <Components.Link
                href={`${Config.urls.viewPublication.path}/${props.publicationVersion.versionOf}`}
                role="button"
                className={`
            grid
            min-h-[4rem]
            grid-cols-1
            items-start
            overflow-hidden
            rounded-none
            border-b
            border-grey-50
            bg-white-50
            px-4
            py-4
            shadow
            outline-0
            transition-colors
            duration-500
            hover:opacity-95
            focus:overflow-hidden
            focus:border-transparent
            focus:opacity-95
            focus:ring-2
            focus:ring-yellow-500
            dark:border-grey-600
            dark:bg-grey-700
            lg:grid-cols-12
            ${props.className ? props.className : ''}
            `}
            >
                <div className="z-10 col-span-11 w-full">
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
                                parse(Helpers.truncateString(props.publicationVersion.content, 370))
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
                </div>

                <div className="lg: col-span-1 mt-4 hidden h-full w-full items-center justify-end lg:mt-0 lg:flex">
                    <OutlineIcons.ChevronRightIcon className="h-5 w-5 text-teal-400" />
                </div>
            </Components.Link>
        </Framer.motion.div>
    );
};

export default SearchResult;
