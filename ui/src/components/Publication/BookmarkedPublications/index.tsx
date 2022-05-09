import React from 'react';

import * as OutlineIcons from '@heroicons/react/outline';
import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';

type Props = {
    publication: Interfaces.BookmarkedPublication;
};

const BookmarkedPublications: React.FC<Props> = (props): React.ReactElement => {
    console.log(props.publication.coAuthors);
    return (
        <div className="w-full rounded border border-transparent bg-white-50 p-3 shadow transition-colors duration-500 dark:border-teal-500 dark:bg-transparent dark:shadow-none">
            <div className="lg: flex justify-between">
                <div className="flex items-end text-sm">
                    <span className="mr-2 leading-3 text-pink-500 ">
                        {Helpers.formatPublicationType(props.publication.type)}
                    </span>
                    {props.publication.publishedDate ? (
                        <span className="text-xs leading-3 text-grey-600 transition-colors duration-500 dark:text-grey-100 ">
                            Published: {Helpers.formatDate(props.publication.publishedDate)}
                        </span>
                    ) : (
                        <span className="text-xs leading-3 text-grey-600 transition-colors duration-500 dark:text-grey-100 ">
                            Last updated: {Helpers.formatDate(props.publication.updatedAt)}
                        </span>
                    )}
                </div>
                <span className="text-xs leading-3 text-teal-500 empty:hidden">{props.publication.doi}</span>
            </div>
            <span className="mt-2 block font-montserrat text-grey-800 transition-colors duration-500 dark:text-white-50">
                {props.publication.title}
            </span>
            <span className=" mt-2 block font-montserrat text-sm font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                {props.publication.user.firstName} {props.publication.user.lastName}
                {props.publication.coAuthors &&
                    props.publication.coAuthors.map(
                        (author) => ', ' + author.user.firstName + ' ' + author.user.lastName
                    )}
            </span>
        </div>
    );
};

export default BookmarkedPublications;
