import React from 'react';
import parse from 'html-react-parser';
import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Config from '@config';

type Props = {
    publication: Interfaces.Publication;
    className?: string;
};

const SearchResult: React.FC<Props> = (props): React.ReactElement => {
    const authors = React.useMemo(() => {
        const authors = props.publication.coAuthors.map(
            (author) => `${author.user?.firstName[0]}. ${author.user?.lastName}`
        );

        // make sure authors list include the corresponding author
        if (!props.publication.coAuthors.find((author) => author.linkedUser === props.publication.user.id)) {
            const { firstName, lastName } = props.publication.user;
            authors.unshift(`${firstName[0]}. ${lastName}`);
        }

        return authors.join(', ');
    }, [props.publication.coAuthors, props.publication.user]);

    return (
        <Framer.motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', duration: 0.35 }}
        >
            <Components.Link
                href={`${Config.urls.viewPublication.path}/${props.publication.id}`}
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
            py-4
            px-4
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
                    <span className="leading-0 mb-2 block font-montserrat text-xs font-semibold tracking-wide text-teal-400 dark:text-teal-200">
                        {Helpers.formatPublicationType(props.publication.type)}
                    </span>
                    <h2 className="col-span-7 mb-2 leading-6 text-grey-800 transition-colors duration-500 dark:text-white-50">
                        {props.publication.title}
                    </h2>

                    <div className="mb-4 block text-xs text-grey-700 transition-colors duration-500 dark:text-grey-50">
                        {props.publication.description ? (
                            <p>{props.publication.description}</p>
                        ) : props.publication.content ? (
                            parse(Helpers.truncateString(props.publication.content, 370))
                        ) : null}
                    </div>

                    <span
                        className="block overflow-hidden text-ellipsis whitespace-nowrap text-xs tracking-wide text-grey-800 transition-colors duration-500 dark:text-grey-100"
                        title={authors}
                    >
                        {props.publication.publishedDate
                            ? `Published ${Helpers.relativeDate(props.publication.publishedDate)}`
                            : 'Draft'}
                        , by {authors}
                    </span>
                </div>

                <div className="lg: col-span-1 mt-4 hidden h-full w-full items-center justify-end lg:mt-0 lg:flex">
                    <OutlineIcons.ChevronRightIcon className="h-5 w-5 text-teal-400" />
                </div>
            </Components.Link>
        </Framer.motion.div>
    );
};

export default SearchResult;
